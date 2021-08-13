/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.jobs.inner;

import static com.google.common.base.Objects.equal;
import org.cmdbuild.jobs.JobRunService;
import org.cmdbuild.jobs.beans.JobRunImpl;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Stopwatch;
import com.google.common.eventbus.EventBus;
import static java.lang.String.format;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import javax.annotation.Nullable;
import javax.annotation.PreDestroy;
import javax.inject.Provider;
import org.cmdbuild.audit.ErrorMessagesData;
import org.cmdbuild.auth.session.SessionService;
import org.cmdbuild.cluster.NodeIdProvider;
import static org.cmdbuild.utils.lang.EventBusUtils.logExceptions;
import org.cmdbuild.jobs.JobData;
import org.cmdbuild.jobs.JobException;
import static org.cmdbuild.jobs.JobExecutorService.JOBUSER_SYSTEM;
import org.cmdbuild.jobs.JobRun;
import org.cmdbuild.jobs.JobRunRepository;
import org.cmdbuild.jobs.JobSessionService;
import org.cmdbuild.jobs.JobRunContext;
import static org.cmdbuild.jobs.JobRunStatus.JRS_COMPLETED;
import static org.cmdbuild.jobs.JobRunStatus.JRS_FAILED;
import static org.cmdbuild.jobs.JobRunStatus.JRS_RUNNING;
import org.cmdbuild.jobs.JobRunnerRepository;
import org.cmdbuild.lock.AutoCloseableItemLock;
import static org.cmdbuild.lock.LockScope.LS_REQUEST;
import org.cmdbuild.lock.LockService;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.lang.CmExecutorUtils.shutdownQuietly;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.utils.lang.CmExecutorUtils.awaitCompletionIgnoreInterrupt;
import static org.cmdbuild.utils.lang.CmExecutorUtils.namedThreadFactory;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.random.CmRandomUtils.randomId;
import static org.cmdbuild.utils.sked.SkedJobClusterMode.RUN_ON_SINGLE_NODE;
import org.slf4j.MDC;
import org.cmdbuild.fault.FaultEventCollector;
import org.cmdbuild.fault.FaultEventCollectorService;
import org.cmdbuild.jobs.JobSessionService.JobSessionContext;
import org.cmdbuild.jobs.beans.JobDataImpl;
import org.cmdbuild.requestcontext.RequestContextService;
import static org.cmdbuild.utils.lang.CmExecutorUtils.executorService;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;

