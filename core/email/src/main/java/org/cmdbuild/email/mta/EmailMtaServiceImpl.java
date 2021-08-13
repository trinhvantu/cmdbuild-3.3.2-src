package org.cmdbuild.email.mta;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import java.io.UnsupportedEncodingException;
import static java.lang.String.format;
import java.util.Collections;
import java.util.List;
import static java.util.stream.Collectors.joining;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.cluster.NodeIdProvider;
import org.cmdbuild.config.CoreConfiguration;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.config.EmailQueueConfiguration;
import org.cmdbuild.debuginfo.BuildInfoService;
import org.cmdbuild.debuginfo.InstanceInfoService;
import org.cmdbuild.email.Email;
import org.cmdbuild.email.EmailAccount;
import org.cmdbuild.email.EmailAccountService;
import org.cmdbuild.email.EmailException;
import static org.cmdbuild.email.EmailStatus.ES_SENT;
import org.cmdbuild.email.beans.EmailImpl;
import org.cmdbuild.email.data.EmailRepository;
import static org.cmdbuild.email.mta.EmailProcessedAction.EPA_DEFAULT;
import static org.cmdbuild.email.mta.EmailProcessedAction.EPA_DELETE;
import static org.cmdbuild.email.mta.EmailProcessedAction.EPA_DO_NOTHING;
import static org.cmdbuild.email.mta.EmailProcessedAction.EPA_MOVE_TO_PROCESSED;
import static org.cmdbuild.email.mta.EmailProcessedAction.EPA_MOVE_TO_REJECTED;
import org.cmdbuild.email.utils.EmailMtaUtils;
import static org.cmdbuild.email.utils.EmailMtaUtils.emailAcquirer;
import static org.cmdbuild.email.utils.EmailMtaUtils.emailParser;
import static org.cmdbuild.email.utils.EmailMtaUtils.fillMessage;
import static org.cmdbuild.email.utils.EmailMtaUtils.getMessageHeader;
import static org.cmdbuild.email.utils.EmailMtaUtils.getMessageInfoSafe;
import static org.cmdbuild.email.utils.EmailMtaUtils.serializeMessageHeaders;
import static org.cmdbuild.email.utils.EmailUtils.parseEmailHeaderToken;
import org.cmdbuild.lock.LockService;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.utils.lang.CmExceptionUtils.lazyString;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowSupplier;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;

@Component
public class EmailMtaServiceImpl implements EmailMtaService {

    public static final String EMAIL_HEADER_MESSAGE_ID = "Message-ID",
            EMAIL_HEADER_REFERENCES = "References",
            EMAIL_HEADER_X_MAILER = "X-Mailer",
            EMAIL_HEADER_IN_REPLY_TO = "In-Reply-To";

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EmailAccountService emailAccountService;
    private final LockService lockService;
    private final EmailQueueConfiguration queueConfig;
    private final EmailRepository repository;
    private final InstanceInfoService infoService;

    public EmailMtaServiceImpl(EmailAccountService emailAccountService, LockService lockService, EmailQueueConfiguration queueConfig, EmailRepository repository, InstanceInfoService infoService) {
        this.emailAccountService = checkNotNull(emailAccountService);
        this.lockService = checkNotNull(lockService);
        this.queueConfig = checkNotNull(queueConfig);
        this.repository = checkNotNull(repository);
        this.infoService = checkNotNull(infoService);
    }

    @Override
    public Email send(Email email) {
        try {
            EmailAccount account;
            if (email.getAccount() == null) {
                account = checkNotNull(emailAccountService.getDefaultOrNull(), "no account supplied for email, and no default account found");
            } else {
                account = emailAccountService.getAccount(email.getAccount());
            }
            return new EmailSender(account).sendEmail(email);
        } catch (Exception ex) {
            throw new EmailException(ex);
        }
    }

    @Override
    public void receive(EmailReceiveConfig config) {
        EmailAccount account = emailAccountService.getAccount(checkNotBlank(config.getAccount(), "missing account param"));
        receive(account, config);
    }

