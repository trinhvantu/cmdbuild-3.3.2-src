/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.job;

import com.google.common.base.Preconditions;
import java.util.Map;
import javax.annotation.Nullable;
import static org.cmdbuild.email.job.EmailJobConfig.JobConfigEmailSource.JCES_MTA;
import org.cmdbuild.email.utils.EmailUtils;
import org.cmdbuild.jobs.JobData;
import static org.cmdbuild.utils.encode.CmPackUtils.unpackIfPacked;
import org.cmdbuild.utils.lang.CmConvertUtils;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import org.cmdbuild.utils.lang.CmPreconditions;
import static org.cmdbuild.email.job.EmailJobConfig.JobConfigEmailGateSource.JCEGS_BODY_PLAINTEXT;

public class EmailJobConfigImpl implements EmailJobConfig {

    private final EmailReaderFilterType filterType;
    private final String accountName;
    private final String folderIncoming;
    private final String folderRejected;
    private final String folderProcessed;
    private final String filterRegexpFrom;
    private final String filterRegexpSubject;
    private final String filterFunctionName, filterScript;
    private final String actionWorkflowClassName;
    private final String actionAttachmentsCategory;
    private final String actionNotificationTemplate;
    private final String actionWorkflowAttachmentsCategory;
    private final String actionWorkflowPerformerUsername;
    private final JobData job;
    private final boolean filterReject;
    private final boolean leaveMailOnFilterMismatch;
    private final boolean actionWorkflowActive;
    private final boolean actionGateActive;
    private final JobConfigEmailGateSource actionGateSource;
    private final String actionGateCode;
    private final boolean actionWorkflowAdvance;
    private final boolean actionAttachmentsActive;
    private final boolean actionNotificationActive;
    private final boolean actionWorkflowAttachmentsSave;
    private final boolean aggressiveInReplyToMatchingEnabled;
    private final Map<String, String> actionWorkflowFieldsMapping;
    private final MapperConfig mapperConfig;
    private final EmailAttachmentProcessingMode attachmentProcessingMode;
    private final JobConfigEmailSource emailSource;
    private final Map<String, String> config;

    public EmailJobConfigImpl(JobData jobData) {
        Preconditions.checkArgument(jobData.isOfType(EmailJobRunnerImpl.EMAIL_JOB_TYPE), "invalid type of job data = %s", jobData);
        job = Preconditions.checkNotNull(jobData);
        config = (Map) jobData.getConfig();
        filterType = CmConvertUtils.parseEnumOrDefault(config.get("filter_type"), EmailReaderFilterType.FT_NONE);
        accountName = CmPreconditions.checkNotBlank(config.get("account_name"), "missing email account");
        filterReject = CmConvertUtils.toBooleanOrDefault(config.get("filter_reject"), false);
        leaveMailOnFilterMismatch = CmConvertUtils.toBooleanOrDefault(config.get("filter_leave_on_mismatch"), false);
        aggressiveInReplyToMatchingEnabled = CmConvertUtils.toBooleanOrDefault(config.get("email_isreply_aggressive_matching_enabled"), false);
        folderIncoming = CmPreconditions.checkNotBlank(config.get("folder_incoming"));
        folderRejected = config.get("folder_rejected");
        folderProcessed = CmPreconditions.checkNotBlank(config.get("folder_processed"));
        filterRegexpFrom = config.get("filter_regex_from");
        filterFunctionName = config.get("filter_function_name");
        filterScript = unpackIfPacked(config.get("filter_script"));
        filterRegexpSubject = config.get("filter_regex_subject");
        actionWorkflowActive = CmConvertUtils.toBooleanOrDefault(config.get("action_workflow_active"), false);
        actionWorkflowAdvance = CmConvertUtils.toBooleanOrDefault(config.get("action_workflow_advance"), false);
        actionAttachmentsActive = CmConvertUtils.toBooleanOrDefault(config.get("action_attachments_active"), false);
        actionGateActive = CmConvertUtils.toBooleanOrDefault(config.get("action_gate_active"), false);
        actionGateSource = parseEnumOrDefault(config.get("action_gate_source"), JCEGS_BODY_PLAINTEXT);
        actionGateCode = config.get("action_gate_code");
        attachmentProcessingMode = CmConvertUtils.parseEnumOrDefault(config.get("action_attachments_mode"), EmailAttachmentProcessingMode.EA_ATTACH_TO_EMAIL);
        actionNotificationActive = CmConvertUtils.toBooleanOrDefault(config.get("action_notification_active"), false);
        actionWorkflowAttachmentsSave = CmConvertUtils.toBooleanOrDefault(config.get("action_workflow_attachmentssave"), false);
        actionWorkflowClassName = config.get("action_workflow_class_name");
        actionWorkflowPerformerUsername = config.get("action_workflow_performer_username");
        actionAttachmentsCategory = config.get("action_attachments_category");
        actionNotificationTemplate = config.get("action_notification_template");
        actionWorkflowFieldsMapping = EmailUtils.parseWorkflowMappingParam(config.get("action_workflow_fields_mapping"));
        actionWorkflowAttachmentsCategory = config.get("action_workflow_attachmentscategory");
        emailSource = parseEnumOrDefault(config.get("email_source"), JCES_MTA);
        mapperConfig = new MapperConfigImpl(config);
    }

