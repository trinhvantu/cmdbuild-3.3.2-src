/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.utils;

import com.google.common.base.Joiner;
import static com.google.common.base.MoreObjects.toStringHelper;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.nullToEmpty;
import static com.google.common.collect.Iterables.getLast;
import static com.google.common.collect.Lists.transform;
import static com.google.common.collect.Maps.transformValues;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;
import static java.lang.String.format;
import java.lang.invoke.MethodHandles;
import java.nio.charset.StandardCharsets;
import static java.util.Arrays.stream;
import java.util.List;
import java.util.function.Consumer;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.joining;
import javax.annotation.Nullable;
import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import org.apache.commons.lang3.StringEscapeUtils;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.email.Email;
import org.cmdbuild.email.EmailAccount;
import org.cmdbuild.email.EmailAttachment;
import org.cmdbuild.email.EmailException;
import static org.cmdbuild.email.EmailStatus.ES_ACQUIRED;
import static org.cmdbuild.email.EmailStatus.ES_RECEIVED;
import org.cmdbuild.email.beans.EmailImpl;
import org.cmdbuild.email.beans.EmailImpl.EmailImplBuilder;
import static org.cmdbuild.email.mta.EmailMtaServiceImpl.EMAIL_HEADER_IN_REPLY_TO;
import static org.cmdbuild.email.mta.EmailMtaServiceImpl.EMAIL_HEADER_MESSAGE_ID;
import static org.cmdbuild.email.mta.EmailMtaServiceImpl.EMAIL_HEADER_REFERENCES;
import static org.cmdbuild.email.utils.EmailUtils.formatEmailHeaderToken;
import static org.cmdbuild.email.utils.EmailUtils.parseEmailHeaderToken;
import static org.cmdbuild.email.utils.EmailUtils.parseEmailReferencesHeader;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import static org.cmdbuild.utils.date.CmDateUtils.toJavaDate;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.io.CmIoUtils.setCharsetInContentType;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableString;
import static org.cmdbuild.utils.log.LogUtils.printStreamFromLogger;
import static org.cmdbuild.utils.url.CmUrlUtils.toDataUrl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.cmdbuild.utils.io.CmIoUtils.getCharsetFromContentType;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.io.CmMultipartUtils.isMultipart;
import static org.cmdbuild.utils.io.CmMultipartUtils.isMultipartMixed;
import static org.cmdbuild.utils.lang.CmExceptionUtils.lazyString;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.utils.lang.CmMapUtils;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.mapOf;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowBiConsumer;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.safeSupplier;

public class EmailMtaUtils {

    private final static int MAX_EMBEDDED_IMAGE_SIZE = 1024 * 1024;//1M ; TODO: make this configurable!

    private static final String MAIL_IMAP_HOST = "mail.imap.host",
            MAIL_IMAP_PORT = "mail.imap.port",
            MAIL_IMAPS_HOST = "mail.imaps.host",
            MAIL_IMAP_SOCKET_FACTORY_CLASS = "mail.imap.socketFactory.class",
            MAIL_IMAPS_PORT = "mail.imaps.port",
            MAIL_IMAP_STARTTLS_ENABLE = "mail.imap.starttls.enable",
            MAIL_SMPT_SOCKET_FACTORY_CLASS = "mail.smpt.socketFactory.class",
            MAIL_SMPT_SOCKET_FACTORY_FALLBACK = "mail.smtp.socketFactory.fallback",
            MAIL_SMTP_AUTH = "mail.smtp.auth",
            MAIL_SMTP_HOST = "mail.smtp.host",
            MAIL_SMTP_PORT = "mail.smtp.port",
            MAIL_SMTPS_AUTH = "mail.smtps.auth",
            MAIL_SMTPS_HOST = "mail.smtps.host",
            MAIL_SMTPS_PORT = "mail.smtps.port",
            MAIL_SMTP_STARTTLS_ENABLE = "mail.smtp.starttls.enable",
            MAIL_STORE_PROTOCOL = "mail.store.protocol",
            MAIL_TRANSPORT_PROTOCOL = "mail.transport.protocol",
            JAVAX_NET_SSL_SSL_SOCKET_FACTORY = "javax.net.ssl.SSLSocketFactory";

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static String serializeMessageHeaders(Message message) throws MessagingException {
        return list(message.getAllHeaders()).stream().map(h -> format("%s: %s", h.getName(), nullToEmpty(h.getValue()))).collect(joining("\n"));
    }

    public static String getMessageId(Message message) {
        return parseEmailHeaderToken(getMessageHeader(message, EMAIL_HEADER_MESSAGE_ID));
    }

