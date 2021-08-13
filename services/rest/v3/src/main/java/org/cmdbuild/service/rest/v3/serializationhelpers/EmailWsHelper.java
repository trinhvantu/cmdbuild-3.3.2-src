/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.service.rest.v3.serializationhelpers;

import org.cmdbuild.service.rest.v3.model.WsEmailData;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.CardImpl;
import org.cmdbuild.dao.core.q3.DaoService;

import org.cmdbuild.email.Email;
import org.cmdbuild.email.EmailAccountService;
import org.cmdbuild.email.EmailAttachment;
import org.cmdbuild.email.EmailService;
import org.cmdbuild.email.EmailTemplateService;
import org.cmdbuild.email.beans.EmailImpl;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;
import static org.cmdbuild.service.rest.v3.endpoint.CardEmailWs.serializeDetailedEmail;
import org.springframework.stereotype.Component;

@Component
public class EmailWsHelper {

    private final DaoService dao;
    private final EmailService emailService;
    private final EmailTemplateService templateService;
    private final EmailAccountService accountService;

    public EmailWsHelper(DaoService dao, EmailService emailService, EmailTemplateService templateService, EmailAccountService accountService) {
        this.dao = checkNotNull(dao);
        this.emailService = checkNotNull(emailService);
        this.templateService = checkNotNull(templateService);
        this.accountService = checkNotNull(accountService);
    }

    public Object createEmail(String classId, String cardId, WsEmailData emailData, boolean applyTemplate, boolean templateOnly, List<EmailAttachment> emailAttachments) {
        Card card;
        if (equal(classId, "_ANY") && equal(cardId, "_ANY")) {
            card = null;
        } else {
            card = dao.getCard(classId, toLong(cardId)); //TODO check user permissions
        }
        Email email = emailData.toEmail().withReference(card == null ? null : card.getId()).build();
        applyTemplate = applyTemplate || templateOnly;
        Boolean expr;
        if (applyTemplate && emailData.hasExpr()) {
            applyTemplate = expr = handleTemplateExpr(email.getTemplate(), emailData, card);
        } else {
            expr = null;
        }
        email = handleTemplate(email, emailData, card, applyTemplate);
        if (!templateOnly) {
            email = EmailImpl.copyOf(email).addAttachments(emailAttachments).build();
            email = emailService.create(email);
        }
        return serializeDetailedEmail(email, expr);
    }

    public Email handleTemplate(Email email, WsEmailData emailData, @Nullable Card serverCard, Boolean applyTemplate) {
        if (!email.hasTemplate() && isNotBlank(emailData.getTemplate()) && !templateService.isSysTemplate(emailData.getTemplate())) {
            email = EmailImpl.copyOf(email).withTemplate(templateService.getByNameOrId(emailData.getTemplate()).getId()).build();
        }
        if (!email.hasAccount() && isNotBlank(emailData.getAccount())) {
            email = EmailImpl.copyOf(email).withAccount(accountService.getAccountByIdOrCode(emailData.getAccount()).getId()).build();
        }
        if (applyTemplate) {
            if (!email.hasTemplate()) {
                return emailService.applySysTemplate(email, emailData.getTemplate());
            } else {
                if (emailData.hasCardData()) {
                    Card clientCard = CardImpl.copyOf(serverCard).withAttributes(emailData.getCardData().getValues()).build();
                    return emailService.applyTemplate(email, clientCard, serverCard);
                } else if (serverCard != null) {
                    return emailService.applyTemplate(email, serverCard);
                } else {
                    return emailService.applyTemplate(email);
                }
            }
        } else {
            return email;
        }
    }

    public boolean handleTemplateExpr(long template, WsEmailData emailData, Card card) {
        if (emailData.hasCardData()) {
            card = CardImpl.copyOf(card).withAttributes(emailData.getCardData().getValues()).build();
        }
        return toBooleanOrDefault(emailService.applyTemplateExpr(template, card, emailData.getExpr()), false);
    }

}