    @Override
    public void receive(EmailAccount account, EmailReceiveConfig config) {
        try {
            new EmailReader(account).receiveMails(config);
        } catch (Exception ex) {
            throw new EmailException(ex, "error receiving email for account = %s with folder = %s", account, config.getIncomingFolder());
        }
    }

    private void store(EmailAccount account, Email email, String storeToFolder) {
        try {
            new EmailReader(account).storeEmail(email, storeToFolder);
        } catch (Exception ex) {
            throw new EmailException(ex, "error storing email = %s to account = %s folder = %s", email, account, storeToFolder);
        }
    }

    private class EmailReader extends EmailHelper {

        private Store store;

        public EmailReader(EmailAccount account) {
            super(account);
        }

        public void receiveMails(EmailReceiveConfig config) throws MessagingException {
            new EmailReceiver(config).receiveMails();
        }

        private class EmailReceiver {

            private final EmailReceiveConfig config;
//            private final List<Pair<Email, EmailProcessedAction>> failedActions = list();

            public EmailReceiver(EmailReceiveConfig config) {
                this.config = checkNotNull(config);
            }

            public void receiveMails() throws MessagingException {
                aquireLock();
                try {
                    createSession();
                    try {
                        String incomingFolder = config.getIncomingFolder();
                        logger.debug("open incoming folder = {}", incomingFolder);
                        try (Folder folder = store.getFolder(checkNotBlank(incomingFolder))) {
                            checkArgument(folder.exists(), "incoming folder not found for name = %s; available folders = %s", incomingFolder, lazyString(rethrowSupplier(() -> list(store.getDefaultFolder().list()).stream().map(Folder::getName).collect(joining(", ")))));
                            folder.open(Folder.READ_WRITE);
                            List<Message> messages = list(folder.getMessages());
                            if (messages.isEmpty()) {
                                logger.debug("no message received for account = {} folder = {}", account, folder);
                            } else {
                                logger.debug("processing {} incoming messages for account = {} folder = {}", messages.size(), account, folder);
                                Collections.shuffle(messages);//process messages in random order to avoid a single problematic message to block all the others
                                messages.forEach(this::processMessageSafe);
                                logger.info("processed {} incoming messages for account = {} folder = {}", messages.size(), account, folder);
                            }
                        }
//                        finally {
//                            if (!failedActions.isEmpty()) {
//                                logger.warn("retry failed actions");
//                                list(failedActions).forEach(safe(rethrowConsumer(p -> {
//                                    try (Folder folder = store.getFolder(checkNotBlank(incomingFolder))) {
//                                        folder.open(Folder.READ_WRITE);
//                                        list(folder.getMessages()).stream().filter(m -> equal(getMessageId(m), p.getLeft().getMessageId())).forEach(rethrowConsumer(message -> {
//                                            logger.info("retry action = {} on message = {}", p.getRight(), p.getLeft());
//                                            try {
//                                                postProcessAction(p.getRight(), p.getLeft(), message);
//                                            } catch (Exception ex) {
//                                                logger.error(marker(), "failed to retry action = {} to message = {}, this may lead to inconsistency or double processing of email", p.getRight(), p.getLeft(), ex);
//                                            }
//                                        }));
//                                    }
//                                })));
//                            }
//                        }
                    } finally {
                        closeSession();
                    }
                } finally {
                    releaseLock();
                }
            }

            private void processMessageSafe(Message message) {
                Email email = null;
                try {
//                    logger.debug("download message = {}", getMessageInfoSafe(message));//TODO prefetch message info attrs (??)
//                    BigByteArray data = toBigByteArray(message.getDataHandler());
//                    logger.debug("acquired message data = {}", byteCountToDisplaySize(data.length()));
//                    Message offlineMessage = new MimeMessage(session, data.toInputStream());
//                    Message offlineMessage =message;
                    logger.debug("preprocess message = {}", message);
                    email = EmailImpl.builder().accept(emailAcquirer(message)).withAccount(account.getId()).build();
                    logger.debug("store raw email = {}", email);
                    email = repository.create(email);
                    logger.debug("processing email = {}", email);
                    email = EmailImpl.copyOf(email).accept(emailParser(message)).build();
                    EmailProcessedAction action = checkNotNull(config.getCallback().apply(email));
                    postProcessActionSafe(action, email, message);
                } catch (Exception ex) {
                    logger.warn(marker(), "error processing message = {} email = {}", getMessageInfoSafe(message), email, ex);
                    if (config.hasRejectedFolder()) {
                        postProcessActionSafe(EPA_MOVE_TO_REJECTED, email, message);
                    }
                }
            }