    public static String getMessageHeader(Message message, String key) {
        try {
            String[] rawValue = message.getHeader(key);
            if (rawValue == null || rawValue.length == 0) {
                return "";
            } else {
                checkArgument(rawValue.length == 1);
                return nullToEmpty(rawValue[0]);
            }
        } catch (MessagingException ex) {
            throw new EmailException(ex, "error reading email header =< %s >", key);
        }
    }

    public static String getMessageInfoSafe(Message message) {
        try {
            return toStringHelper(message)
                    .add("id", parseEmailHeaderToken(getMessageHeader(message, EMAIL_HEADER_MESSAGE_ID)))
                    .add("subject", nullToEmpty(message.getSubject()))
                    .add("from", message.getFrom() == null ? "" : Joiner.on(",").join(message.getFrom()))
                    .add("to", message.getAllRecipients() == null ? "" : Joiner.on(",").join(message.getAllRecipients())).toString();
        } catch (Exception ex) {
            LOGGER.warn("unable to get message infos for log message", ex);
            return message.toString();
        }
    }

    public static Email parseAcquiredEmail(Email email) {
        try {
            checkArgument(email.isAcquired(), "invalid email status");
            return EmailImpl.copyOf(email).accept(new MessageParser(email.getMultipartContent()).parseEmail()).build();
        } catch (Exception ex) {
            throw new EmailException(ex, "error parsing acquired email = %s", email);
        }
    }

    public static Email parseEmail(String rawEmail) {
        return parseEmail(rawEmail.getBytes(StandardCharsets.ISO_8859_1));
    }

    public static Email parseEmail(byte[] message) {
        return EmailImpl.builder().accept(new MessageParser(message).parseEmail()).build();
    }

    public static Email parseEmail(Message message) {
        return EmailImpl.builder().accept(new MessageParser(message).parseEmail()).build();
    }

    public static Consumer<EmailImplBuilder> emailParser(Message message) {
        return new MessageParser(message).parseEmail();
    }

    public static Email acquireEmail(byte[] message) {
        return EmailImpl.builder().accept(new MessageParser(message).acquireEmail()).build();
    }

    public static Consumer<EmailImplBuilder> emailAcquirer(Message message) {
        return new MessageParser(message).acquireEmail();
    }

    public static void testImapConnection(EmailAccount account) {
        LOGGER.debug("test imap connection");
        try {
            Session session = createImapSession(account);
            try (Store store = session.getStore()) {
                store.connect();
                checkArgument(store.isConnected(), "imap is not connected");
                Folder folder = store.getDefaultFolder();
                folder.list();
            }
        } catch (MessagingException ex) {
            throw new EmailException(ex);
        }
        LOGGER.debug("imap connection ok");
    }

    public static void testSmtpConnection(EmailAccount account) {
        LOGGER.debug("test smtp connection");
        try {
            Session session = createSmtpSession(account);
            try (Transport transport = session.getTransport()) {
                transport.connect();
                checkArgument(transport.isConnected(), "smtp is not connected");
            }
        } catch (MessagingException ex) {
            throw new EmailException(ex);
        }
        LOGGER.debug("smtp connection ok");
    }

    public static Session createImapSession(EmailAccount account) {
        return createImapSession(account, null);
    }

