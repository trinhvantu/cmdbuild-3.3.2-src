/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.jobs;

import com.google.common.eventbus.EventBus;
import java.util.concurrent.Future;
import javax.annotation.Nullable;

public interface JobRunService {

    JobRun runJob(JobData job);

    JobRun runJobSafe(JobData job);

    Future<JobRun> runJobLater(JobData job, @Nullable Object eventListener);

    EventBus getEventBus();

    default Future<JobRun> runJobLater(JobData job) {
        return runJobLater(job, null);
    }

}