@Component
public class JobRunServiceImpl implements JobRunService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final JobRunRepository jobRunRepository;
    private final FaultEventCollectorService errorAndWarningCollectorService;
    private final JobSessionService jobSessionService;
    private final Provider<JobRunnerRepository> jobRunnerRepository;
    private final NodeIdProvider nodeIdProvider;
    private final LockService lockService;
    private final SessionService sessionService;

    private final EventBus eventBus = new EventBus(logExceptions(logger));

    private final ExecutorService executorService;

    public JobRunServiceImpl(SessionService sessionService, RequestContextService contextService, JobRunRepository jobRunRepository, FaultEventCollectorService errorAndWarningCollectorService, JobSessionService jobSessionService, Provider<JobRunnerRepository> jobRunnerRepository, NodeIdProvider nodeIdProvider, LockService lockService) {
        this.jobRunRepository = checkNotNull(jobRunRepository);
        this.errorAndWarningCollectorService = checkNotNull(errorAndWarningCollectorService);
        this.jobSessionService = checkNotNull(jobSessionService);
        this.jobRunnerRepository = checkNotNull(jobRunnerRepository);
        this.nodeIdProvider = checkNotNull(nodeIdProvider);
        this.lockService = checkNotNull(lockService);
        this.sessionService = checkNotNull(sessionService);
        checkNotNull(contextService);
        executorService = executorService("job_run_helper", () -> contextService.initCurrentRequestContext("background job runner"), contextService::destroyCurrentRequestContext);
    }

    @PreDestroy
    public void cleanup() {
        shutdownQuietly(executorService);
    }

    @Override
    public EventBus getEventBus() {
        return eventBus;
    }

    @Override
    public JobRun runJobSafe(JobData data) {
        return doRunJob(data, true, null);
    }

    @Override
    public JobRun runJob(JobData data) {
        return doRunJob(data, false, null);
    }

    @Override
    public Future<JobRun> runJobLater(JobData job, @Nullable Object listener) {
        logger.debug("submit batch job = {}", job);
        JobData actual = JobDataImpl.copyOf(job).accept(j -> {
            if (job.useCurrentSessionContext()) {
                j.withSessionId(sessionService.getCurrentSessionId()).withUseCurrentSessionContext(false);
            }
        }).build();
        return executorService.submit(() -> doRunJob(actual, true, listener));
    }

    public JobRun doRunJob(JobData data, boolean safe, @Nullable Object listener) {
        logger.debug("preparing execution for job = {}", data);
        JobRunner jobRunner = new JobRunner(data);
        if (listener != null) {
            jobRunner.getThisEventBus().register(listener);
        }
        try {
            jobRunner.prepareAndRunJob();
        } catch (Exception ex) {
            if (safe) {
                logger.error("error executing job = {}", data, ex);
            } else {
                throw new JobException(ex, "error executing job = %s", data);
            }
        }
        return checkNotNull(jobRunner.getJobRun(), "job run failed");
    }

    private static class JobRunCompletedEventImpl implements JobRunCompletedEvent {

        final JobData job;
        final JobRun jobRun;

        public JobRunCompletedEventImpl(JobData job, JobRun jobRun) {
            this.job = checkNotNull(job);
            this.jobRun = checkNotNull(jobRun);
        }

        @Override
        public JobData getJob() {
            return job;
        }

        @Override
        public JobRun getJobRun() {
            return jobRun;
        }

        @Override
        public String toString() {
            return "JobRunCompletedEvent{" + "job=" + job + ", jobRun=" + jobRun + '}';
        }

    }

    private class JobRunner {

        private final EventBus thisEventBus = new EventBus(logExceptions(logger));

        private final JobData job;
        private FaultEventCollector eventCollector;
        private JobRun jobRun;
        private Stopwatch stopwatch;
        private boolean success;
        private final Map<String, String> output = map();

        public JobRunner(JobData job) {
            this.job = checkNotNull(job);
        }

        public EventBus getThisEventBus() {
            return thisEventBus;
        }

        public JobRun prepareAndRunJob() throws Exception {
            prepareRun();
            try {
                if (job.useCurrentSessionContext()) {
                    executeJob();
                } else {
                    awaitCompletionIgnoreInterrupt(executorService.submit(this::setContextAndExecuteJob));
                }
                success = true;
            } catch (Exception ex) {
                success = false;
                eventCollector.addError(ex);
                throw ex;
            } finally {
                saveRunExitStatusAndErrors();
                postEvent(new JobRunCompletedEventImpl(job, jobRun));
            }
            return jobRun;
        }

        @Nullable
        public JobRun getJobRun() {
            return jobRun;
        }

        private boolean requireLock() {
            return equal(job.getClusterMode(), RUN_ON_SINGLE_NODE);
        }

        private void prepareRun() {
            jobRun = JobRunImpl.builder()
                    .withNodeId(nodeIdProvider.getClusterNodeId())
                    .withJobCode(job.getCode())
                    .withJobStatus(JRS_RUNNING)
                    .withTimestamp(now())
                    .withCompleted(false)
                    .build();
            if (job.persistJobRun()) {
                jobRun = jobRunRepository.create(jobRun);
            }
            stopwatch = Stopwatch.createStarted();
            eventCollector = errorAndWarningCollectorService.newEventCollector();
        }

        private void saveRunExitStatusAndErrors() {
            long elapsedTimeMillis = stopwatch.elapsed(TimeUnit.MILLISECONDS);
            jobRun = JobRunImpl.copyOf(jobRun)
                    .withCompleted(true)
                    .withElapsedTime(elapsedTimeMillis)
                    .withJobStatus(success ? JRS_COMPLETED : JRS_FAILED)
                    .withErrorMessageData(ErrorMessagesData.fromErrorsAndWarningEvents(eventCollector.getCollectedEvents()))
                    .withLogs(eventCollector.getLogs()) //TODO make this configurable
                    .withMetadata(output)
                    .build();
            if (job.persistJobRun()) {
                jobRun = jobRunRepository.update(jobRun);
            } else if (jobRun.hasErrors()) {
                jobRun = jobRunRepository.create(jobRun);
            }
        }

        private void setContextAndExecuteJob() {
            String ctx = toStringNotBlank(firstNotNull(jobRun.getId(), randomId(8)));
            MDC.put("cm_type", "job");
            MDC.put("cm_id", format("jobrun:%s", ctx));
            JobSessionContext helper = job.hasSessionId()
                    ? jobSessionService.createJobSessionContextWithExistingSession(job.getSessionId(), "jobrun_%s", ctx)
                    : jobSessionService.createJobSessionContextWithUser(firstNotBlank(job.getSessionUser(), JOBUSER_SYSTEM), "jobrun_%s", ctx);
            errorAndWarningCollectorService.getCurrentRequestEventCollector().enableFullLogCollection();//TODO make this configurable 
            try {
                executeJob();
            } finally {
                eventCollector.copyErrorsAndLogsFrom(errorAndWarningCollectorService.getCurrentRequestEventCollector());
                helper.destroyJobSessionContext();
                MDC.clear();
            }
        }

        private void executeJob() {
            if (requireLock()) {
                try (AutoCloseableItemLock lock = lockService.aquireLockOrFail(format("%s.%s", job.getType(), job.getCode()), LS_REQUEST)) {
                    doExecuteJob();
                }
            } else {
                doExecuteJob();
            }
        }

        private void doExecuteJob() {
            logger.debug("executing job type = {} id = {} code = {}", job.getType(), job.getId(), job.getCode());
            output.putAll(checkNotNull(jobRunnerRepository.get().getJobRunner(job.getType()).runJobWithOutput(job, new MyJobRunContext(job, jobRun.getId()))));
        }

        private void postEvent(Object event) {
            thisEventBus.post(event);
            eventBus.post(event);
        }

    }

    private class MyJobRunContext implements JobRunContext {

        private final JobData job;
        private final Long jobRunId;

        public MyJobRunContext(JobData job, Long jobRunId) {
            this.job = checkNotNull(job);
            this.jobRunId = jobRunId;
        }

        @Override
        public JobData getJob() {
            return job;
        }

        @Override
        @Nullable
        public Long getJobRunId() {
            return jobRunId;
        }

    }
}
