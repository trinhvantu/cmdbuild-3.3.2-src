/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.jobs;

import static com.google.common.base.Objects.equal;
import java.time.ZonedDateTime;
import static java.util.Collections.emptyList;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import org.cmdbuild.audit.ErrorMessageData;
import org.cmdbuild.audit.ErrorMessagesData;
import org.cmdbuild.fault.FaultEventLevel;
import static org.cmdbuild.fault.FaultEventLevel.INFO;
import static org.cmdbuild.fault.FaultEventLevel.WARNING;
import org.cmdbuild.fault.FaultEvent.LeveOrderErrorsFirst;
import static org.cmdbuild.jobs.JobRunStatus.JRS_FAILED;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;

public interface JobRun {

    final String JOB_RUN_ATTR_HAS_ERROR = "HasError", JOB_OUTPUT = "output";

    @Nullable
    Long getId();

    String getJobCode();

    JobRunStatus getJobStatus();

    ZonedDateTime getTimestamp();

    boolean isCompleted();

    boolean hasErrors();

    @Nullable
    Long getElapsedTime();

    @Nullable
    ErrorMessagesData getErrorMessageData();

    @Nullable
    String getLogs();

    @Nullable
    String getNodeId();

    Map<String, String> getMetadata();

    @Nullable
    default String getOutput() {
        return getMetadata().get(JOB_OUTPUT);
    }

    default boolean hasOutput() {
        return isNotBlank(getOutput());
    }

    default boolean isFailed() {
        return equal(getJobStatus(), JRS_FAILED);
    }

    default boolean hasWarning() {
        return hasErrors() || getMaxErrorLevel().isWorseOrEqualTo(WARNING);
    }

    default List<ErrorMessageData> getErrorOrWarningEvents() {
        return getErrorMessageData() == null ? emptyList() : (List) getErrorMessageData().getData();
    }

    default FaultEventLevel getMaxErrorLevel() {
        return getErrorOrWarningEvents().stream().map(ErrorMessageData::getLevel).max(LeveOrderErrorsFirst.INSTANCE).orElse(INFO);
    }

    default boolean hasLogs() {
        return isNotBlank(getLogs());
    }

}
