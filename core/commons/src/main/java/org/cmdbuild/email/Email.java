/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email;

import static com.google.common.base.Objects.equal;
import static com.google.common.collect.Iterables.getOnlyElement;
import java.time.ZonedDateTime;
import java.util.List;
import static java.util.stream.Collectors.toList;
import javax.annotation.Nullable;
import javax.mail.internet.InternetAddress;
import static org.apache.commons.lang3.ArrayUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.cmdbuild.email.EmailAddressUtils.parseEmailAddressListAsStrings;
import static org.cmdbuild.email.EmailStatus.ES_ACQUIRED;
import static org.cmdbuild.email.EmailStatus.ES_DRAFT;
import static org.cmdbuild.email.EmailStatus.ES_OUTGOING;
import static org.cmdbuild.email.EmailStatus.ES_SENT;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public interface Email {

    final String EMAIL_CLASS_NAME = "Email", ATTR_EMAIL_SUBJECT = "Subject", EMAIL_ATTR_STATUS = "EmailStatus", EMAIL_ATTR_CARD = "Card";

    @Nullable
    Long getId();

    @Nullable
    String getFromAddress();

    @Nullable
    String getToAddresses();

    @Nullable
    String getCcAddresses();

    @Nullable
    String getBccAddresses();

    String getContentType();

    @Nullable
    String getInReplyTo();

    @Nullable
    String getMessageId();

    @Nullable
    String getReplyTo();

    List<String> getReferences();

    @Nullable
    String getSubject();

    String getContent();

    @Nullable
    String getHeaders();

    @Nullable
    ZonedDateTime getSentOrReceivedDate();

    ZonedDateTime getBeginDate();

    EmailStatus getStatus();

    @Nullable
    Long getReference();

    @Nullable
    Long getAutoReplyTemplate();

    boolean getNoSubjectPrefix();

    @Nullable
    Long getAccount();

    @Nullable
    Long getTemplate();

    boolean getKeepSynchronization();

    boolean getPromptSynchronization();

    @Nullable
    Long getDelay();

    int getErrorCount();

    List<EmailAttachment> getAttachments();

    @Nullable
    byte[] getMultipartContent();

    @Nullable
    String getMultipartContentType();

    default boolean hasMultipartContent() {
        return isNotEmpty(getMultipartContent());
    }

    default boolean hasContent() {
        return isNotBlank(getContent());
    }

    default boolean hasReference() {
        return isNotNullAndGtZero(getReference());
    }

    default ZonedDateTime getDate() {
        return firstNotNull(getSentOrReceivedDate(), getBeginDate());
    }

    default List<String> getFromRawAddressList() {
        return parseEmailAddressListAsStrings(getFromAddress());
    }

    default List<String> getFromEmailAddressList() {
        return getFromRawAddressList().stream().map(EmailAddressUtils::parseEmailAddress).map(InternetAddress::getAddress).distinct().collect(toList());
    }

    default boolean hasFromAddress(String address) {
        return getFromEmailAddressList().stream().anyMatch(a -> a.equalsIgnoreCase(address));
    }

    default boolean hasToAddress(String address) {
        return getToEmailAddressList().stream().anyMatch(a -> a.equalsIgnoreCase(address));
    }

    default List<String> getToRawAddressList() {
        return parseEmailAddressListAsStrings(getToAddresses());
    }

    default List<String> getToEmailAddressList() {
        return getToRawAddressList().stream().map(EmailAddressUtils::parseEmailAddress).map(InternetAddress::getAddress).distinct().collect(toList());
    }

    default List<String> getCcRawAddressList() {
        return parseEmailAddressListAsStrings(getCcAddresses());
    }

    default List<String> getCcEmailAddressList() {
        return getCcRawAddressList().stream().map(EmailAddressUtils::parseEmailAddress).map(InternetAddress::getAddress).distinct().collect(toList());
    }

    default List<String> getBccRawAddressList() {
        return parseEmailAddressListAsStrings(getBccAddresses());
    }

    default List<String> getBccEmailAddressList() {
        return getBccRawAddressList().stream().map(EmailAddressUtils::parseEmailAddress).map(InternetAddress::getAddress).distinct().collect(toList());
    }

    default boolean hasAttachments() {
        return !getAttachments().isEmpty();
    }

    default boolean hasTemplate() {
        return isNotNullAndGtZero(getTemplate());
    }

    default boolean hasAccount() {
        return isNotNullAndGtZero(getAccount());
    }

    default boolean isDraft() {
        return equal(ES_DRAFT, getStatus());
    }

    default boolean isOutgoing() {
        return equal(ES_OUTGOING, getStatus());
    }

    default boolean isSent() {
        return equal(ES_SENT, getStatus());
    }

    default boolean isAcquired() {
        return equal(ES_ACQUIRED, getStatus());
    }

    default String getContentPlaintext() {
        return EmailContentUtils.getContentPlaintext(this);
    }

    default String getContentHtmlOrWrappedPlaintext() {
        return EmailContentUtils.getContentHtml(this);
    }

    default String getContentHtmlOrRawPlaintext() {
        return EmailContentUtils.getContentHtmlOrRawPlaintext(this);
    }

    default String getContentHtml() {
        return getContentHtmlOrWrappedPlaintext();
    }

    @Nullable
    default String getFirstFromAddressOrNull() {
        return getFromEmailAddressList().stream().findFirst().orElse(null);
    }

    default String getSingleFromAddress() {
        return checkNotBlank(getOnlyElement(getFromEmailAddressList()));
    }

    default boolean hasDestinationAddress() {
        return !getToEmailAddressList().isEmpty() || !getCcEmailAddressList().isEmpty() || !getBccEmailAddressList().isEmpty();
    }

    default EmailAttachment getAttachmentByFileName(String fileName) {
        checkNotBlank(fileName);
        return getAttachments().stream().filter(a -> equal(a.getFileName(), fileName)).collect(onlyElement("attachment not found for file name =< %s >", fileName));
    }

    default boolean hasAnyDestinationAddress() {
        return !getToEmailAddressList().isEmpty() || !getCcEmailAddressList().isEmpty() || !getBccEmailAddressList().isEmpty();
    }

    default boolean hasAnyContent() {
        return hasContent() || hasMultipartContent();
    }

    default boolean hasId() {
        return isNotNullAndGtZero(getId());
    }

}