            private void postProcessActionSafe(EmailProcessedAction action, Email email, Message message) {
                try {
                    postProcessAction(action, email, message);
                } catch (Exception ex) {
                    logger.warn("failed to apply action = {} to message = {}, will retry later", action, email, ex);
                }
            }

            private void postProcessAction(EmailProcessedAction action, Email email, Message message) throws Exception {
                logger.debug("execute post process action = {} with default action = {} for email = {}", serializeEnum(action), serializeEnum(config.getReceivedEmailAction()), email);
                switch (action) {
                    case EPA_DEFAULT:
                        switch (config.getReceivedEmailAction()) {
                            case ERA_DELETE:
                                postProcessAction(EPA_DELETE, email, message);
                                break;
                            case ERA_MOVE_TO_RECEIVED:
                                postProcessAction(EPA_MOVE_TO_PROCESSED, email, message);
                                break;
                            case ERA_DO_NOTHING:
                            default:
                                postProcessAction(EPA_DO_NOTHING, email, message);
                        }
                        break;
                    case EPA_DELETE:
                        logger.debug("delete message = {}", getMessageInfoSafe(message));
//                        try {
                        message.setFlag(Flags.Flag.DELETED, true);
                        message.getFolder().expunge();
//                        } catch (Exception ex) {
//                            failedActions.add(Pair.of(email, action));
//                            throw ex;
//                        }
                        break;
                    case EPA_DO_NOTHING:
                        logger.debug("leave message = {} (note: may be processed again)", getMessageInfoSafe(message));
                        break;
                    case EPA_MOVE_TO_PROCESSED:
//                        failedActions.add(Pair.of(email, action));
                        moveToFolder(message, checkNotBlank(config.getReceivedFolder()));
                        break;
                    case EPA_MOVE_TO_REJECTED:
//                        failedActions.add(Pair.of(email, action));
                        moveToFolder(message, checkNotBlank(config.getRejectedFolder()));
                        break;
                    default:
                        throw new IllegalArgumentException("unsupported epa action = " + action);
                }
            }

        }

        public void storeEmail(Email email, String storeToFolder) throws Exception {
            createSession();
            try {
                Message message = buildMessage(email);
                logger.debug("open folder = {}", storeToFolder);
                try (Folder folder = store.getFolder(checkNotBlank(storeToFolder))) {
                    if (!folder.exists()) {
                        folder.create(Folder.HOLDS_MESSAGES);
                    }
                    folder.open(Folder.READ_WRITE);
                    folder.appendMessages(new Message[]{message});
                    message.setFlag(Flags.Flag.RECENT, true);
                }
            } finally {
                closeSession();
            }
        }

        private void moveToFolder(Message message, String targetFolderName) throws MessagingException {
            checkNotBlank(targetFolderName);
            try {
                logger.debug("moving message = {} from folder = {} to folder = {}", getMessageInfoSafe(message), message.getFolder(), targetFolderName);
                Folder source = checkNotNull(message.getFolder());
                try (Folder target = store.getFolder(targetFolderName)) {
                    if (!target.exists()) {
                        target.create(Folder.HOLDS_MESSAGES);
                    }
                    target.open(Folder.READ_WRITE);
                    source.copyMessages(new Message[]{message}, target);
                    source.setFlags(new Message[]{message}, new Flags(Flags.Flag.DELETED), true);
                    source.expunge();
                }
            } catch (Exception ex) {
                throw new EmailException(ex, "error moving message = %s from folder = %s to folder = %s", getMessageInfoSafe(message), message.getFolder(), targetFolderName);
            }
        }

