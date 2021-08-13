/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.sked.inner;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.Ordering;
import static java.lang.Long.max;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import static java.util.stream.Collectors.toList;
import org.apache.commons.lang3.tuple.Pair;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTimeLocal;
import static org.cmdbuild.utils.date.CmDateUtils.toUserDuration;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExecutorUtils.awaitCompletionIgnoreInterrupt;
import static org.cmdbuild.utils.lang.CmExecutorUtils.namedThreadFactory;
import static org.cmdbuild.utils.lang.CmExecutorUtils.safe;
import static org.cmdbuild.utils.lang.CmExecutorUtils.shutdownQuietly;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.utils.sked.DefaultSkedEnv;
import org.cmdbuild.utils.sked.SkedEnv;
import org.cmdbuild.utils.sked.SkedException;
import org.cmdbuild.utils.sked.SkedJob;
import org.cmdbuild.utils.sked.SkedJobInfo;
import org.cmdbuild.utils.sked.SkedService;
import static org.quartz.CronScheduleBuilder.cronSchedule;
import org.quartz.CronTrigger;
import org.quartz.spi.MutableTrigger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.cmdbuild.utils.sked.SkedJobClusterMode.RUN_ON_SINGLE_NODE;

public class SkedServiceImpl implements SkedService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ScheduledExecutorService main = Executors.newSingleThreadScheduledExecutor(namedThreadFactory(SkedServiceImpl.class));
    private final ExecutorService worker = Executors.newCachedThreadPool(namedThreadFactory(SkedServiceImpl.class));
    private final List<SkedJob> jobs = new CopyOnWriteArrayList<>();
    private final List<SkedTrigger> triggers = new CopyOnWriteArrayList<>();
    private final Set<String> activeJobs = ConcurrentHashMap.newKeySet();
    private final Map<String, ZonedDateTime> lastJobRuns = new ConcurrentHashMap<>();

    private final SkedEnv env;

    private boolean isClosed = false, isPaused = true;

    public SkedServiceImpl() {
        this(new DefaultSkedEnv());
    }

    public SkedServiceImpl(SkedEnv env) {
        this.env = checkNotNull(env);
    }

    @Override
    public SkedService addJobs(Iterable<SkedJob> jobs) {
        checkNotClosed();
        checkNotNull(jobs);
        runOnMain(() -> {
            jobs.forEach(j -> {
                checkNotNull(j);
                this.jobs.stream().forEach(jj -> checkArgument(!equal(jj.getCode(), j.getCode()), "duplicated job code =< %s >", j.getCode()));
            });
            jobs.forEach(job -> {
                this.jobs.add(job);
            });
            if (!isPaused) {
                reloadTriggers();
            }
        });
        return this;
    }

    @Override
    public void removeJob(String jobCode) {
        checkNotClosed();
        checkNotBlank(jobCode);
        runOnMain(() -> {
            checkArgument(jobs.removeIf(j -> equal(j.getCode(), jobCode)), "job not found for code =< %s >", jobCode);
            if (!isPaused) {
                reloadTriggers();
            }
        });
    }

    @Override
    public List<SkedJob> getJobs() {
        return jobs;
    }

    @Override
    public SkedService pause() {
        checkNotClosed();
        logger.debug("pause scheduler");
        runOnMain(() -> {
            isPaused = true;
            clearTriggers();
        });
        return this;
    }

    @Override
    public SkedService start() {
        checkNotClosed();
        logger.debug("start scheduler");
        runOnMain(() -> {
            isPaused = false;
            reloadTriggers();
        });
        return this;
    }

    @Override
    public boolean isRunning() {
        return !isPaused && !isClosed;
    }

    @Override
    public void runJobs(ZonedDateTime from, ZonedDateTime to) {
        checkNotNull(from);
        checkNotNull(to);
        checkArgument(to.isAfter(from));
        logger.debug("trigger jobs from time =< {} > to time =< {} >", toIsoDateTimeLocal(from), toIsoDateTimeLocal(to));
        List<Pair<SkedTrigger, ZonedDateTime>> toTrigger = buildTriggers(from).stream()
                .map(t -> Pair.of(t, t.getNextFireTime(from)))
                .filter(p -> p.getRight().isBefore(to))
                .sorted(Ordering.natural().onResultOf(p -> p.getRight()))
                .collect(toList());
        if (!toTrigger.isEmpty()) {
            ZonedDateTime triggerTime = toTrigger.get(0).getRight();
            toTrigger.removeIf(t -> !equal(t.getRight(), triggerTime));
            toTrigger.forEach(t -> {
                SkedTrigger trigger = t.getLeft();
                ZonedDateTime dateTime = t.getRight();
                logger.debug("found next job =< {} > at time =< {} >", trigger.getJob().getCode(), toIsoDateTimeLocal(dateTime));
                awaitCompletionIgnoreInterrupt(worker.submit(() -> executeJobSafe(trigger.getJob(), dateTime)));
            });
            runJobs(triggerTime, to);
        }
    }

    @Override
    public void close() {
        if (!isClosed) {
            logger.debug("close scheduler");
            runOnMain(() -> {
                isClosed = true;
                clearTriggers();
            });
            shutdownQuietly(main, worker);
        }
    }

    @Override
    public boolean isRunning(String jobCode) {
        return activeJobs.contains(checkNotBlank(jobCode));
    }

    @Override
    public List<SkedJobInfo> getJobInfos() {
        return list(jobs).map(j -> new SkedJobInfoImpl(j, isRunning(j.getCode()), lastJobRuns.get(j.getCode())));
    }

    @Override
    public void runJobNow(String code) {
        runOnMain(() -> {
            awaitCompletionIgnoreInterrupt(worker.submit(() -> {
                doExecuteJob(getJobInfo(code).getJob());
            }));
        });
    }

    private void runOnMain(Runnable runnable) {
        awaitCompletionIgnoreInterrupt(main.submit(runnable));
    }

    private void reloadTriggers() {
        clearTriggers();

        logger.debug("load triggers");
        triggers.addAll(buildTriggers());
        triggers.forEach(SkedTrigger::scheduleNextFireTime);
    }

    private List<SkedTrigger> buildTriggers() {
        return buildTriggers(now());
    }

    private List<SkedTrigger> buildTriggers(ZonedDateTime from) {
        return list(jobs).map(j -> {
            try {
                MutableTrigger cron = cronSchedule(j.getTrigger()).build();
                cron.setStartTime(new Date(from.toInstant().toEpochMilli() - 1000));//TODO check this
                return new SkedTrigger(j, (CronTrigger) cron);
            } catch (Exception ex) {
                throw new SkedException(ex, "error processing trigger for job =< %s >", j);
            }
        });
    }

    private void clearTriggers() {
        logger.debug("clear triggers");
        triggers.forEach(SkedTrigger::invalidate);
        triggers.clear();
    }

    private void checkNotClosed() {
        checkArgument(!isClosed, "sked service is closed");
    }

    private void executeJobSafe(SkedJob job, ZonedDateTime fireTimestamp) {
        logger.debug("processing job = {} with fire time =< {} >", job, toIsoDateTimeLocal(fireTimestamp));
        if (job.hasClusterMode(RUN_ON_SINGLE_NODE) && !env.isMasterNodeForJob(job.getCode(), fireTimestamp)) {
            logger.debug("skip job =< {} > (running on non-master cluster node", job.getCode());
        } else {
            try {
                doExecuteJob(job);
            } catch (Exception ex) {
                logger.error("error executing job =< {} > ", job.getCode(), ex);
            }
        }
    }

    private void doExecuteJob(SkedJob job) {
        logger.debug("execute job =< {} >", job.getCode());
        checkArgument(activeJobs.add(job.getCode()), "cannot execute job =< %s >: job is already running");
        lastJobRuns.put(job.getCode(), now());
        try {
            job.run();
            logger.debug("completed run for job =< {} >", job.getCode());
        } finally {
            activeJobs.remove(job.getCode());
        }
    }

    private class SkedTrigger {

        private final SkedJob job;
        private final CronTrigger cron;
        private boolean isValid = true;

        public SkedTrigger(SkedJob job, CronTrigger cron) {
            this.job = checkNotNull(job);
            this.cron = checkNotNull(cron);
            logger.debug("build sked trigger with cron =< {} >", cron.getCronExpression());
        }

        public SkedJob getJob() {
            return job;
        }

        public void invalidate() {
            isValid = false;
        }

        public boolean isValid() {
            return isValid;
        }

        public ZonedDateTime getNextFireTime(ZonedDateTime from) {
            return ZonedDateTime.ofInstant(cron.getFireTimeAfter(new Date(from.toInstant().toEpochMilli())).toInstant(), ZoneId.systemDefault());
        }

        public void scheduleNextFireTime() {
            Date nextFireTime = checkNotNull(cron.getFireTimeAfter(new Date()));
            long delayMillis = max(nextFireTime.getTime() - System.currentTimeMillis(), 0);
            logger.debug("schedule next fire time for job =< {} > at date = {} ( {} away )", job.getCode(), toIsoDateTimeLocal(nextFireTime), toUserDuration(Duration.ofMillis(delayMillis)));
            main.schedule(safe(() -> {
                if (isValid) {
                    worker.submit(safe(() -> {
                        if (isRunning(job.getCode())) {
                            logger.warn("job =< {} > is already running, skip run", job.getCode());
                        } else {
                            executeJobSafe(job, toDateTime(nextFireTime));
                        }
                        if (isValid) {
                            runOnMain(() -> {
                                if (isValid) {
                                    scheduleNextFireTime();
                                } else {
                                    logger.trace("processing expired trigger for job =< {} >, skipping", job.getCode());
                                }
                            });
                        }
                    }));
                } else {
                    logger.trace("processing expired trigger for job =< {} >, skipping", job.getCode());
                }
            }), delayMillis, TimeUnit.MILLISECONDS);
        }

    }

}