    public static Session createImapSession(EmailAccount account, @Nullable Integer imapTimeoutSeconds) {
        checkArgument(account.isImapConfigured(), "cannot open imap connection, imap not configured for account = %s", account);
        FluentMap<String, String> properties = mapOf(String.class, String.class).with(
                //                                "mail.imap.fetchsize", "1048576", //"52428800"
                //                                "mail.imaps.fetchsize", "1048576" //"52428800"
                "mail.imap.partialfetch", "false",
                "mail.imaps.partialfetch", "false"
        ).with(System.getProperties());
        if (isNotNullAndGtZero(imapTimeoutSeconds)) {
            String timeout = Integer.toString(imapTimeoutSeconds * 1000);
            properties.put(
                    "mail.imap.connectiontimeout", timeout,
                    "mail.imap.timeout", timeout,
                    "mail.imap.writetimeout", timeout,
                    "mail.imaps.connectiontimeout", timeout,
                    "mail.imaps.timeout", timeout,
                    "mail.imaps.writetimeout", timeout
            );
        }
        properties.put(MAIL_STORE_PROTOCOL, account.getImapSsl() ? "imaps" : "imap");
        properties.put(MAIL_IMAP_STARTTLS_ENABLE, (account.getImapStartTls() ? TRUE : FALSE).toString());
        if (account.getImapSsl()) {
            properties.put(MAIL_IMAPS_HOST, account.getImapServer());
            if (isNotNullAndGtZero(account.getImapPort())) {
                properties.put(MAIL_IMAPS_PORT, account.getImapPort().toString());
            }
            properties.put(MAIL_IMAP_SOCKET_FACTORY_CLASS, JAVAX_NET_SSL_SSL_SOCKET_FACTORY);
        } else {
            properties.put(MAIL_IMAP_HOST, account.getImapServer());
            if (isNotNullAndGtZero(account.getImapPort())) {
                properties.put(MAIL_IMAP_PORT, account.getImapPort().toString());
            }
        }
        account.getConfig().forEach(properties::put);
        Authenticator authenticator;
        if (account.isAuthenticationEnabled()) {
            authenticator = new MyAuthenticator(account.getUsername(), account.getPassword());
        } else {
            authenticator = null;
        }
        LOGGER.trace("imap server configuration:\n{}", mapToLoggableString(properties));
        LOGGER.debug("open imap connection");
        Session session = Session.getInstance(properties.toProperties(), authenticator);
        if (LOGGER.isTraceEnabled()) {
            session.setDebugOut(printStreamFromLogger(LOGGER::trace));
            session.setDebug(true);
        }
        return session;
    }

    public static Session createSmtpSession(EmailAccount account) {
        return createSmtpSession(account, null);
    }

    public static Session createSmtpSession(EmailAccount account, @Nullable Integer smtpTimeoutSeconds) {
        FluentMap<String, String> properties = map(System.getProperties());
        if (isNotNullAndGtZero(smtpTimeoutSeconds)) {
            String timeout = Integer.toString(smtpTimeoutSeconds * 1000);
            properties.put(
                    "mail.smtp.connectiontimeout", timeout,
                    "mail.smtp.timeout", timeout,
                    "mail.smtp.writetimeout", timeout,
                    "mail.smtps.connectiontimeout", timeout,
                    "mail.smtps.timeout", timeout,
                    "mail.smtps.writetimeout", timeout
            );
        }
        properties.put(MAIL_TRANSPORT_PROTOCOL, account.getSmtpSsl() ? "smtps" : "smtp");
        properties.put(MAIL_SMTP_STARTTLS_ENABLE, (account.getSmtpStartTls() ? TRUE : FALSE).toString());
        if (account.getSmtpSsl()) {
            properties.put(MAIL_SMTPS_HOST, account.getSmtpServer());
            if (isNotNullAndGtZero(account.getSmtpPort())) {
                properties.put(MAIL_SMTPS_PORT, account.getSmtpPort().toString());
            }
            properties.put(MAIL_SMTPS_AUTH, Boolean.toString(account.isAuthenticationEnabled()));
            properties.put(MAIL_SMPT_SOCKET_FACTORY_CLASS, JAVAX_NET_SSL_SSL_SOCKET_FACTORY);
            properties.put(MAIL_SMPT_SOCKET_FACTORY_FALLBACK, FALSE.toString());
        } else {
            properties.put(MAIL_SMTP_HOST, account.getSmtpServer());
            if (isNotNullAndGtZero(account.getSmtpPort())) {
                properties.put(MAIL_SMTP_PORT, account.getSmtpPort().toString());
            }
            properties.put(MAIL_SMTP_AUTH, Boolean.toString(account.isAuthenticationEnabled()));
        }
        account.getConfig().forEach(properties::put);
        LOGGER.trace("smtp server configuration:\n{}", mapToLoggableString(properties));
        Authenticator authenticator;
        if (account.isAuthenticationEnabled()) {
            authenticator = new MyAuthenticator(account.getUsername(), account.getPassword());
        } else {
            authenticator = null;
        }
        LOGGER.debug("opening smtp connection for account = {}", account);
        Session session = Session.getInstance(properties.toProperties(), authenticator);
        if (LOGGER.isTraceEnabled()) {
            session.setDebugOut(printStreamFromLogger(LOGGER::trace));
            session.setDebug(true);
        }
        return session;
    }

    private static class MyAuthenticator extends javax.mail.Authenticator {

        private final PasswordAuthentication authentication;

        public MyAuthenticator(String username, String password) {
            authentication = new PasswordAuthentication(username, password);
        }

        @Override
        protected PasswordAuthentication getPasswordAuthentication() {
            return authentication;
        }

    }

