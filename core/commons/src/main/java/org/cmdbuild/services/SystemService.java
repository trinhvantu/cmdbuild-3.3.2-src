/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.services;

import static com.google.common.base.Objects.equal;
import java.time.ZonedDateTime;
import static org.cmdbuild.services.SystemStatus.SYST_WAITING_FOR_DATABASE_CONFIGURATION;
import static org.cmdbuild.services.SystemStatus.SYST_WAITING_FOR_PATCH_MANAGER;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;

public interface SystemService {

    ZonedDateTime getStartupDateTime();

    SystemStatus getSystemStatus();

    void startSystem();

    void stopSystem();

    default boolean isSystemReady() {
        return equal(getSystemStatus(), SystemStatus.SYST_READY);
    }

    default boolean isSystemStandby() {
        return equal(getSystemStatus(), SystemStatus.SYST_NOT_RUNNING);
    }

    default boolean isWaitingForUser() {
        return hasStatus(SYST_WAITING_FOR_DATABASE_CONFIGURATION, SYST_WAITING_FOR_PATCH_MANAGER);
    }

    default boolean hasStatus(SystemStatus... any) {
        return set(any).contains(getSystemStatus());
    }

}
