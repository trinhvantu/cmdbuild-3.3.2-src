/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.job;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import java.io.File;
import java.net.URI;
import java.util.Map;
import java.util.Optional;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import org.apache.commons.io.FileUtils;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.email.Email;
import org.cmdbuild.email.EmailAccount;
import org.cmdbuild.email.EmailAccountService;
import org.cmdbuild.email.EmailService;
import static org.cmdbuild.email.EmailStatus.ES_OUTGOING;
import org.cmdbuild.email.EmailTemplate;
import org.cmdbuild.email.EmailTemplateService;
import org.cmdbuild.email.beans.EmailAttachmentImpl;
import org.cmdbuild.email.beans.EmailImpl;
import org.cmdbuild.email.template.EmailTemplateProcessorService;
import org.cmdbuild.etl.EtlException;
import org.cmdbuild.etl.handler.FileReaderHelperService;
import static org.cmdbuild.etl.handler.FileReaderHelperService.FAIL_ON_MISSING_SOURCE_DATA_CONFIG;
import org.cmdbuild.etl.handler.FileReaderHelperService.FileReaderHelper;
import static org.cmdbuild.etl.job.ImportJobRunnerImpl.ImportJobSource.IS_FILE;
import static org.cmdbuild.etl.job.ImportJobRunnerImpl.ImportNotificationMode.IN_ALWAYS;
import static org.cmdbuild.etl.job.ImportJobRunnerImpl.ImportNotificationMode.IN_NEVER;
import static org.cmdbuild.etl.job.ImportJobRunnerImpl.ImportNotificationMode.IN_ON_ERRORS;
import org.cmdbuild.jobs.JobData;
import org.cmdbuild.jobs.JobRunContext;
import org.cmdbuild.jobs.JobRunner;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.etl.loader.EtlTemplate;
import org.cmdbuild.etl.loader.EtlProcessingResult;
import org.cmdbuild.etl.loader.EtlTemplateService;
import static org.cmdbuild.etl.utils.EtlResultUtils.prepareEmailData;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;

@Component
public class ImportJobRunnerImpl implements JobRunner {

    public static final String IMPORT_JOB_TYPE = "import_file";

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EtlTemplateService importExportService;
    private final EmailTemplateService emailTemplateService;
    private final EmailAccountService emailAccountService;
    private final EmailTemplateProcessorService emailTemplateProcessorService;
    private final EmailService emailService;
    private final FileReaderHelperService helperService;

    public ImportJobRunnerImpl(EtlTemplateService importExportService, EmailTemplateService emailTemplateService, EmailAccountService emailAccountService, EmailTemplateProcessorService emailTemplateProcessorService, EmailService emailService, FileReaderHelperService helperService) {
        this.importExportService = checkNotNull(importExportService);
        this.emailTemplateService = checkNotNull(emailTemplateService);
        this.emailAccountService = checkNotNull(emailAccountService);
        this.emailTemplateProcessorService = checkNotNull(emailTemplateProcessorService);
        this.emailService = checkNotNull(emailService);
        this.helperService = checkNotNull(helperService);
    }

    @Override
    public String getName() {
        return IMPORT_JOB_TYPE;
    }

    @Override
    public void runJob(JobData jobData, JobRunContext jobContext) {
        try {
            logger.debug("preparing import job = {}", jobData);
            new ImportJobHelper(jobData, jobContext).runImportJob();
        } catch (Exception ex) {
            throw new EtlException(ex, "error executing import job = %s", jobData);
        }
    }

    @Override
    public void vaildateJob(JobData jobData) {
        new ImportJobConfig(jobData);
    }

    private class ImportJobConfig {

        private final JobData jobData;
        private final EtlTemplate template;
        private final EmailTemplate errorTemplate, notificationTemplate;
        private final EmailAccount emailAccount;
        private final String url;
        private final ImportJobSource source;
        private final ImportNotificationMode notificationMode;
        private final boolean failOnMissingSourceData, attachImportReport;
        private final FileReaderHelper helper;

        public ImportJobConfig(JobData jobData) {
            this.jobData = checkNotNull(jobData);
            this.template = importExportService.getTemplateByName(jobData.getConfigNotBlank("template"));
            this.source = parseEnum(jobData.getConfigNotBlank("source"), ImportJobSource.class);
            switch (source) {
                case IS_FILE:
                    helper = helperService.newHelper(jobData.getConfig());
                    url = null;
                    break;
                case IS_URL:
                    helper = null;
                    url = jobData.getConfigNotBlank("url");
                    break;
                default:
                    throw new EtlException("unsupported source = %s", source);
            }
            String errorTemplateCode = toStringOrNull(jobData.getConfig().get("errorEmailTemplate")),
                    notificationTemplateCode = toStringOrNull(jobData.getConfig().get("notificationEmailTemplate")),
                    emailAccountCode = toStringOrNull(jobData.getConfig().get("errorEmailAccount"));
            errorTemplate = isBlank(errorTemplateCode) ? (template.hasErrorTemplate() ? emailTemplateService.getOne(template.getErrorTemplate()) : null) : emailTemplateService.getByName(errorTemplateCode);
            notificationTemplate = isBlank(notificationTemplateCode) ? (template.hasNotificationTemplate() ? emailTemplateService.getOne(template.getNotificationTemplate()) : errorTemplate) : emailTemplateService.getByName(notificationTemplateCode);
            emailAccount = isBlank(emailAccountCode) ? (template.hasErrorAccount() ? emailAccountService.getAccount(template.getErrorAccount()) : null) : emailAccountService.getAccount(emailAccountCode);
            notificationMode = parseEnumOrDefault((String) jobData.getConfig().get("notificationMode"), (ImportNotificationMode) (errorTemplate == null ? IN_NEVER : IN_ON_ERRORS));
            switch (notificationMode) {
                case IN_ALWAYS:
                    checkNotNull(notificationTemplate);
                case IN_ON_ERRORS:
                    checkNotNull(errorTemplate);
            }
            failOnMissingSourceData = toBooleanOrDefault(jobData.getConfig(FAIL_ON_MISSING_SOURCE_DATA_CONFIG), true);
            attachImportReport = toBooleanOrDefault(jobData.getConfig("attachImportReport"), false);
        }