    public static String embedEmailInlineAttachmentsAsBase64(String content, List<EmailAttachment> inlineAttachments) {
        if (isNotBlank(content)) {
            for (EmailAttachment attachment : inlineAttachments) {
                if (attachment.hasContentId()) {
                    String pattern = format("src=\"cid:%s\"", attachment.getContentId());
                    if (Pattern.compile(pattern).matcher(content).find()) {
                        if (attachment.getData().length < MAX_EMBEDDED_IMAGE_SIZE) {
                            String replacement = format("src=\"%s\"", StringEscapeUtils.escapeHtml4(toDataUrl(newDataSource(attachment.getData(), attachment.getContentType()))));
                            content = content.replace(pattern, replacement);
                        } else {
                            LOGGER.warn(marker(), "will not embed image = {} in email content: image size too big for embedding", attachment);
                        }
                    }
                }
            }
        }
        return content;
    }

    private static class MessageParser {

        private final Logger logger = LoggerFactory.getLogger(getClass());

        private final Message message;
        private final EmailPartsParser partsParser = new EmailPartsParser();

        public MessageParser(byte[] message) {
            logger.trace("build email parser from raw email data = \n\n{}\n", lazyString(safeSupplier(() -> new String(message, StandardCharsets.US_ASCII))));
            try {
                this.message = new MimeMessage(null, new ByteArrayInputStream(checkNotNull(message)));
            } catch (MessagingException ex) {
                throw new EmailException(ex, "error loading mime message from raw data");
            }
        }

        public MessageParser(Message message) {
            this.message = checkNotNull(message);
        }

        public Consumer<EmailImplBuilder> acquireEmail() {
            return builder -> {
                try {
                    try {
                        builder.accept(parseCommonEmailStuff());
                    } catch (Exception ex) {
                        logger.warn(marker(), "error processing email metadata", ex);
                    }
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    message.writeTo(out);
                    builder
                            .withMultipartContent(out.toByteArray())
                            .withMultipartContentType("message/rfc822")
                            .withStatus(ES_ACQUIRED);
                } catch (Exception ex) {
                    throw new EmailException(ex, "error acquiring email message = %s", getMessageInfoSafe(message));
                }
            };
        }

        public Consumer<EmailImplBuilder> parseEmail() {
            return builder -> {
                try {
                    logger.debug("parse email =< {} >", getMessageInfoSafe(message));
                    loadEmailContentParts();
                    builder.accept(parseCommonEmailStuff())
                            .withStatus(ES_RECEIVED)
                            .withAttachments(partsParser.getAttachments())
                            .accept(partsParser.loadEmailContent());
                } catch (Exception ex) {
                    throw new EmailException(ex, "error parsing email message = %s", getMessageInfoSafe(message));
                }
            };
        }

        private Consumer<EmailImplBuilder> parseCommonEmailStuff() {
            return builder -> {
                try {
                    builder
                            .withSentOrReceivedDate(firstNotNull(toDateTime(message.getReceivedDate()), now()))
                            .withMessageId(parseEmailHeaderToken(getMessageHeader(EMAIL_HEADER_MESSAGE_ID)))
                            .withSubject(message.getSubject())
                            .withFromAddress(parseAddresses(message.getFrom()))
                            .withToAddresses(parseAddresses(message.getRecipients(Message.RecipientType.TO)))
                            .withCcAddresses(parseAddresses(message.getRecipients(Message.RecipientType.CC)))
                            .withBccAddresses(parseAddresses(message.getRecipients(Message.RecipientType.BCC)))
                            .withReplyTo(parseAddresses(message.getReplyTo()))
                            .withInReplyTo(parseEmailHeaderToken(getMessageHeader(EMAIL_HEADER_IN_REPLY_TO)))
                            .withReferences(parseEmailReferencesHeader(getMessageHeader(EMAIL_HEADER_REFERENCES)))
                            .withHeaders(serializeMessageHeaders(message));
                } catch (MessagingException ex) {
                    throw new EmailException(ex, "error parsing email message = %s", getMessageInfoSafe(message));
                }
            };
        }

        private String getMessageHeader(String key) throws MessagingException {
            return EmailMtaUtils.getMessageHeader(message, key);
        }

        private String parseAddresses(@Nullable Address[] list) {
            if (list == null) {
                return "";
            } else {
                return stream(list).map(Address::toString).collect(joining(","));
            }
        }

        private void loadEmailContentParts() throws MessagingException, IOException {
            logger.trace("raw email body = \n\n{}\n", lazyString(safeSupplier(() -> readToString(message.getDataHandler()))));
            partsParser.loadEmailContentParts(message);
        }

    }

