/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.job;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.nullToEmpty;
import static com.google.common.collect.Iterables.getOnlyElement;
import static com.google.common.collect.Lists.reverse;
import static java.lang.String.format;
import static java.util.Collections.emptyList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import org.apache.commons.lang3.StringUtils;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.api.fluent.CmApiService;
import org.cmdbuild.auth.session.SessionService;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.config.EmailConfiguration;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.common.beans.CardIdAndClassName;
import static org.cmdbuild.common.beans.CardIdAndClassNameImpl.card;
import org.cmdbuild.common.beans.LookupValue;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import org.cmdbuild.dao.entrytype.Attribute;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.BOOLEAN;
import org.cmdbuild.dao.function.StoredFunction;
import org.cmdbuild.dms.DmsService;
import org.cmdbuild.dms.DocumentData;
import org.cmdbuild.dms.DocumentDataImpl;
import org.cmdbuild.email.Email;
import static org.cmdbuild.email.Email.EMAIL_ATTR_STATUS;
import org.cmdbuild.email.EmailAccount;
import org.cmdbuild.email.EmailAccountService;
import org.cmdbuild.email.EmailAttachment;
import org.cmdbuild.email.EmailException;
import org.cmdbuild.email.EmailService;
import static org.cmdbuild.email.EmailStatus.ES_ACQUIRED;
import static org.cmdbuild.email.EmailStatus.ES_OUTGOING;
import org.cmdbuild.email.EmailTemplate;
import org.cmdbuild.email.EmailTemplateService;
import org.cmdbuild.email.beans.EmailImpl;
import static org.cmdbuild.email.Email.EMAIL_CLASS_NAME;
import org.cmdbuild.email.mta.EmailMtaService;
import org.cmdbuild.email.mta.EmailProcessedAction;
import static org.cmdbuild.email.mta.EmailProcessedAction.EPA_DEFAULT;
import static org.cmdbuild.email.mta.EmailProcessedAction.EPA_DO_NOTHING;
import static org.cmdbuild.email.mta.EmailProcessedAction.EPA_MOVE_TO_REJECTED;
import org.cmdbuild.email.mta.EmailReceiveConfigImpl;
import org.cmdbuild.email.template.EmailTemplateProcessorService;
import static org.cmdbuild.email.utils.EmailUtils.parseCardIdFromEmailSubject;
import static org.cmdbuild.email.utils.EmailUtils.parseSubjectDescrFromEmailSubject;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;
import org.cmdbuild.workflow.WorkflowService;
import org.cmdbuild.workflow.model.Flow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import org.cmdbuild.workflow.WorkflowConfiguration;
import static org.cmdbuild.email.utils.EmailMtaUtils.parseAcquiredEmail;
import org.cmdbuild.etl.gate.EtlGateService;
import org.cmdbuild.lookup.LookupService;
import org.cmdbuild.utils.groovy.GroovyScriptService;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.io.CmIoUtils.toDataSource;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBoolean;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;

