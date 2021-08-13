/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.job;

import java.util.Map;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.jobs.JobData;

public interface EmailJobConfig {

    JobData getJob();

    String getAccountName();

    @Nullable
    String getActionAttachmentsCategory();

    @Nullable
    String getNotificationTemplate();

    @Nullable
    String getActionWorkflowAttachmentsCategory();

    @Nullable
    String getActionWorkflowClassName();

    @Nullable
    String getActionWorkflowPerformerUsername();

    Map<String, String> getActionWorkflowFieldsMapping();

    @Nullable
    String getFilterFunctionName();

    @Nullable
    String getFilterScript();

    @Nullable
    String getFilterRegexpFrom();

    @Nullable
    String getFilterRegexpSubject();

    EmailReaderFilterType getFilterType();

    String getFolderIncoming();

    String getFolderProcessed();

    @Nullable
    String getFolderRejected();

    MapperConfig getMapperConfig();

    boolean isActionAttachmentsActive();

    EmailAttachmentProcessingMode getEmailAttachmentProcessingMode();

    boolean isActionNotificationActive();

    boolean isActionWorkflowActive();

    boolean isActionWorkflowAdvance();

    boolean isActionWorkflowAttachmentsSave();

    boolean moveToRejectedOnFilterMismatch();

    boolean leaveMailOnFilterMismatch();

    boolean isActionGateActive();

    JobConfigEmailGateSource getActionGateSource();

    String getActionGateCode();

    JobConfigEmailSource getEmailSource();

    boolean isAggressiveInReplyToMatchingEnabled();

    default boolean hasFilterRegexpFrom() {
        return isNotBlank(getFilterRegexpFrom());
    }

    default boolean hasFilterRegexpSubject() {
        return isNotBlank(getFilterRegexpSubject());
    }

    default boolean hasNotificationTemplate() {
        return isNotBlank(getNotificationTemplate());
    }

    enum JobConfigEmailSource {
        JCES_MTA, JCES_DB
    }

    enum JobConfigEmailGateSource {
        JCEGS_BODY_PLAINTEXT, JCEGS_ATTACHMENT
    }
}