        private void createSession() {
            try {
                session = EmailMtaUtils.createImapSession(account);
                store = session.getStore();
                store.connect();
            } catch (MessagingException ex) {
                throw new EmailException(ex, "error creating imap session for account = %s", account);
            }
        }

        private void closeSession() {
            if (store != null) {
                logger.debug("close imap connection");
                try {
                    if (store.isConnected()) {
                        store.close();
                    }
                } catch (Exception ex) {
                    logger.warn("error closing receiver mta session", ex);
                }
                store = null;
            }
            session = null;
        }

    }

    private class EmailSender extends EmailHelper {

        private Transport transport;

        public EmailSender(EmailAccount emailAccount) {
            super(emailAccount);
        }

        public Email sendEmail(Email email) throws Exception {
            checkArgument(email.hasDestinationAddress(), "invalid email: no destination address found (TO, CC or BCC)");
            email = prepareEmail(email);
            createSession();
            try {
                logger.debug("send email = {}", email);
                Message message = buildMessage(email);
                logger.debug("send message = {}", getMessageInfoSafe(message));
                transport.sendMessage(message, message.getAllRecipients());
                String messageId = checkNotBlank(parseEmailHeaderToken(getMessageHeader(message, EMAIL_HEADER_MESSAGE_ID)), "error: message sent, but message id header is null");
                String rawHeaders = serializeMessageHeaders(message);
                logger.debug("sent message, id = {}", messageId);
                email = EmailImpl.copyOf(email)
                        .withSentOrReceivedDate(firstNotNull(toDateTime(message.getSentDate()), now()))
                        .withStatus(ES_SENT)
                        .withMessageId(messageId)
                        .withHeaders(rawHeaders)
                        .build();
                if (isNotBlank(account.getSentEmailFolder())) {
                    try {
                        store(account, email, account.getSentEmailFolder());
                    } catch (Exception ex) {
                        logger.warn(marker(), "error while storing sent email to imap folder =< %s > for email = %s", account.getSentEmailFolder(), email, ex);
                    }
                }
                return email;
            } finally {
                closeSession();
            }
        }

        private Email prepareEmail(Email email) {
            if (email.getFromRawAddressList().isEmpty()) {
                email = EmailImpl.copyOf(email).withFromAddress(account.getAddress()).build();
            }
            return email;
        }

        private void createSession() throws MessagingException {
            session = EmailMtaUtils.createSmtpSession(account, queueConfig.getSmtpTimeoutSeconds());
            transport = session.getTransport();
            transport.connect();
        }

        private void closeSession() {
            if (transport != null) {
                logger.debug("closing smtp connection for account = {}", account);
                try {
                    if (transport.isConnected()) {
                        transport.close();
                    }
                } catch (Exception ex) {
                    logger.warn("error closing sender mta session", ex);
                }
                transport = null;
            }
            session = null;
        }

    }

    private class EmailHelper {

        protected final EmailAccount account;
        protected Session session;

        public EmailHelper(EmailAccount emailAccount) {
            this.account = checkNotNull(emailAccount);
        }

        protected void aquireLock() {
            lockService.aquireLockOrWait(getEmailAccountLockId()).getLock();
        }

        protected void releaseLock() {
            lockService.releaseLock(getEmailAccountLockId());
        }

        protected String getEmailAccountLockId() {
            return format("email_account_%s", account.getAddress());
        }

        protected Message buildMessage(Email email) throws MessagingException, UnsupportedEncodingException {
            Message message = new MimeMessage(session);
            fillMessage(message, email);
            message.addHeader(EMAIL_HEADER_X_MAILER, format("CMDBuild v%s", infoService.getVersion()));
            message.addHeader("X-CMDBuild-Version", infoService.getVersion());
            message.addHeader("X-CMDBuild-Revision", infoService.getRevision());
            message.addHeader("X-CMDBuild-InstanceInfo", infoService.getInstanceInfo());
            if (email.hasId()) {
                message.addHeader("X-CMDBuild-EmailId", toStringNotBlank(email.getId()));
            }
            return message;
        }

    }

}