@Component
public class EmailJobHelperServiceImpl implements EmailJobHelperService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private static final String FUNCTION_PARAM_CONTENT = "content", FUNCTION_PARAM_CC_ADDRESSES = "ccAddresses", FUNCTION_PARAM_FROM_ADDRESS = "fromAddress", FUNCTION_PARAM_SUBJECT = "subject", FUNCTION_PARAM_TO_ADDRESSES = "toAddresses";

    private final DaoService dao;
    private final WorkflowService workflowService;
    private final DmsService dmsService;
    private final EmailService emailService;
    private final EmailMtaService mtaService;
    private final EmailAccountService accountService;
    private final EmailTemplateService templateService;
    private final EmailTemplateProcessorService templateProcessor;
    private final SessionService sessionService;
    private final EmailConfiguration emailConfiguration;
    private final WorkflowConfiguration workflowConfiguration;
    private final GroovyScriptService scriptService;
    private final CmApiService apiService;
    private final EtlGateService gateService;
    private final LookupService lookupService;

    public EmailJobHelperServiceImpl(DaoService dao, WorkflowService workflowService, DmsService dmsService, EmailService emailService, EmailMtaService mtaService, EmailAccountService accountService, EmailTemplateService templateService, EmailTemplateProcessorService templateProcessor, SessionService sessionService, EmailConfiguration emailConfiguration, WorkflowConfiguration workflowConfiguration, GroovyScriptService scriptService, CmApiService apiService, EtlGateService gateService, LookupService lookupService) {
        this.dao = checkNotNull(dao);
        this.workflowService = checkNotNull(workflowService);
        this.dmsService = checkNotNull(dmsService);
        this.emailService = checkNotNull(emailService);
        this.mtaService = checkNotNull(mtaService);
        this.accountService = checkNotNull(accountService);
        this.templateService = checkNotNull(templateService);
        this.templateProcessor = checkNotNull(templateProcessor);
        this.sessionService = checkNotNull(sessionService);
        this.emailConfiguration = checkNotNull(emailConfiguration);
        this.workflowConfiguration = checkNotNull(workflowConfiguration);
        this.scriptService = checkNotNull(scriptService);
        this.apiService = checkNotNull(apiService);
        this.gateService = checkNotNull(gateService);
        this.lookupService = checkNotNull(lookupService);
    }

    @Override
    public void receiveEmailsWithConfig(EmailJobConfig config) {
        try {
            new EmailsReaderHelper(config).readEmails();
        } catch (Exception ex) {
            throw new EmailException(ex, "error reading emails for config = %s", config);
        }
    }

    private class EmailsReaderHelper {

        private final EmailJobConfig config;
        private final EmailAccount account;

        public EmailsReaderHelper(EmailJobConfig config) {
            this.config = checkNotNull(config);
            account = accountService.getAccount(config.getAccountName());
        }

        public void readEmails() {
            switch (config.getEmailSource()) {
                case JCES_MTA:
                    logger.debug("reading emails from account = {} for job = {}", account, config.getJob());
                    mtaService.receive(account, EmailReceiveConfigImpl.builder()
                            .withIncomingFolder(config.getFolderIncoming())
                            .withReceivedFolder(config.getFolderProcessed())
                            .withRejectedFolder(config.getFolderRejected())
                            .withCallback(this::handleReceivedEmail).build());
                    break;
                case JCES_DB:
                    logger.debug("processing acquired email from db for job = {}", config.getJob());
                    dao.selectAll().from(Email.class).where(EMAIL_ATTR_STATUS, EQ, ES_ACQUIRED).asList(Email.class).forEach(e -> handleReceivedEmail(parseAcquiredEmail(e)));
                    break;
                default:
                    throw unsupported("unsupported email source = %s", config.getEmailSource());
            }
        }

        private EmailProcessedAction handleReceivedEmail(Email email) {
            return new EmailReaderHelper(email).handleReceivedEmail();
        }

        private class EmailReaderHelper {

            private Email email;
            private Email inReplyTo;
            private final List<EmailAttachment> attachments;

            public EmailReaderHelper(Email email) {
                this.email = checkNotNull(email);
                if (email.hasAttachments()) {
                    attachments = email.getAttachments();
                    this.email = EmailImpl.copyOf(this.email).withAttachments(emptyList()).build();
                } else {
                    attachments = emptyList();
                }
            }

            public EmailProcessedAction handleReceivedEmail() {
                EmailProcessedAction action = EPA_DEFAULT;
                try {
                    logger.debug("processing email = {} for job = {}", email, config.getJob());
                    safe(this::handleReferencedEmail);
                    FilterResult filterResult = applyFilter();
                    if (filterResult.emailMatchesFilter()) {
                        email = emailService.update(email);
                        safe(this::handleNotification);
                        safe(this::handleAttachments);
                        safe(this::startWorkflow);
                        safe(this::startGate);
                    } else {
                        logger.debug("email does not match filter");
                        if (filterResult.hasCustomPostFilterAction()) {
                            action = filterResult.getPostFilterAction();
                        } else {
                            switch (config.getEmailSource()) {
                                case JCES_MTA:
                                    if (config.moveToRejectedOnFilterMismatch()) {
                                        action = EPA_MOVE_TO_REJECTED;
                                    } else if (config.leaveMailOnFilterMismatch()) {
                                        action = EPA_DO_NOTHING;
                                    }
                                    emailService.delete(email);
                                    break;
                                case JCES_DB:
                                    //do nothing
                                    break;
                                default:
                                    throw unsupported("unsupported email source = %s", config.getEmailSource());
                            }
                        }
                    }
                    logger.info(marker(), "processed email = {}", email);
                } catch (Exception ex) {
                    throw new EmailException(ex, "error processing email = %s for job = %s", email, config.getJob());
                }
                return action;
            }

            private FilterResult applyFilter() {
                switch (config.getFilterType()) {
                    case FT_NONE:
                        return new FilterResult(true);
                    case FT_ISREPLY:
                        return new FilterResult(inReplyTo != null);
                    case FT_ISNOTREPLY:
                        return new FilterResult(inReplyTo == null);
                    case FT_REGEX:
                        return new FilterResult(emailMatchesRegexpFilter());
                    case FT_FUNCTION:
                        return new FilterResult(emailMatchesFunctionFilter());
                    case FT_SCRIPT:
                        return applyScriptFilter();
                    default:
                        throw new IllegalArgumentException("unsupported email filter type = " + config.getFilterType());
                }
            }

            private FilterResult applyScriptFilter() {
                Map<String, Object> out = scriptService.executeScript(config.getFilterScript(), map(
                        "cmdb", apiService.getCmApi(),
                        "logger", LoggerFactory.getLogger(format("%s.HANDLER", getClass().getName())),
                        "email", map(
                                "to", email.getToEmailAddressList(),
                                "from", email.getFromEmailAddressList(),
                                "subject", email.getSubject(),
                                "content", email.getContent(),
                                "content_html", email.getContentHtml(),
                                "content_plaintext", email.getContentPlaintext(),
                                "card", email.getReference(),
                                "model", email),
                        "output", null,
                        "action", "default"
                ));
                boolean output = toBoolean(out.get("output"));
                EmailProcessedAction action = parseEnumOrDefault(toStringOrNull(out.get("action")), EPA_DEFAULT);
                return new FilterResult(output, action);
            }

            private void handleReferencedEmail() {
                List<String> referencesToTest = list(email.getInReplyTo()).with(reverse(email.getReferences())).stream().filter(StringUtils::isNotBlank).distinct().collect(toList());
                logger.debug("search previous email for email = {} with references = {}", email, referencesToTest);
                inReplyTo = referencesToTest.stream().map(emailService::getLastWithReferenceByMessageIdOrNull).filter(Objects::nonNull).findFirst().orElse(null);
                String subject = email.getSubject();
                if (inReplyTo == null) {
                    Long referencedEmailId = parseCardIdFromEmailSubject(subject);
                    if (referencedEmailId != null) {
                        inReplyTo = emailService.getOneOrNull(referencedEmailId);
                        if (inReplyTo == null) {
                            logger.warn(marker(), "unable to find previous email from subject = <{}>: email not found for id = {}", subject, referencedEmailId);
                        }
                        subject = parseSubjectDescrFromEmailSubject(subject);
                    }
                }
                if (inReplyTo == null && config.isAggressiveInReplyToMatchingEnabled()) {
                    String from = email.getFirstFromAddressOrNull();
                    if (isNotBlank(from)) {
                        inReplyTo = emailService.getLastWithReferenceBySenderAndSubjectFuzzyMatchingOrNull(from, subject);
                    }
                }
                if (inReplyTo != null) {
                    logger.info("email match previous email = {} with reference card = {}", inReplyTo, inReplyTo.getReference());
                    email = EmailImpl.copyOf(email)
                            .withSubject(subject)
                            .withAutoReplyTemplate(inReplyTo.getAutoReplyTemplate())
                            .withReference(inReplyTo.getReference())
                            .build();
                } else {
                    logger.debug("email does not match any previous email");
                }
            }

            private void handleNotification() {
                if (config.isActionNotificationActive()) {
                    logger.debug("send notification for email = {} job = {}", email, config.getJob());
                    EmailTemplate template;
                    if (!config.hasNotificationTemplate() && email.getAutoReplyTemplate() == null) {
                        logger.warn(marker(), "unable to send notification for email = {}, template config not found in neither job nor email", email);
                    } else {
                        if (config.hasNotificationTemplate()) {
                            template = templateService.getByName(config.getNotificationTemplate());
                        } else {
                            template = templateService.getOne(email.getAutoReplyTemplate());
                        }
                        EmailAccount account;
                        if (template.hasAccount()) {
                            account = accountService.getAccount(template.getAccount());
                        } else {
                            account = accountService.getAccount(config.getAccountName());
                        }
                        checkArgument(email.hasReference(), "cannot send notifications for email = %s, email reference card not found", email);
                        Card card = dao.getCard(email.getReference());
                        if (card.isProcess()) {
                            card = workflowService.getFlowCard(card.getClassName(), card.getId());
                        }
                        Email notificationEmail = EmailImpl.builder()
                                .withStatus(ES_OUTGOING)
                                .withTemplate(template.getId())
                                .withReference(email.getReference())
                                .build();
                        notificationEmail = templateProcessor.applyEmailTemplate(notificationEmail, template, card, email);
                        if (email.getFromRawAddressList().stream().anyMatch(notificationEmail::hasToAddress)) {
                            notificationEmail = EmailImpl.copyOf(notificationEmail)
                                    .withReplyTo(email.getMessageId())
                                    .withReferences(list(email.getReferences()).with(email.getMessageId()))
                                    .build();
                        }
                        if (account != null) {
                            notificationEmail = EmailImpl.copyOf(notificationEmail).withAccount(account.getId()).build();
                        }
                        notificationEmail = emailService.create(notificationEmail);
                        logger.info(marker(), "sent notification email = {} for email = {}", notificationEmail, email);
                    }
                }
            }

            private void handleAttachments() {
                if (config.isActionAttachmentsActive()) {
                    logger.debug("handle attachments for email = {} job = {} mode = {}", email, config.getJob(), config.getEmailAttachmentProcessingMode());
                    boolean attachToCard, attachToEmail;
                    switch (config.getEmailAttachmentProcessingMode()) {
                        case EA_ATTACH_TO_CARD:
                            if (!email.hasReference()) {
                                logger.warn("email = {} is missing reference card, unable to add email attachments", email);
                                attachToCard = false;
                            } else {
                                attachToCard = true;
                            }
                            attachToEmail = false;
                            break;
                        case EA_ATTACH_TO_EMAIL:
                            attachToCard = false;
                            attachToEmail = true;
                            break;
                        case EA_AUTO:
                            attachToCard = email.hasReference();
                            attachToEmail = !attachToCard;
                            break;
                        case EA_BOTH:
                            attachToCard = attachToEmail = true;
                            break;
                        default:
                            throw new IllegalArgumentException("unsupported email attachment processing mode = " + config.getEmailAttachmentProcessingMode());
                    }
                    if (attachToEmail) {
                        storeEmailAttachments(card(EMAIL_CLASS_NAME, email.getId()));
                    }
                    if (attachToCard) {
                        storeEmailAttachments(dao.getCard(email.getReference()));
                    }
                } else {
                    logger.debug("attachment processing is disabled");
                }
            }

            private void startWorkflow() {
                if (config.isActionWorkflowActive()) {
                    logger.debug("start workflow = {} for email = {} job = {}", config.getActionWorkflowClassName(), email, config.getJob());
                    String username = firstNotBlank(config.getActionWorkflowPerformerUsername(), workflowConfiguration.getDefaultUserForWfJobs());
                    sessionService.impersonate(username);
                    Flow flow;
                    try {
                        Map<String, Object> flowData = templateProcessor.applyEmailTemplate(config.getActionWorkflowFieldsMapping(), email, config.getMapperConfig());
                        logger.debug("flow data from email = \n\n{}\n", mapToLoggableStringLazy(flowData));
                        flow = workflowService.startProcess(config.getActionWorkflowClassName(), flowData, false).getFlowCard();
                        email = emailService.update(EmailImpl.copyOf(email).withReference(flow.getId()).build());
                        if (config.isActionWorkflowAttachmentsSave()) {
                            attachments.stream().forEach(a -> storeWorkflowAttachment(flow, a));
                        }
                        if (config.isActionWorkflowAdvance()) {
                            workflowService.updateProcessWithOnlyTask(flow.getClassName(), flow.getId(), flowData, true);
                        }
                    } finally {
                        sessionService.deimpersonate();
                    }
                    logger.info(marker(), "started flow = {} for email = {}", flow, email);
                }
            }

            private void startGate() {
                if (config.isActionGateActive()) {
                    logger.debug("call gate = {} for email = {} job = {}", config.getActionGateCode(), email, config.getJob());
                    DataSource data;
                    switch (config.getActionGateSource()) {
                        case JCEGS_BODY_PLAINTEXT:
                            data = newDataSource(email.getContentPlaintext(), "text/plain");
                            break;
                        case JCEGS_ATTACHMENT:
                            checkArgument(attachments.size() == 1, "unable to call gate action for email = %s : expected exactly one attacchment, but found = %s", email, attachments);
                            EmailAttachment attachment = getOnlyElement(attachments);
                            data = toDataSource(attachment.getDataHandler());
                            break;
                        default:
                            throw unsupported("unsupported gate source = %s", config.getActionGateSource());
                    }
                    gateService.receive(config.getActionGateCode(), data, map("email", email.getId()));
                }
            }

            private void storeEmailAttachments(CardIdAndClassName card) {
                logger.debug("store {} email attachments, add to card = {}", email.getAttachments().size(), card);
                attachments.stream().forEach(a -> storeEmailAttachment(card, a));
            }

            private void storeEmailAttachment(CardIdAndClassName card, EmailAttachment attachment) {
                DocumentData document = DocumentDataImpl.builder()
                        .withData(attachment.getData())
                        .withFilename(attachment.getFileName())
                        .withCategory(getDmsCategoryIfValid(card.getClassName(), config.getActionAttachmentsCategory()))
                        .build();
                try {
                    dmsService.checkIncomingEmailAttachment(document);
                } catch (Exception ex) {
                    logger.warn(marker(), "skipping invalid email attachment = {}", document, ex);
                    return;
                }
                dmsService.create(card, document);
            }

            private void storeWorkflowAttachment(Flow flow, EmailAttachment attachment) {
                dmsService.create(flow, DocumentDataImpl.builder()
                        .withData(attachment.getData())
                        .withFilename(attachment.getFileName())
                        .withCategory(getDmsCategoryIfValid(flow.getClassName(), config.getActionWorkflowAttachmentsCategory()))
                        .build());
            }

            @Nullable
            private String getDmsCategoryIfValid(String className, @Nullable String category) {
                if (isBlank(category)) {
                    return null;
                } else {
                    LookupValue value = lookupService.getLookupByTypeAndCodeOrDescriptionOrIdOrNull(dmsService.getCategoryLookupType(className).getName(), category);
                    if (value == null) {
                        logger.debug("invalid dms category =< {} > for class =< {} >", category, className);
                        return null;
                    } else {
                        return toStringNotBlank(value.getId());
                    }
                }
            }

            private void safe(Runnable action) {
                if (emailConfiguration.emailJobContinueOnError()) {
                    try {
                        action.run();
                    } catch (Exception ex) {
                        logger.error(marker(), "error while processing email = {} job = {} (safe mode is enabled; ignore error and continue email processing)", email, config.getJob(), ex);
                    }
                } else {
                    action.run();
                }
            }

            private boolean emailMatchesFunctionFilter() {
                StoredFunction function = dao.getFunctionByName(config.getFilterFunctionName());
                checkArgument(function.hasOnlyOneOutputParameter() && function.getOnlyOutputParameter().getType().isOfType(BOOLEAN), "invalid output type for filter function = %s: required single boolean)", function);
                Set<String> params = set(FUNCTION_PARAM_FROM_ADDRESS, FUNCTION_PARAM_TO_ADDRESSES, FUNCTION_PARAM_CC_ADDRESSES, FUNCTION_PARAM_SUBJECT, FUNCTION_PARAM_CONTENT);
                checkArgument(equal(function.getOutputParameters().stream().map(Attribute::getName).collect(toSet()), params), "invalid params for filter function = %s: requires exactly these params = %s", function, params);
                boolean matches = dao.selectFunction(function, map(
                        FUNCTION_PARAM_FROM_ADDRESS, email.getFromAddress(),
                        FUNCTION_PARAM_TO_ADDRESSES, email.getToAddresses(),
                        FUNCTION_PARAM_CC_ADDRESSES, email.getCcAddresses(),
                        FUNCTION_PARAM_SUBJECT, email.getSubject(),
                        FUNCTION_PARAM_CONTENT, email.getContent()
                )).getSingleFunctionOutput(function);
                logger.debug("email {} function filter = {}", matches ? "matches" : "does not match", function);
                return matches;
            }

            private boolean emailMatchesRegexpFilter() {
                boolean matches = (config.hasFilterRegexpFrom() ? email.getFromEmailAddressList().stream().anyMatch(a -> Pattern.compile(config.getFilterRegexpFrom(), Pattern.CASE_INSENSITIVE).matcher(a).matches()) : true)
                        && (config.hasFilterRegexpSubject() ? nullToEmpty(email.getSubject()).matches(config.getFilterRegexpSubject()) : true);
                logger.debug("email {} regex filter for subject = {} and/or from address = {}", matches ? "matches" : "does not match", config.getFilterRegexpSubject(), config.getFilterRegexpFrom());
                return matches;
            }

        }
    }

    private static class FilterResult {

        private final boolean matchesFilter;
        private final EmailProcessedAction action;

        public FilterResult(boolean matchesFilter, EmailProcessedAction action) {
            this.matchesFilter = matchesFilter;
            this.action = checkNotNull(action);
        }

        public FilterResult(boolean matchesFilter) {
            this(matchesFilter, EPA_DEFAULT);
        }

        public boolean emailMatchesFilter() {
            return matchesFilter;
        }

        public EmailProcessedAction getPostFilterAction() {
            return action;
        }

        public boolean hasCustomPostFilterAction() {
            return !equal(getPostFilterAction(), EPA_DEFAULT);
        }

    }
}
