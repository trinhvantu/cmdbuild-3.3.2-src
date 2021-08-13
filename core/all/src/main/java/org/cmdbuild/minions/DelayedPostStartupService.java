/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.minions;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Collections.synchronizedList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import javax.annotation.PreDestroy;
import org.apache.commons.lang3.tuple.Pair;
import org.cmdbuild.services.PostStartup;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExecutorUtils.namedThreadFactory;
import static org.cmdbuild.utils.lang.CmExecutorUtils.safe;
import static org.cmdbuild.utils.lang.CmExecutorUtils.shutdownQuietly;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotNullAndGtZero;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DelayedPostStartupService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor(namedThreadFactory(getClass()));

//    private final JobRunService runService;//TODO execute jobs with run service
    private final List<Pair<Long, Runnable>> jobs = synchronizedList(list());

//    public DelayedPostStartupService(JobRunService runService) {
//        this.runService = checkNotNull(runService);
//    }
    public void registerDelayedPostStartupEvent(long delaySeconds, Runnable job) {
        jobs.add(Pair.of(checkNotNullAndGtZero(delaySeconds), checkNotNull(job)));
    }

    @PostStartup
    public void queueDelayedPostStartupServices() {
        jobs.forEach(p -> {
            executorService.schedule(safe(() -> {
                logger.debug("execute delayed job");
//                runService.runJobSafe(JobDataImpl.builder() TODO
                p.getRight().run();
//                .build());
            }), p.getLeft(), TimeUnit.SECONDS);
        });
        executorService.schedule(safe(() -> {
            executorService.shutdown();
        }), jobs.stream().mapToLong(Pair::getLeft).max().orElse(0) + 10, TimeUnit.SECONDS);
    }

    @PreDestroy
    public void cleanup() {
        shutdownQuietly(executorService);
    }

}