        public boolean failForMissingFile() {
            return failOnMissingSourceData;
        }

        public boolean failForMissingDir() {
            return failOnMissingSourceData;
        }

    }

    private class ImportJobHelper {

        private final ImportJobConfig config;
        private final JobRunContext context;

        private Optional<File> sourceFile;

        public ImportJobHelper(JobData jobData, JobRunContext jobContext) {
            this.config = new ImportJobConfig(jobData);
            this.context = checkNotNull(jobContext);
        }

        public void runImportJob() {
            logger.info("executing import job = {}", config.jobData);
            try {
                byte[] data = loadDataForImport();
                if (data == null) {
                    logger.info(marker(), "skip import operation: no data available for import");
                } else {
                    EtlProcessingResult operationResult = importExportService.importDataWithTemplate(newDataSource(data, "application/octet-stream"), config.template);
                    handlePostImportAction();//TODO safe post import execution
                    sendMailIfConfigured(prepareEmailData(context, null, operationResult), operationResult.hasErrors(), operationResult);
                }
            } catch (Exception ex) {
                logger.error(marker(), "import operation failed with error", ex);
                sendMailIfConfiguredSafe(prepareEmailData(context, ex, null), true, null);
                throw new EtlException(ex);
            }
        }

        private void sendMailIfConfiguredSafe(Map<String, Object> mailData, boolean hasError, @Nullable EtlProcessingResult result) {
            try {
                sendMailIfConfigured(mailData, hasError, result);
            } catch (Exception ex) {
                logger.error(marker(), "email processing error", ex);
            }
        }

        private void sendMailIfConfigured(Map<String, Object> mailData, boolean hasError, @Nullable EtlProcessingResult result) {
            if (equal(config.notificationMode, IN_ALWAYS) || (hasError && equal(config.notificationMode, IN_ON_ERRORS))) {
                Email email = emailTemplateProcessorService.createEmailFromTemplate(hasError ? config.errorTemplate : config.notificationTemplate, (Map) map(
                        "cm_import_source", getSourceDebugInfoStr()
                ).with(mailData));
                email = EmailImpl.copyOf(email).withStatus(ES_OUTGOING).accept(e -> {
                    if (config.emailAccount != null) {
                        e.withAccount(config.emailAccount.getId());
                    }
                    if (config.attachImportReport && result != null) {
                        try {
                            DataSource dataSource = importExportService.buildImportResultReport(result, config.template);
                            e.withAttachments(EmailAttachmentImpl.build(dataSource));
                        } catch (Exception ex) {
                            logger.error(marker(), "error building result report", ex);
                        }
                    }
                }).build();
                email = emailService.create(email);
                logger.debug("sent notification email = {}", email);
            }
        }

        @Nullable
        private String getSourceDebugInfoStr() {
            switch (config.source) {
                case IS_FILE:
                    return getFileForImportSafe() == null ? null : getFileForImportSafe().getAbsolutePath();
                case IS_URL:
                    return config.url;
                default:
                    throw new EtlException("unsupported source = %s", config.source);
            }
        }

        @Nullable
        private byte[] loadDataForImport() {
            switch (config.source) {
                case IS_FILE:
                    return loadFileDataForImport();
                case IS_URL:
                    return loadUrlDataForImport();
                default:
                    throw new EtlException("unsupported source = %s", config.source);
            }
        }

        private byte[] loadUrlDataForImport() {
            try {
                logger.debug("load data from url = {}", config.url);
                URI uri = URI.create(config.url);
                byte[] data = toByteArray(uri.toURL().openStream());
                logger.debug("processing {} bytes from url = {}", FileUtils.byteCountToDisplaySize(data.length), config.url);
                return data;
            } catch (Exception ex) {
                throw new EtlException(ex, "error loading data from url = %s", config.url);
            }
        }

        @Nullable
        private byte[] loadFileDataForImport() {
            File fileToImport = getFileForImport();
            if (fileToImport == null) {
                return null;
            } else {
                logger.debug("found file for import = {}", fileToImport.getAbsolutePath());
                byte[] data = toByteArray(fileToImport);
                logger.debug("processing {} bytes from file = {}", FileUtils.byteCountToDisplaySize(data.length), fileToImport.getAbsolutePath());
                return data;
            }
        }

        @Nullable
        private File getFileForImport() {
            if (sourceFile == null) {
                sourceFile = Optional.ofNullable(config.helper.getFileForImport());
            }
            return sourceFile.orElse(null);
        }

        @Nullable
        private File getFileForImportSafe() {
            try {
                return getFileForImport();
            } catch (Exception ex) {
                logger.warn("source file not found", ex);
                return null;
            }
        }

        private void handlePostImportAction() {
            logger.debug("handle post import action for source = {}", config.source);
            if (equal(config.source, IS_FILE)) {
                config.helper.handlePostImportAction();
            }
        }

    }

    public static enum ImportJobSource {
        IS_FILE, IS_URL
    }

    enum ImportNotificationMode {
        IN_ON_ERRORS, IN_ALWAYS, IN_NEVER
    }

}
