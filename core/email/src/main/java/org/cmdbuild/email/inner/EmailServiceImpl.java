/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.inner;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.eventbus.EventBus;
import static java.lang.String.format;
import static java.util.Collections.emptyList;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;
import javax.annotation.Nullable;
import org.cmdbuild.dao.beans.Card;
import static org.cmdbuild.common.beans.CardIdAndClassNameImpl.card;
import org.cmdbuild.dms.DmsService;
import org.cmdbuild.dms.DocumentData;
import org.cmdbuild.dms.DocumentDataImpl;
import org.cmdbuild.email.Email;
import org.cmdbuild.email.EmailAttachment;
import org.cmdbuild.email.beans.EmailAttachmentImpl;
import org.cmdbuild.email.EmailService;
import static org.cmdbuild.email.EmailStatus.ES_DRAFT;
import static org.cmdbuild.email.EmailStatus.ES_OUTGOING;
import org.cmdbuild.email.EmailTemplate;
import org.cmdbuild.email.EmailTemplateService;
import org.cmdbuild.email.beans.EmailImpl;
import static org.cmdbuild.email.Email.EMAIL_CLASS_NAME;
import org.cmdbuild.email.data.EmailRepository;
import org.cmdbuild.email.template.EmailTemplateProcessorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.apache.commons.io.FilenameUtils;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import static org.cmdbuild.utils.lang.EventBusUtils.logExceptions;

