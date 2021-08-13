package org.cmdbuild.auth.login.saml;

import com.google.common.base.Joiner;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.Iterables.getOnlyElement;
import com.onelogin.saml2.Auth;
import com.onelogin.saml2.settings.Saml2Settings;
import com.onelogin.saml2.settings.SettingsBuilder;
import static java.lang.String.format;
import java.security.cert.CertificateEncodingException;
import static java.util.Collections.emptyList;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.api.fluent.CmApiService;
import org.cmdbuild.auth.login.AuthRequestInfo;
import org.cmdbuild.auth.login.AuthenticationException;
import org.cmdbuild.auth.login.ClientRequestAuthenticator;
import org.cmdbuild.auth.login.LoginUserIdentity;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.response;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.auth.login.RequestAuthenticatorResponse;
import org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.login;
import static org.cmdbuild.auth.utils.RequestAuthUtils.shouldRedirectToLoginPage;
import org.cmdbuild.ui.UiBaseUrlService;
import org.cmdbuild.utils.groovy.GroovyScriptService;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.xml.CmXmlUtils.prettifyXml;

@Component
public class SamlAuthenticator implements ClientRequestAuthenticator {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final SamlAuthenticatorConfiguration config;
    private final UiBaseUrlService baseUrlService;
    private final GroovyScriptService scriptService;
    private final CmApiService apiService;

    public SamlAuthenticator(SamlAuthenticatorConfiguration config, UiBaseUrlService baseUrlService, GroovyScriptService scriptService, CmApiService apiService) {
        this.config = checkNotNull(config);
        this.baseUrlService = checkNotNull(baseUrlService);
        this.scriptService = checkNotNull(scriptService);
        this.apiService = checkNotNull(apiService);
    }

    @Override
    public String getName() {
        return "SamlAuthenticator";
    }

    @Override
    @Nullable
    public RequestAuthenticatorResponse<LoginUserIdentity> authenticate(AuthRequestInfo request) {
        if (shouldRedirectToLoginPage(request)) {
            Saml2Settings samlSettings = getSamlSettings(request.getInner());
            String redirect = request.getRequestUrl();
            return response((response) -> {
                try {
                    logger.debug("redirect request to saml idp =< {} > url =< {} >", config.getSamlIdpEntityId(), config.getSamlIdpLoginUrl());
                    Auth auth = new Auth(samlSettings, request.getInner(), response);
                    auth.login(redirect);
                } catch (Exception ex) {
                    throw runtime(ex);
                }
            });
        } else if ("POST".equalsIgnoreCase(request.getMethod()) && request.getRequestPath().matches("(?i)/services/saml/(SSO|login)/?")) {
            try {
                logger.debug("processing saml login request");
                Auth auth = new Auth(getSamlSettings(request.getInner()), request.getInner(), null);
                auth.processResponse();
                List<String> errors = auth.getErrors();
                checkArgument(errors.isEmpty(), "saml error: %s", Joiner.on(", ").join(errors));

                Map<String, List<String>> attributes = auth.getAttributes();

                logger.debug("received saml user with attrs = \n\n{}\n", mapToLoggableStringLazy(attributes));

                String nameId = auth.getNameId();

                LoginUserIdentity login;
                if (isBlank(config.getSamlLoginHanlderScript())) {
                    login = LoginUserIdentity.build(nameId);
                } else {
                    AuthResponse api = new AuthResponse() {
                        @Override
                        public String getAttribute(String name) {
                            return getOnlyElement(firstNotNull(attributes.get(name), emptyList()), null);
                        }

                        @Override
                        public String getNameId() {
                            return nameId;
                        }
                    };
                    Map<String, Object> out = scriptService.executeScript(config.getSamlLoginHanlderScript(), map(
                            "cmdb", apiService.getCmApi(),
                            "logger", LoggerFactory.getLogger(format("%s.HANDLER", getClass().getName())),
                            "auth", api,
                            "login", null
                    ));
                    login = LoginUserIdentity.build(toStringNotBlank(out.get("login"), "invalid login output from saml response handler script"));
                }
                logger.debug("authenticated user = {}", login);

                RequestAuthenticatorResponseImpl<LoginUserIdentity> response = login(login);

                String relayState = request.getParameter("RelayState");

                if (isNotBlank(relayState)) {
                    response = response.withRedirect(relayState);
                }

                return response;
            } catch (Exception ex) {
                throw new AuthenticationException(ex, "unable to authenticate saml request");
            }
        } else {
            return null;
        }
    }

    public Saml2Settings getSamlSettings(Object servletRequest) {
        try {

            String baseUrl = firstNotBlank(config.getCmdbuildBaseUrlForSaml(), baseUrlService.getBaseUrl(servletRequest));

            FluentMap<String, Object> map = map(
                    "onelogin.saml2.unique_id_prefix", "CMDBUILD_",
                    "onelogin.saml2.debug", logger.isDebugEnabled(),
                    "onelogin.saml2.strict", true,
                    "onelogin.saml2.sp.entityid", config.getSamlServiceProviderEntityId(),
                    "onelogin.saml2.sp.assertion_consumer_service.url", baseUrl + "/services/saml/SSO",
                    "onelogin.saml2.sp.single_logout_service.url", baseUrl + "/services/saml/SingleLogout",
                    "onelogin.saml2.security.want_xml_validation", true,
                    "onelogin.saml2.idp.entityid", checkNotBlank(config.getSamlIdpEntityId(), "missing saml identity provider id"),
                    "onelogin.saml2.idp.single_sign_on_service.url", checkNotBlank(config.getSamlIdpLoginUrl(), "missing saml login url"),
                    "onelogin.saml2.idp.single_logout_service.url", config.getSamlIdpLogoutUrl(),
                    "onelogin.saml2.idp.x509cert", checkNotBlank(config.getSamlIdpCertificate(), "missing saml identity provider certificate"),
                    "onelogin.saml2.security.want_messages_signed", true,
                    "onelogin.saml2.security.want_assertions_signed", true
            );

            if (isNotBlank(config.getSamlServiceProviderCertificate()) && isNotBlank(config.getSamlServiceProviderKey())) {
                map.with(
                        "onelogin.saml2.sp.x509cert", config.getSamlServiceProviderCertificate(),
                        "onelogin.saml2.sp.privatekey", config.getSamlServiceProviderKey(),
                        "onelogin.saml2.security.authnrequest_signed", true,
                        "onelogin.saml2.security.logoutrequest_signed", true,
                        "onelogin.saml2.security.logoutresponse_signed", true,
                        "onelogin.saml2.security.sign_metadata", true
                );
            }

            logger.debug("saml authenticator config = \n\n{}\n", mapToLoggableStringLazy(map));
            Saml2Settings settings = new SettingsBuilder().fromValues(map).build();
            List<String> errors = settings.checkSettings();
            checkArgument(errors.isEmpty(), "invalid saml configuration: %s", Joiner.on(", ").join(errors));
            logger.debug("saml metadata = \n\n{}\b", prettifyXml(settings.getSPMetadata()));
            return settings;
        } catch (CertificateEncodingException ex) {
            throw runtime(ex);
        }
    }

    public interface AuthResponse {

        @Nullable
        String getAttribute(String name);

        @Nullable
        String getNameId();
    }
}
