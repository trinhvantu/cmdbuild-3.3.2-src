package org.cmdbuild.jobs.inner;

import com.google.common.base.Joiner;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Maps.uniqueIndex;
import com.google.common.eventbus.Subscribe;
import static java.lang.String.format;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import org.cmdbuild.cluster.ClusterService;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.config.JobsConfiguration;
import org.cmdbuild.config.SchedulerConfiguration;
import org.cmdbuild.config.api.ConfigListener;
import org.cmdbuild.jobs.JobData;
import org.cmdbuild.jobs.JobRunService;
import org.cmdbuild.requestcontext.RequestContextService;
import org.cmdbuild.scheduler.JobSource;
import org.cmdbuild.scheduler.JobUpdatedEvent;
import org.cmdbuild.scheduler.ScheduledJobInfo;
import org.cmdbuild.scheduler.ScheduledJobInfoImpl;
import org.cmdbuild.scheduler.SchedulerException;
import org.cmdbuild.scheduler.SchedulerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.services.PostStartup;
import org.cmdbuild.services.MinionStatus;
import org.cmdbuild.services.PreShutdown;
import org.cmdbuild.services.MinionComponent;
import static org.cmdbuild.services.MinionStatus.MS_READY;
import static org.cmdbuild.services.MinionStatus.MS_DISABLED;
import static org.cmdbuild.services.MinionStatus.MS_NOTRUNNING;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;
import org.slf4j.MDC;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import org.cmdbuild.utils.sked.Sked;
import static org.cmdbuild.utils.sked.Sked.newSkedService;
import org.cmdbuild.utils.sked.SkedEnv;
import org.cmdbuild.utils.sked.SkedJob;
import org.cmdbuild.utils.sked.SkedJobImpl;
import org.cmdbuild.utils.sked.SkedService;

