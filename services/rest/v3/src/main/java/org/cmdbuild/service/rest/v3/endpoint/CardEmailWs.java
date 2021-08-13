package org.cmdbuild.service.rest.v3.endpoint;

import org.cmdbuild.service.rest.v3.model.WsEmailData;
import com.fasterxml.jackson.annotation.JsonProperty;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Iterables.getOnlyElement;
import java.util.Collection;
import static java.util.Collections.emptyList;
import java.util.List;
import javax.annotation.Nullable;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.SYSTEM_ACCESS_AUTHORITY;
import static org.cmdbuild.common.utils.PagedElements.paged;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.CardImpl;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;

import org.cmdbuild.email.Email;
import org.cmdbuild.email.EmailAttachment;
import org.cmdbuild.email.EmailService;
import static org.cmdbuild.email.EmailStatus.ES_DRAFT;
import org.cmdbuild.email.beans.EmailImpl;
import static org.cmdbuild.email.utils.EmailMtaUtils.acquireEmail;
import static org.cmdbuild.email.utils.EmailUtils.serializeEmailStatus;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.CARD_ID;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.CLASS_ID;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.EMAIL_ID;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.cmdbuild.email.utils.EmailMtaUtils.parseEmail;
import org.cmdbuild.service.rest.common.beans.WsQueryOptions;
import org.cmdbuild.service.rest.common.helpers.AttachmentWsHelper;
import static org.cmdbuild.utils.encode.CmPackUtils.unpackBytes;
import org.cmdbuild.service.rest.v3.serializationhelpers.EmailWsHelper;
import static org.cmdbuild.utils.lang.CmConvertUtils.toInt;

