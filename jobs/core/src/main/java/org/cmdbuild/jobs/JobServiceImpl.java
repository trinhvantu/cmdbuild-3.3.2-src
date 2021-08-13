/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.jobs;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.ImmutableSet;
import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe; 
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;
import static java.util.stream.Collectors.toList;
import javax.inject.Provider;
import org.cmdbuild.cleanup.RecordCleanupHelperService;
import org.cmdbuild.common.utils.PagedElements;
import org.cmdbuild.config.JobsConfiguration;
import org.cmdbuild.config.api.ConfigListener;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import static org.cmdbuild.jobs.JobMode.JM_SCHEDULED;
import org.cmdbuild.jobs.beans.JobDataImpl;
import org.cmdbuild.jobs.inner.JobRunCompletedEvent;
import org.cmdbuild.scheduler.JobSource;
import org.cmdbuild.scheduler.JobUpdatedEvent;
import org.cmdbuild.scheduler.ScheduledJob;
import org.cmdbuild.services.MinionComponent;
import org.cmdbuild.services.MinionStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import static org.cmdbuild.services.MinionUtils.getMinionStatus;
import static org.cmdbuild.utils.lang.EventBusUtils.logExceptions;
import static org.cmdbuild.utils.sked.SkedJobClusterMode.RUN_ON_SINGLE_NODE;
import static org.cmdbuild.workflow.WorkflowCommonConst.WFBATCHTASK_JOB_TYPE;

@Component
@MinionComponent(name = "Scheduler_ Jobs", configBean = JobsConfiguration.class, canStartStop = true)
public class JobServiceImpl implements JobService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    public static final Set<String> SYSTEM_JOB_TYPES = ImmutableSet.of(WFBATCHTASK_JOB_TYPE);

    private final JobRepository jobRepository;
    private final JobRunService helper;
    private final JobRunRepository jobRunRepository;
    private final JobsConfiguration config;
    private final Provider<JobRunnerRepository> jobRunnerRepository;
    private final RecordCleanupHelperService cleanupHelper;

    private final EventBus schedEventBus = new EventBus(logExceptions(logger));
    private final ApplicationJobsSource applicationJobsSource = new ApplicationJobsSource();

    public JobServiceImpl(JobRepository jobRepository, JobRunService helper, JobRunRepository jobRunRepository, JobsConfiguration configuration, Provider<JobRunnerRepository> jobRunnerRepository, RecordCleanupHelperService cleanupHelper) {
        this.jobRepository = checkNotNull(jobRepository);
        this.helper = checkNotNull(helper);
        this.jobRunRepository = checkNotNull(jobRunRepository);
        this.config = checkNotNull(configuration);
        this.jobRunnerRepository = checkNotNull(jobRunnerRepository);
        this.cleanupHelper = checkNotNull(cleanupHelper);
    }

    public MinionStatus getServiceStatus() {
        return getMinionStatus(config.isEnabled());
    }

    @ScheduledJob(value = "0 0 * * * ?", clusterMode = RUN_ON_SINGLE_NODE) //run every hour
    @ConfigListener(JobsConfiguration.class)
    public void cleanupJobTables() {
        cleanupHelper.cleanupRecords(JobRun.class, config.getMaxJobRunRecordsToKeep(), config.getMaxJobRunRecordAgeToKeepSeconds());
    }

    @Bean
    public JobSource getJobSource() {
        return applicationJobsSource;
    }

    @Override
    public List<JobData> getAllJobs() {
        return jobRepository.getAllJobs();
    }

    @Override
    public JobData getJob(long id) {
        return jobRepository.getOne(id);
    }

    @Override
    public JobData getJobByCode(String code) {
        return jobRepository.getOneByCode(code);
    }

    @Override
    public JobData createJob(JobData data) {
        validateJobData(data);
        data = jobRepository.create(data);
        if (data.isEnabled()) {
            handleNewJob(data);
        }
        return data;
    }

    @Override
    public JobData updateJob(JobData data) {
        validateJobData(data);
        data = jobRepository.update(data);
        if (data.getMode().equals(JM_SCHEDULED)) {
            schedEventBus.post(JobUpdatedEvent.INSTANCE);//TODO improve this, add job id/data
        }
        return data;
    }

    @Override
    public void deleteJob(long id) {
        JobData data = getJob(id);
        jobRepository.delete(id);
        if (data.getMode().equals(JM_SCHEDULED)) {
            schedEventBus.post(JobUpdatedEvent.INSTANCE);//TODO improve this, add job id/data
        }
    }

    @Override
    public JobRun getJobRun(Long runId) {
        return jobRunRepository.getJobRun(runId);
    }

    @Override
    public PagedElements<JobRun> getJobRuns(long jobId, DaoQueryOptions queryOptions) {
        return jobRunRepository.getJobRuns(getJob(jobId).getCode(), queryOptions);
    }

    @Override
    public PagedElements<JobRun> getJobRuns(String jobCode, DaoQueryOptions queryOptions) {
        return jobRunRepository.getJobRuns(jobCode, queryOptions);
    }

    @Override
    public PagedElements<JobRun> getJobErrors(long jobId, DaoQueryOptions queryOptions) {
        return jobRunRepository.getJobErrors(getJob(jobId).getCode(), queryOptions);
    }

    @Override
    public PagedElements<JobRun> getJobRuns(DaoQueryOptionsImpl queryOptions) {
        return jobRunRepository.getJobRuns(queryOptions);
    }

    @Override
    public PagedElements<JobRun> getJobErrors(DaoQueryOptionsImpl queryOptions) {
        return jobRunRepository.getJobErrors(queryOptions);
    }

    @Override
    public JobRun runJob(long id, Map<String, String> configOverride) {
        JobData job = getJob(id);
        if (!configOverride.isEmpty()) {
            job = JobDataImpl.copyOf(job).withConfig(configOverride).build();
        }
        return helper.runJob(job);
    }

    @Override
    public JobRun runJobSafe(long id) {
        return helper.runJobSafe(getJob(id));
    }

    @Override
    public Future<JobRun> runJobLater(long id) {
        return helper.runJobLater(getJob(id));
    }

    private void validateJobData(JobData data) {
        jobRunnerRepository.get().getJobRunner(data.getType()).vaildateJob(data);
    }

    private void handleNewJob(JobData data) {
        switch (data.getMode()) {
            case JM_REALTIME:
                try {
                helper.runJob(data);
            } finally {
                deleteJob(data.getId());
            }
            break;
            case JM_BATCH:
                helper.runJobLater(data, new Object() {
                    @Subscribe
                    public void handleJobRunCompletedEvent(JobRunCompletedEvent event) {
                        deleteJob(data.getId());
                    }
                });
                break;
            case JM_SCHEDULED:
                schedEventBus.post(JobUpdatedEvent.INSTANCE);//TODO improve this, add job id/data
        }
    }

    private class ApplicationJobsSource implements JobSource {

        @Override
        public String getJobSourceName() {
            return "jobs";
        }

        @Override
        public Collection<JobData> getJobs() {
            return jobRepository.getAllJobs().stream().filter(j -> (config.isEnabled() || SYSTEM_JOB_TYPES.contains(j.getType()))
                    && j.isEnabled() && j.getMode().equals(JM_SCHEDULED)).collect(toList());
        }

        @Override
        public void register(Object listener) {
            schedEventBus.register(listener);
        }
    }

}