@Component
@MinionComponent(name = "Scheduler Service (core)", configBean = SchedulerConfiguration.class, canStartStop = true)
public class SchedulerServiceImpl implements SchedulerService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ClusterService clusterService;
    private final SchedulerConfiguration schedulerConfiguration;
    private final Map<String, JobSource> jobSources;
    private final JobRunService runService;
    private final RequestContextService contextService;

    private SkedService scheduler;

    public SchedulerServiceImpl(JobRunService runService, List<JobSource> jobSources, ClusterService clusterService, SchedulerConfiguration schedulerConfiguration, RequestContextService contextService) {
        this.schedulerConfiguration = checkNotNull(schedulerConfiguration);
        this.runService = checkNotNull(runService);
        this.clusterService = checkNotNull(clusterService);
        this.contextService = checkNotNull(contextService);
        this.jobSources = uniqueIndex(jobSources, JobSource::getJobSourceName);
        jobSources.forEach((s) -> s.register(new Object() {
            @Subscribe
            public void handleJobUpdateEvent(JobUpdatedEvent event) {
                try {
                    reconfigureJobs(event);
                } catch (Exception ex) {
                    logger.error("error processing job update event = {}", event, ex);
                }
            }

        }));
    }

    public MinionStatus getServiceStatus() {
        if (isRunning()) {
            return MS_READY;
        } else if (!schedulerConfiguration.isEnabled()) {
            return MS_DISABLED;
        } else {
            return MS_NOTRUNNING;
        }
    }

    @PostStartup
    public void startup() {
        if (schedulerConfiguration.isEnabled()) {
            doStartService();
        } else {
            logger.info("system scheduler not enabled");
        }
    }

    @PreShutdown
    public void stopService() {
        destroySchedulerSafe();
    }

    @Override
    public List<ScheduledJobInfo> getConfiguredJobs() {
        List<ScheduledJobInfo> list = list();
        if (isRunning()) {
            scheduler.getJobInfos().stream().map(j -> ScheduledJobInfoImpl.builder()
                    .withCode(j.getCode())
                    .withTrigger(j.getJob().getTrigger())
                    .withRunning(j.isRunning())
                    .withLastRun(j.getLastRun())
                    .build()).forEach(list::add);
        }
        return list;
    }

    @Override
    public void runJob(String code) {
        if (isRunning()) {
            scheduler.runJobNow(code);
        } else {
            try (SkedService sked = newSkedService()) {
                sked.addJobs(buildSkedJobList()).runJobNow(code);
            }
        }
    }

    @ConfigListener(configs = {SchedulerConfiguration.class, JobsConfiguration.class})
    public synchronized void reloadScheduler() {
        logger.info("reloading system scheduler");
        try {
            destroySchedulerSafe();
            if (schedulerConfiguration.isEnabled()) {
                doStartService();
            }
        } catch (Exception ex) {
            throw new SchedulerException(ex);
        }
    }

    @Override
    public void runJobsForTimeRange(ZonedDateTime startInclusive, ZonedDateTime endInclusive) {
        logger.info("run all jobs from time =< {} > to time =< {} >", toIsoDateTime(startInclusive), toIsoDateTime(endInclusive));
        try (SkedService sked = newSkedService()) {
            sked.addJobs(buildSkedJobList()).runJobsInclusive(startInclusive, endInclusive);
        }
    }

    private synchronized void doStartService() {
        if (isRunning()) {
            logger.warn("already running - ignore start request");
        } else {
            logger.info("start system scheduler service");
            try {
                startScheduler();
            } catch (Exception e) {
                throw new SchedulerException(e);
            }
        }
    }

    private boolean isRunning() {
        try {
            return scheduler != null && scheduler.isRunning();
        } catch (Exception ex) {
            logger.warn("error checking scheduler status", ex);
            return false;
        }
    }

    private synchronized void destroySchedulerSafe() {
        if (scheduler != null) {
            logger.info("stop scheduler service");
            try {
                if (scheduler.isRunning()) {
                    scheduler.stop();
                }
                checkArgument(scheduler.isShutdown(), "scheduler failed to stop");
            } catch (Exception ex) {
                logger.warn(marker(), "error stopping scheduler", ex);
            }
            scheduler = null;
            logger.info("system scheduler service stopped");
        }
    }

    private synchronized void reconfigureJobs(JobUpdatedEvent event) throws Exception {
        if (isRunning()) {
            doReconfigureJobs();
        }
    }

    private synchronized void startScheduler() throws Exception {
        logger.info("preparing system scheduler with job sources = {}", Joiner.on(",").join(jobSources.keySet()));
        checkArgument(scheduler == null);
        doReconfigureJobs();
    }

    private synchronized void doReconfigureJobs() throws Exception {
        destroySchedulerSafe();
        logger.info("start scheduler service");
        scheduler = Sked.startSkedService(new MySkedEnv()).withJobs(buildSkedJobList());
    }

    private List<SkedJob> buildSkedJobList() {
        return jobSources.values().stream().flatMap((js) -> js.getJobs().stream().map(j -> buildJob(js, j))).collect(toImmutableList());
    }

    private SkedJob buildJob(JobSource jobSource, JobData job) {
        checkNotNull(jobSource);
        checkNotNull(job);
        String jobCode = format("%s.%s", jobSource.getJobSourceName(), job.getCode());
        String cronExpression = job.getCronExpression();
        if (!job.cronExpressionHasSeconds()) {
            cronExpression = "0 " + cronExpression;
        }
        logger.debug("prepare job runner for source = {} job = {}", jobSource, jobCode);
        return SkedJobImpl.builder()
                .withCode(jobCode)
                .withTrigger(cronExpression)
                .withClusterMode(job.getClusterMode())
                .withRunnable(() -> {
                    MDC.put("cm_type", "job");
                    MDC.put("cm_id", "sked");
                    contextService.initCurrentRequestContext("sked job service");
                    logger.debug("start job =< {} >", jobCode);
                    try {
                        runService.runJobSafe(job);
                        logger.debug("completed job =< {} >", jobCode);
                    } catch (Exception ex) {
                        logger.error("error running job =< {} >", jobCode, ex);
                    } finally {
                        contextService.destroyCurrentRequestContext();
                        MDC.clear();
                    }
                })
                .build();
    }

    private class MySkedEnv implements SkedEnv {

        @Override
        public boolean isMasterNode() {
            return clusterService.isSingleActiveNode() || clusterService.isFirstNode();
        }

        @Override
        public boolean isMasterNodeForJob(String job, ZonedDateTime fireTimestamp) {
            return clusterService.isSingleActiveNode() || clusterService.isActiveNodeForKey(key(job, fireTimestamp.toEpochSecond()));
        }

    }

}