@Component
public class EmailServiceImpl implements EmailService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EventBus eventBus = new EventBus(logExceptions(logger));
    private final EmailRepository repository;
    private final EmailTemplateService templateRepository;
    private final EmailTemplateProcessorService templateProcessorService;
    private final DmsService dmsService;

    public EmailServiceImpl(EmailRepository repository, EmailTemplateService templateRepository, EmailTemplateProcessorService templateProcessorService, DmsService dmsService) {
        this.repository = checkNotNull(repository);
        this.templateRepository = checkNotNull(templateRepository);
        this.templateProcessorService = checkNotNull(templateProcessorService);
        this.dmsService = checkNotNull(dmsService);
    }

    @Override
    public Email getLastReceivedEmail() {
        return repository.getLastReceivedEmail();
    }

    @Override
    public EventBus getEventBus() {
        return eventBus;
    }

    @Override
    public List<Email> getAllForCard(long reference, DaoQueryOptions queryOptions) {
        return repository.getAllForCard(reference, queryOptions);
    }

    @Override
    @Nullable
    public Email getOneOrNull(long emailId) {
        return repository.getOneOrNull(emailId);
    }

    @Override
    public List<Email> getAllForTemplate(long templateId) {
        return repository.getAllForTemplate(templateId);
    }

    @Override
    public List<Email> getByMessageId(String messageId) {
        return repository.getByMessageId(messageId);
    }

    @Override
    @Nullable
    public Email getLastWithReferenceBySenderAndSubjectFuzzyMatchingOrNull(String from, String subject) {
        return repository.getLastWithReferenceBySenderAndSubjectFuzzyMatchingOrNull(from, subject);
    }

    @Override
    public Email create(Email email) {
        logger.debug("create email = {}", email);
        switch (email.getStatus()) {
            case ES_ACQUIRED:
                return repository.create(email);
            default:
                Email saved = repository.create(EmailImpl.copyOf(email).withStatus(ES_DRAFT).build());
                if (email.hasAttachments()) {
                    saved = EmailImpl.copyOf(saved).withAttachments(email.getAttachments()).build();
                    saveEmailAttachments(saved);
                }
                if (!equal(saved.getStatus(), email.getStatus())) {
                    saved = repository.update(EmailImpl.copyOf(email).withId(saved.getId()).build());
                    if (email.hasAttachments()) {
                        saved = EmailImpl.copyOf(saved).withAttachments(email.getAttachments()).build();
                    }
                    checkOutgoing(saved);
                }
                return saved;
        }
    }

    @Override
    public Email update(Email email) {
        logger.debug("update email = {}", email);
        email = repository.update(email);
        saveEmailAttachments(email);
        checkOutgoing(email);
        return email;
    }

    @Override
    public void delete(Email email) {
        logger.debug("delete email = {}", email);
        repository.delete(email);
    }

    @Override
    public Email applyTemplate(Email email, Card clientCard, Card serverCard) {
        logger.debug("sync template for email = {}", email);
        checkArgument(email.hasTemplate(), "unable to sync email without template");
        EmailTemplate template = templateRepository.getOne(email.getTemplate());
        return templateProcessorService.applyEmailTemplate(email, template, clientCard, serverCard);
//        return doApplyTemplate(email, cardData, null);
    }

    @Override
    public Email applyTemplate(Email email) {//TODO improve this method, remove duplicate code (see above)
        logger.debug("apply template for email = {}", email);
        checkArgument(email.hasTemplate(), "unable to sync email without template");
        EmailTemplate template = templateRepository.getOne(email.getTemplate());
        return templateProcessorService.applyEmailTemplate(email, template);
    }

    @Override
    public String applyTemplateExpr(Long templateId, Card cardData, String expr) {
        EmailTemplate template = templateRepository.getOne(checkNotNull(templateId, "email template id cannot be null"));
        return templateProcessorService.applyEmailTemplateExpr(expr, template, cardData);
    }

    @Override
    public Email applySysTemplate(Email email, String sysTemplateId) {
        EmailTemplate template = templateRepository.getSystemTemplate(sysTemplateId);
        return templateProcessorService.applyEmailTemplate(email, template);
    }

    @Override
    public Email applyTemplate(Email email, EmailTemplate template, Map<String, Object> data) {
        return templateProcessorService.applyEmailTemplate(email, template, data);
    }

    @Override
    public List<Email> getAllForOutgoingProcessing() {
        return repository.getAllForOutgoingProcessing();
    }

    @Override
    public List<EmailAttachment> getEmailAttachments(long emailId) {
        if (dmsService.isEnabled()) {
            return dmsService.getCardAttachments(EMAIL_CLASS_NAME, emailId).stream().map(a
                    -> EmailAttachmentImpl.builder()
                            .withFileName(a.getFileName())
                            .withContentType(a.getMimeType())
                            .withData(dmsService.getDocumentBytes(a.getDocumentId()))
                            .build()).collect(toList());
        } else {
            return emptyList();
        }
    }

    @Override
    public Email loadAttachments(Email email) {
        if (email.getId() == null) {
            return email;
        } else {
            return EmailImpl.copyOf(email).withAttachments(getEmailAttachments(email.getId())).build();
        }
    }

    private void saveEmailAttachments(Email email) {
        if (!email.getAttachments().isEmpty()) {
            logger.debug("save email attachments");
            checkArgument(dmsService.isEnabled(), "dms service not enabled, unable to process email attachments!");
            email.getAttachments().forEach(a -> {//TODO merge/update attachments (?)
                DocumentData attachment = DocumentDataImpl.builder().withFilename(a.getFileName()).withData(a.getData()).build();
                int index = 0;
                while (dmsService.hasCardAttachmentWithFileName(EMAIL_CLASS_NAME, email.getId(), attachment.getFilename())) {
                    String newName = format("%s_%s.%s", FilenameUtils.getBaseName(a.getFileName()), ++index, FilenameUtils.getExtension(a.getFileName()));
                    attachment = DocumentDataImpl.copyOf(attachment).withFilename(newName).build();
                }
                dmsService.create(card(EMAIL_CLASS_NAME, email.getId()), attachment);
            });
        }
    }

    private void checkOutgoing(Email email) {
        if (equal(email.getStatus(), ES_OUTGOING)) {
            logger.debug("outgoing email processed, trigger email queue (email = {})", email);
            eventBus.post(NewOutgoingEmailEvent.INSTANCE);
        }
    }

}
