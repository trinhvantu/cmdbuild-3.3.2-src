/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.jobs;

import static com.google.common.base.Objects.equal;
import java.util.Map;
import javax.annotation.Nullable;
import static org.cmdbuild.jobs.JobMode.JM_OTHER;
import static org.cmdbuild.jobs.JobMode.JM_SCHEDULED;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.cmdbuild.utils.sked.SkedJobClusterMode;
import static org.cmdbuild.utils.sked.SkedJobClusterMode.RUN_ON_SINGLE_NODE;

public interface JobData {

    final static String JOB_DATA_ATTR_TYPE = "Type",
            JOB_CONFIG_CRON_EXPR = "cronExpression",
            JOB_CONFIG_CRON_EXPR_HAS_SECONDS = "cronExpressionHasSeconds",
            JOB_CONFIG_MODE = "jobMode",
            JOB_CONFIG_USE_CURRENT_SESSION = "cm_job_useCurrentSession",
            JOB_CONFIG_SESSION_ID = "cm_job_sessionId",
            JOB_CONFIG_SESSION_USER = "cm_job_sessionUser",
            JOB_CONFIG_PERSIST_RUN = "persistRun",
            JOB_CONFIG_CLUSTER_MODE = "clusterMode";

    @Nullable
    Long getId();

    String getCode();

    String getDescription();

    String getType();

    boolean isEnabled();

    Map<String, Object> getConfig();

    default JobMode getMode() {
        String mode = toStringOrNull(getConfig().get(JOB_CONFIG_MODE));
        if (isNotBlank(mode)) {
            return parseEnum(mode, JobMode.class);
        } else if (isNotBlank(getCronExpression())) {
            return JM_SCHEDULED;
        } else {
            return JM_OTHER;
        }
    }

    @Nullable
    default String getCronExpression() {
        return getConfig(JOB_CONFIG_CRON_EXPR);
    }

    default boolean persistJobRun() {
        return toBooleanOrDefault(getConfig(JOB_CONFIG_PERSIST_RUN), true);
    }

    default boolean cronExpressionHasSeconds() {
        return toBooleanOrDefault(getConfig(JOB_CONFIG_CRON_EXPR_HAS_SECONDS), false);
    }

    default SkedJobClusterMode getClusterMode() {
        return parseEnumOrDefault(getConfig(JOB_CONFIG_CLUSTER_MODE), RUN_ON_SINGLE_NODE);
    }

    default boolean isOfType(String type) {
        return equal(getType(), type);
    }

    default String getConfigNotBlank(String key) {
        return checkNotBlank(getConfig(key), "config not found for key = %s", key);
    }

    @Nullable
    default String getConfig(String key) {
        return toStringOrNull(getConfig().get(key));
    }

    default boolean hasMode(JobMode mode) {
        return equal(getMode(), mode);
    }

    default boolean useCurrentSessionContext() {
        return toBooleanOrDefault(getConfig(JOB_CONFIG_USE_CURRENT_SESSION), false);
    }

    @Nullable
    default String getSessionUser() {
        return getConfig(JOB_CONFIG_SESSION_USER);
    }

    @Nullable
    default String getSessionId() {
        return getConfig(JOB_CONFIG_SESSION_ID);
    }

    default boolean hasSessionUser() {
        return isNotBlank(getSessionUser());
    }

    default boolean hasSessionId() {
        return isNotBlank(getSessionId());
    }
}
