package org.cmdbuild.email;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.Iterables.getLast;
import com.google.common.collect.Ordering;
import com.google.common.eventbus.EventBus;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;

public interface EmailService {

    Email create(Email email);

    List<Email> getAllForCard(long reference, DaoQueryOptions queryOptions);

    @Nullable
    Email getOneOrNull(long emailId);

    Email update(Email email);

    void delete(Email email);

    Email applyTemplate(Email email, Card clientCard, Card serverCard);

    String applyTemplateExpr(Long templateId, Card cardData, String expr);

    Email applySysTemplate(Email email, String sysTemplateId);

    EventBus getEventBus();

    List<Email> getAllForOutgoingProcessing();

    List<EmailAttachment> getEmailAttachments(long emailId);

    Email loadAttachments(Email email);

    List<Email> getByMessageId(String messageId);

    List<Email> getAllForTemplate(long templateId);

    @Nullable
    Email getLastWithReferenceBySenderAndSubjectFuzzyMatchingOrNull(String from, String subject);

    Email getLastReceivedEmail();

    Email applyTemplate(Email email, EmailTemplate template, Map<String, Object> data);

    Email applyTemplate(Email email);

    default List<Email> getAllForCard(long reference) {
        return getAllForCard(reference, DaoQueryOptionsImpl.builder().build());
    }

    default Email applyTemplate(Email email, Card cardData) {
        return applyTemplate(email, cardData, cardData);
    }

    default Email getOne(long emailId) {
        return checkNotNull(getOneOrNull(emailId), "email not found for id = %s", emailId);
    }

    default Email getLastForOutgoingProcessing() {
        return getLast(getAllForOutgoingProcessing());
    }

    @Nullable
    default Email getLastWithReferenceByMessageIdOrNull(String messageId) {
        return getByMessageId(messageId).stream().filter(Email::hasReference).sorted(Ordering.natural().onResultOf(Email::getDate).reversed()).findFirst().orElse(null);
    }

    @Nullable
    default Email getLastByMessageIdOrNull(String messageId) {
        return getByMessageId(messageId).stream().sorted(Ordering.natural().onResultOf(Email::getDate).reversed()).findFirst().orElse(null);
    }

    enum NewOutgoingEmailEvent {
        INSTANCE
    }
}
