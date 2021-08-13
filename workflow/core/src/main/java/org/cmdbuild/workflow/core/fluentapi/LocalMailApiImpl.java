/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.workflow.core.fluentapi;

import static com.google.common.base.Preconditions.checkNotNull;
import java.net.URL;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
import org.cmdbuild.api.fluent.MailApi;
import org.cmdbuild.email.EmailService;
import static org.cmdbuild.email.EmailStatus.ES_OUTGOING;
import org.cmdbuild.email.beans.EmailAttachmentImpl;
import org.cmdbuild.email.beans.EmailImpl;
import org.cmdbuild.email.beans.EmailImpl.EmailImplBuilder;
import static org.cmdbuild.utils.io.CmIoUtils.toDataSource;
import static org.cmdbuild.utils.io.CmIoUtils.urlToDataSource;
import static org.cmdbuild.utils.lang.CmNullableUtils.ltEqZeroToNull;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.cmdbuild.api.fluent.NewMail;
import static org.cmdbuild.utils.lang.CmCollectionUtils.toListOrEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@Primary
public class LocalMailApiImpl implements MailApi {

    private final EmailService emailService;
    private final Logger logger = LoggerFactory.getLogger(getClass());

    public LocalMailApiImpl(EmailService emailService) {
        this.emailService = checkNotNull(emailService);
    }

    @Override
    public NewMail newMail() {
        return new SendableNewMailImpl();
    }

    private class SendableNewMailImpl implements NewMail {

        private final EmailImplBuilder email = EmailImpl.builder();

        @Override
        public NewMail withFrom(String from) {
            email.withFromAddress(from);
            return this;
        }

        @Override
        public NewMail withTo(String to) {
            email.addToAddress(to);
            return this;
        }

        @Override
        public NewMail withTo(String... tos) {
            email.addToAddresses(toListOrEmpty(tos));
            return this;
        }

        @Override
        public NewMail withTo(Iterable<String> tos) {
            email.addToAddresses(toListOrEmpty(tos));
            return this;
        }

        @Override
        public NewMail withCc(String cc) {
            email.addCcAddress(cc);
            return this;
        }

        @Override
        public NewMail withCc(String... ccs) {
            email.addCcAddresses(toListOrEmpty(ccs));
            return this;
        }

        @Override
        public NewMail withCc(Iterable<String> ccs) {
            email.addCcAddresses(toListOrEmpty(ccs));
            return this;
        }

        @Override
        public NewMail withBcc(String bcc) {
            email.addBccAddress(bcc);
            return this;
        }

        @Override
        public NewMail withBcc(String... bccs) {
            email.addBccAddresses(toListOrEmpty(bccs));
            return this;
        }

        @Override
        public NewMail withBcc(Iterable<String> bccs) {
            email.addBccAddresses(toListOrEmpty(bccs));
            return this;
        }

        @Override
        public NewMail withSubject(String subject) {
            email.withSubject(subject);
            return this;
        }

        @Override
        public NewMail withContent(String content) {
            email.withContent(content);
            return this;
        }

        @Override
        public NewMail withContentType(String contentType) {
            email.withContentType(contentType);
            return this;
        }

        @Override
        public NewMail withAttachment(URL url) {
            email.addAttachment(EmailAttachmentImpl.build(urlToDataSource(url)));
            return this;
        }

        @Override
        public NewMail withAttachment(URL url, String name) {
            email.addAttachment(EmailAttachmentImpl.copyOf(urlToDataSource(url)).withFileName(name).build());
            return this;
        }

        @Override
        public NewMail withAttachment(String url) {
            email.addAttachment(EmailAttachmentImpl.build(urlToDataSource(url)));
            return this;
        }

        @Override
        public NewMail withAttachment(String url, String name) {
            email.addAttachment(EmailAttachmentImpl.copyOf(urlToDataSource(url)).withFileName(name).build());
            return this;
        }

        @Override
        public NewMail withAttachment(DataHandler dataHandler) {
            email.addAttachment(EmailAttachmentImpl.build(toDataSource(dataHandler)));
            return this;
        }

        @Override
        public NewMail withAttachment(DataHandler dataHandler, String name) {
            email.addAttachment(EmailAttachmentImpl.copyOf(toDataSource(dataHandler)).withFileName(name).build());
            return this;
        }

        @Override
        public NewMail withAsynchronousSend(boolean asynchronous) {
            logger.warn("Usage of withAsynchronousSend is not required due to every mail being sent asyncronusly");
            return this;
        }

        @Override
        public void send() {
            emailService.create(email.withStatus(ES_OUTGOING).build());
        }

        @Override
        public NewMail withCard(@Nullable String className, @Nullable Long cardId) {
            email.withReference(ltEqZeroToNull(cardId));
            return this;
        }

    }

}