    public static Consumer<EmailImplBuilder> loadEmailContent(Part content) {
        try {
            EmailPartsParser partsParser = new EmailPartsParser();
            partsParser.loadEmailContentParts(content);
            return partsParser.loadEmailContent();
        } catch (MessagingException | IOException ex) {
            throw new EmailException(ex, "error processing email content parts");
        }
    }

    public static Consumer<EmailImplBuilder> loadEmailContent(Multipart content) {
        try {
            EmailPartsParser partsParser = new EmailPartsParser();
            partsParser.loadEmailContentParts(content);
            return partsParser.loadEmailContent();
        } catch (MessagingException | IOException ex) {
            throw new EmailException(ex, "error processing email content parts");
        }
    }

    public static Address toAddress(String emailAddress) {
        try {
            return new InternetAddress(emailAddress);
        } catch (AddressException ex) {
            throw new EmailException(ex);
        }
    }

    public static Message emailToMessage(Email email) {
        try {
            Message message = new MimeMessage((Session) null);
            fillMessage(message, email);
            return message;
        } catch (MessagingException | UnsupportedEncodingException ex) {
            throw new EmailException(ex, "error building email message");
        }
    }

    public static String emailToMessageData(Email email) {
        Message message = emailToMessage(email);
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            message.writeTo(out);
            return out.toString(StandardCharsets.US_ASCII);
        } catch (IOException | MessagingException ex) {
            throw new EmailException(ex, "error printing email message");
        }
    }

    public static void fillMessage(Message message, Email email) throws MessagingException, UnsupportedEncodingException {
        message.addFrom(transform(email.getFromRawAddressList(), EmailMtaUtils::toAddress).toArray(new Address[]{}));

        if (isNotBlank(email.getReplyTo())) {
            message.setReplyTo(new Address[]{toAddress(email.getReplyTo())});
        }

        transformValues(CmMapUtils.<RecipientType, List<String>, Object>map(
                Message.RecipientType.TO, email.getToRawAddressList(),
                Message.RecipientType.CC, email.getCcRawAddressList(),
                Message.RecipientType.BCC, email.getBccRawAddressList()),
                (a) -> transform(a, EmailMtaUtils::toAddress)).forEach(rethrowBiConsumer((t, a) -> {
                    message.addRecipients(t, a.toArray(new Address[]{}));
                }));

        message.setSubject(email.getSubject());
        message.setSentDate(toJavaDate(now()));

        String emailContent = nullToEmpty(email.getContent());
        String emailContentType = email.getContentType();
        Multipart contentPart;

        if (isMultipart(emailContentType)) {
            contentPart = new MimeMultipart(newDataSource(emailContent, emailContentType));
            emailContent = null;
        } else {
            contentPart = null;
            if (isBlank(getCharsetFromContentType(emailContentType))) {
                emailContentType = setCharsetInContentType(emailContentType, StandardCharsets.UTF_8.name());
            }
        }

        String inReplyTo = email.getInReplyTo();
        List<String> references = email.getReferences();
        if (isNotBlank(inReplyTo) && (references.isEmpty() || !equal(getLast(references), inReplyTo))) {
            references = list(references).with(inReplyTo);
        }
        if (!references.isEmpty()) {
            message.addHeader(EMAIL_HEADER_REFERENCES, references.stream().map(EmailUtils::formatEmailHeaderToken).collect(joining(" ")));
        }
        if (isNotBlank(inReplyTo)) {
            message.addHeader(EMAIL_HEADER_IN_REPLY_TO, formatEmailHeaderToken(inReplyTo));
        }

        if (!email.hasAttachments()) {
            if (contentPart == null) {
                message.setContent(checkNotNull(emailContent), emailContentType);
            } else {
                message.setContent(contentPart);
            }
        } else {
            Multipart multipart;
            if (contentPart != null && isMultipartMixed(contentPart.getContentType())) {
                multipart = contentPart;
            } else {
                multipart = new MimeMultipart("mixed");
                MimeBodyPart contentBodyPart = new MimeBodyPart();
                if (contentPart == null) {
                    contentBodyPart.setContent(checkNotNull(emailContent), emailContentType);
                } else {
                    contentBodyPart.setContent(contentPart);
                }
                multipart.addBodyPart(contentBodyPart);
            }
            for (EmailAttachment a : email.getAttachments()) {
                BodyPart attachmentPart = new MimeBodyPart();
                attachmentPart.setDataHandler(newDataHandler(a.getData(), a.getContentType(), a.getFileName()));
                attachmentPart.setFileName(a.getFileName());//TODO is this required? test
                multipart.addBodyPart(attachmentPart);
            }
            message.setContent(multipart);
        }
    }
}