    @Override
    public boolean isActionGateActive() {
        return actionGateActive;
    }

    @Override
    public JobConfigEmailGateSource getActionGateSource() {
        return actionGateSource;
    }

    @Override
    public String getActionGateCode() {
        return actionGateCode;
    }

    @Override
    public boolean isAggressiveInReplyToMatchingEnabled() {
        return aggressiveInReplyToMatchingEnabled;
    }

    @Override
    public EmailAttachmentProcessingMode getEmailAttachmentProcessingMode() {
        return attachmentProcessingMode;
    }

    @Override
    public JobData getJob() {
        return job;
    }

    @Override
    public MapperConfig getMapperConfig() {
        return mapperConfig;
    }

    @Override
    public EmailReaderFilterType getFilterType() {
        return filterType;
    }

    @Override
    @Nullable
    public String getAccountName() {
        return accountName;
    }

    @Override
    public String getFolderIncoming() {
        return folderIncoming;
    }

    @Nullable
    @Override
    public String getFolderRejected() {
        return folderRejected;
    }

    @Override
    public String getFolderProcessed() {
        return folderProcessed;
    }

    @Nullable
    @Override
    public String getFilterRegexpFrom() {
        return filterRegexpFrom;
    }

    @Nullable
    @Override
    public String getFilterRegexpSubject() {
        return filterRegexpSubject;
    }

    @Nullable
    @Override
    public String getFilterFunctionName() {
        return filterFunctionName;
    }

    @Nullable
    @Override
    public String getFilterScript() {
        return filterScript;
    }

    @Nullable
    @Override
    public String getActionWorkflowClassName() {
        return actionWorkflowClassName;
    }

    @Nullable
    @Override
    public String getActionWorkflowPerformerUsername() {
        return actionWorkflowPerformerUsername;
    }

    @Nullable
    @Override
    public String getActionAttachmentsCategory() {
        return actionAttachmentsCategory;
    }

    @Nullable
    @Override
    public String getNotificationTemplate() {
        return actionNotificationTemplate;
    }

    @Override
    public Map<String, String> getActionWorkflowFieldsMapping() {
        return actionWorkflowFieldsMapping;
    }

    @Nullable
    @Override
    public String getActionWorkflowAttachmentsCategory() {
        return actionWorkflowAttachmentsCategory;
    }

    @Override
    public boolean moveToRejectedOnFilterMismatch() {
        return filterReject;
    }

    @Override
    public boolean leaveMailOnFilterMismatch() {
        return leaveMailOnFilterMismatch;
    }

    @Override
    public boolean isActionWorkflowActive() {
        return actionWorkflowActive;
    }

    @Override
    public boolean isActionWorkflowAdvance() {
        return actionWorkflowAdvance;
    }

    @Override
    public boolean isActionAttachmentsActive() {
        return actionAttachmentsActive;
    }

    @Override
    public boolean isActionNotificationActive() {
        return actionNotificationActive;
    }

    @Override
    public boolean isActionWorkflowAttachmentsSave() {
        return actionWorkflowAttachmentsSave;
    }

    @Override
    public JobConfigEmailSource getEmailSource() {
        return emailSource;
    }

    @Override
    public String toString() {
        return "EmailReaderConfigImpl{" + "account=" + accountName + ", job=" + job + '}';
    }

}
