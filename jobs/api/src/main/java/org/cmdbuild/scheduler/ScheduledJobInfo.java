/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.scheduler;

import java.time.ZonedDateTime;
import org.springframework.lang.Nullable;

public interface ScheduledJobInfo {

    String getCode();

    String getTrigger();

    boolean isRunning();

    @Nullable
    ZonedDateTime getLastRun();

}
