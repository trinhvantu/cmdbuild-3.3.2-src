package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import javax.annotation.Nullable;
import javax.ws.rs.Consumes;
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
import static org.cmdbuild.common.utils.PagedElements.paged;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.email.EmailAccount;
import org.cmdbuild.email.EmailAccountService;
import org.cmdbuild.email.beans.EmailAccountImpl;
import org.cmdbuild.email.beans.EmailAccountImpl.EmailAccountImplBuilder;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.DETAILED;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.LIMIT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.START;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.HeaderParam;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_EMAIL_MODIFY_AUTHORITY;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_EMAIL_VIEW_AUTHORITY;
import static org.cmdbuild.email.utils.EmailMtaUtils.testImapConnection;
import static org.cmdbuild.email.utils.EmailMtaUtils.testSmtpConnection;
import static org.cmdbuild.service.rest.common.utils.WsRequestUtils.isSystemViewMode;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.VIEW_MODE_HEADER_PARAM;
import static org.cmdbuild.utils.crypto.PasswordBulletsUtils.handleBullets;
import static org.cmdbuild.utils.crypto.PasswordBulletsUtils.stringToBullets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("email/accounts/")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@RolesAllowed(ADMIN_EMAIL_VIEW_AUTHORITY)
public class EmailAccountWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EmailAccountService service;

    public EmailAccountWs(EmailAccountService service) {
        this.service = checkNotNull(service);
    }

    @GET
    @Path(EMPTY)
    public Object readAll(@QueryParam(LIMIT) Long limit, @QueryParam(START) Long offset, @QueryParam(DETAILED) @DefaultValue(FALSE) Boolean detailed) {
        List<EmailAccount> list = service.getAll();
        return response(paged(list, detailed ? this::serializeDetailedAccount : this::serializeBasicAccount, offset, limit));
    }

    @GET
    @Path("{accountId}/")
    public Object read(@HeaderParam(VIEW_MODE_HEADER_PARAM) String viewMode, @PathParam("accountId") String idOrCode) {
        EmailAccount account = service.getAccountByIdOrCode(idOrCode);
        return response(serializeDetailedAccount(account).accept(m -> {
            if (isSystemViewMode(viewMode)) {
                m.put("password", account.getPassword());
            }
        }));
    }

    @POST
    @Path(EMPTY)
    @RolesAllowed(ADMIN_EMAIL_MODIFY_AUTHORITY)
    public Object create(WsEmailAccountData data) {
        EmailAccount account = service.create(data.toEmailAccount().build());
        return response(serializeDetailedAccount(account));
    }

    @PUT
    @Path("{accountId}/")
    @RolesAllowed(ADMIN_EMAIL_MODIFY_AUTHORITY)
    public Object update(@PathParam("accountId") Long id, WsEmailAccountData data) {
        EmailAccount account = service.update(data.toEmailAccount().withId(id).build());
        return response(serializeDetailedAccount(account));
    }

    @DELETE
    @Path("{accountId}/")
    @RolesAllowed(ADMIN_EMAIL_MODIFY_AUTHORITY)
    public Object delete(@PathParam("accountId") Long id) {
        service.delete(id);
        return success();
    }

    @POST
    @Path("_NEW/test")
    public Object testAccountConfig(WsEmailAccountData data) {
        return testAccount(data.toEmailAccount().build());
    }

    @POST
    @Path("{accountId}/test")
    public Object testExistingAccount(@PathParam("accountId") String idOrCode, @Nullable WsEmailAccountData data) {
        EmailAccount account = service.getAccountByIdOrCode(idOrCode);
        if (data != null) {
            account = data.toEmailAccount().withPassword(handleBullets(data.password, account::getPassword)).build();
        }
        return testAccount(account);
    }

    private Object testAccount(EmailAccount account) {
        return response(map().accept(m -> {
            if (account.isImapConfigured()) {
                logger.info("test imap connection for account = {}", account);
                testImapConnection(account);
                m.put("imap", true);
            }
            if (account.isSmtpConfigured()) {
                logger.info("test smtp connection for account = {}", account);
                testSmtpConnection(account);
                m.put("smtp", true);
            }
        }));
    }

    private FluentMap<String, Object> serializeBasicAccount(EmailAccount a) {
        return map(
                "_id", a.getId(),
                "name", a.getName()
        );
    }

    private FluentMap<String, Object> serializeDetailedAccount(EmailAccount a) {
        return serializeBasicAccount(a).with(
                "default", equal(a.getName(), service.getDefaultCodeOrNull()),
                "username", a.getUsername(),
                "password", stringToBullets(a.getPassword()),
                "address", a.getAddress(),
                "smtp_server", a.getSmtpServer(),
                "smtp_port", a.getSmtpPort(),
                "smtp_ssl", a.getSmtpSsl(),
                "smtp_starttls", a.getSmtpStartTls(),
                "imap_output_folder", a.getSentEmailFolder(),
                "imap_server", a.getImapServer(),
                "imap_port", a.getImapPort(),
                "imap_ssl", a.getImapSsl(),
                "imap_starttls", a.getImapStartTls()
        );
    }

    public static class WsEmailAccountData {

        private final String name, username, password, address, smtpServer, imapOutputFolder, imapServer;
        private final Integer smtpPort, imapPort;
        private final Boolean smtpSsl, smtpStarttls, imapSsl, imapStarttls;

        public WsEmailAccountData(
                @JsonProperty("name") String name,
                @JsonProperty("username") String username,
                @JsonProperty("password") String password,
                @JsonProperty("address") String address,
                @JsonProperty("smtp_server") String smtpServer,
                @JsonProperty("imap_output_folder") String imapOutputFolder,
                @JsonProperty("imap_server") String imapServer,
                @JsonProperty("smtp_port") Integer smtpPort,
                @JsonProperty("imap_port") Integer imapPort,
                @JsonProperty("smtp_ssl") Boolean smtpSsl,
                @JsonProperty("smtp_starttls") Boolean smtpStarttls,
                @JsonProperty("imap_ssl") Boolean imapSsl,
                @JsonProperty("imap_starttls") Boolean imapStarttls) {
            this.name = checkNotBlank(name);
            this.username = username;
            this.password = password;
            this.address = address;
            this.smtpServer = smtpServer;
            this.imapOutputFolder = imapOutputFolder;
            this.imapServer = imapServer;
            this.smtpPort = smtpPort;
            this.imapPort = imapPort;
            this.smtpSsl = smtpSsl;
            this.smtpStarttls = smtpStarttls;
            this.imapSsl = imapSsl;
            this.imapStarttls = imapStarttls;
        }

        public EmailAccountImplBuilder toEmailAccount() {
            return EmailAccountImpl.builder()
                    .withName(name)
                    .withAddress(address)
                    .withImapPort(imapPort)
                    .withImapServer(imapServer)
                    .withImapSsl(imapSsl)
                    .withImapStartTls(imapStarttls)
                    .withSentEmailFolder(imapOutputFolder)
                    .withSmtpPort(smtpPort)
                    .withSmtpServer(smtpServer)
                    .withSmtpSsl(smtpSsl)
                    .withSmtpStartTls(smtpStarttls)
                    .withUsername(username)
                    .withPassword(password);
        }

    }

}