@Path("{a:classes|processes}/{" + CLASS_ID + "}/{b:cards|instances}/{" + CARD_ID + "}/emails")
@Produces(APPLICATION_JSON)
public class CardEmailWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DaoService dao;
    private final EmailService emailService;
    private final EmailWsHelper helper;
    private final AttachmentWsHelper attachmentHelper;

    public CardEmailWs(DaoService dao, EmailService emailService, EmailWsHelper emailSerialization, AttachmentWsHelper attachmentHelper) {
        this.dao = checkNotNull(dao);
        this.emailService = checkNotNull(emailService);
        this.helper = checkNotNull(emailSerialization);
        this.attachmentHelper = checkNotNull(attachmentHelper);
    }

    @GET
    @Path(EMPTY)
    public Object readAll(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, WsQueryOptions wsQueryOptions) {
        DaoQueryOptions queryOptions = wsQueryOptions.getQuery();
        Card card = dao.getCard(classId, cardId);
        Collection<Email> list = emailService.getAllForCard(card.getId(), queryOptions);
        return response(paged(list, wsQueryOptions.isDetailed() ? CardEmailWs::serializeDetailedEmail : CardEmailWs::serializeBasicEmail, toInt(wsQueryOptions.getOffset()), toInt(wsQueryOptions.getLimit())));
    }

    @GET
    @Path("{" + EMAIL_ID + "}/")
    public Object read(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, @PathParam(EMAIL_ID) Long emailId) {
        dao.getCard(classId, cardId); //TODO check user permissions
        Email email = emailService.getOne(emailId);
        return response(serializeDetailedEmail(email));//TODO check email id
    }

    @POST
    @Path(EMPTY)
    public Object create(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) String cardId, @QueryParam("apply_template") @DefaultValue(FALSE) Boolean applyTemplate, @QueryParam("template_only") @DefaultValue(FALSE) Boolean templateOnly, @QueryParam("attachments") List<String> tempId, List<Attachment> parts) {
        List<Attachment> attachments = parts.size() == 1 ? emptyList() : parts.stream().filter(a -> !equal(a.getDataHandler().getName(), "email")).collect(toImmutableList());
        Attachment body = parts.size() == 1 ? getOnlyElement(parts) : parts.stream().filter(a -> equal(a.getDataHandler().getName(), "email")).collect(onlyElement("missing 'email' multipart json payload"));
        List<EmailAttachment> emailAttachments = attachmentHelper.convertAttachmentsToEmailAttachments(attachments, tempId);
        WsEmailData emailData = fromJson(readToString(body.getDataHandler()), WsEmailData.class);
        return response(helper.createEmail(classId, cardId, emailData, applyTemplate, templateOnly, emailAttachments));
    }

    @POST
    @Path("load")
    @RolesAllowed(SYSTEM_ACCESS_AUTHORITY)
    public Object load(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, WsEmailLoadData data) {
        Email email = emailService.create(EmailImpl.copyOf(parseEmail(data.data)).withReference(cardId).build());
        logger.info("loaded email = {}", email);
        return response(serializeDetailedEmail(email));
    }

    @POST
    @Path("acquire")
    @RolesAllowed(SYSTEM_ACCESS_AUTHORITY)
    public Object acquire(WsEmailLoadData data) {
        Email email = emailService.create(acquireEmail(unpackBytes(data.data)));
        logger.info("acquired email = {}", email);
        return response(serializeDetailedEmail(email));
    }

    @PUT
    @Path("{" + EMAIL_ID + "}/")
    public Object update(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, @PathParam(EMAIL_ID) Long emailId, WsEmailData emailData, @QueryParam("apply_template") @DefaultValue(FALSE) Boolean applyTemplate, @QueryParam("template_only") @DefaultValue(FALSE) Boolean templateOnly) {
        Card card = dao.getCard(classId, cardId); //TODO check user permissions
        Email current = emailService.getOne(emailId);
        checkArgument(equal(ES_DRAFT, current.getStatus()), "cannot update email with status = %s", current.getStatus());
        Email email = emailData.toEmail().withReference(card.getId()).withId(emailId).build();
        applyTemplate = applyTemplate || templateOnly;
        Boolean expr;
        if (applyTemplate && emailData.hasExpr()) {
            applyTemplate = expr = handleTemplateExpr(email.getTemplate(), emailData, card);
        } else {
            expr = null;
        }
        email = helper.handleTemplate(email, emailData, card, applyTemplate);
        if (!templateOnly) {
            email = emailService.update(email);
        }
        return response(serializeDetailedEmail(email, expr));
    }

    @DELETE
    @Path("{" + EMAIL_ID + "}/")
    public Object delete(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, @PathParam(EMAIL_ID) Long emailId) {
        Card card = dao.getCard(classId, cardId); //TODO check user permissions
        emailService.delete(emailService.getOne(emailId));//TODO check email id
        return success();
    }

    private boolean handleTemplateExpr(long template, WsEmailData emailData, Card card) {
        if (emailData.hasCardData()) {
            card = CardImpl.copyOf(card).withAttributes(emailData.getCardData().getValues()).build();
        }
        return toBooleanOrDefault(emailService.applyTemplateExpr(template, card, emailData.getExpr()), false);
    }

    public static FluentMap<String, Object> serializeBasicEmail(Email email) {
        return map(
                "_id", email.getId(),
                "from", email.getFromAddress(),
                "replyTo", email.getReplyTo(),
                "to", email.getToAddresses(),
                "cc", email.getCcAddresses(),
                "bcc", email.getBccAddresses(),
                "subject", email.getSubject(),
                "body", email.getContent(),
                "contentType", email.getContentType(),
                "_content_plain", email.getContentPlaintext(),
                "date", toIsoDateTime(email.getDate()),
                "status", serializeEmailStatus(email.getStatus())
        );
    }

    public static FluentMap<String, Object> serializeDetailedEmail(Email email) {
        return serializeDetailedEmail(email, null);
    }

    public static FluentMap<String, Object> serializeDetailedEmail(Email email, @Nullable Boolean expr) {
        return serializeBasicEmail(email).with(
                "account", email.getAccount(),
                "delay", email.getDelay(),
                "template", email.getTemplate(),
                "autoReplyTemplate", email.getAutoReplyTemplate(),
                "keepSynchronization", email.getKeepSynchronization(),
                "noSubjectPrefix", email.getNoSubjectPrefix(),
                "promptSynchronization", email.getPromptSynchronization(),
                "_content_html", email.getContentHtmlOrWrappedPlaintext(),
                "card", email.getReference()
        ).skipNullValues().with("_expr", expr);
    }

    public static class WsEmailLoadData {

        private final String data;

        public WsEmailLoadData(@JsonProperty("data") String data) {
            this.data = checkNotBlank(data);
        }

    }

}
