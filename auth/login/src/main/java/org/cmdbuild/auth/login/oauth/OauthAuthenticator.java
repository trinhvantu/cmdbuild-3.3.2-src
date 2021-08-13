package org.cmdbuild.auth.login.oauth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.nullToEmpty;
import com.google.common.net.UrlEscapers;
import static java.lang.String.format;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.cmdbuild.auth.login.AuthRequestInfo;
import org.cmdbuild.auth.login.AuthenticationException;
import org.cmdbuild.auth.login.ClientRequestAuthenticator;
import org.cmdbuild.auth.login.LoginType;
import static org.cmdbuild.auth.login.LoginType.LT_AUTO;
import org.cmdbuild.auth.login.LoginUserIdentity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.auth.login.RequestAuthenticatorResponse;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.login;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.redirect;
import static org.cmdbuild.auth.utils.RequestAuthUtils.shouldRedirectToLoginPage;
import org.cmdbuild.temp.TempService;
import org.cmdbuild.ui.UiBaseUrlService;
import static org.cmdbuild.utils.io.HttpClientUtils.checkStatusAndReadResponse;
import static org.cmdbuild.utils.json.CmJsonUtils.MAP_OF_OBJECTS;
import static org.cmdbuild.utils.json.CmJsonUtils.MAP_OF_STRINGS;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlankOrNull;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;

@Component
public class OauthAuthenticator implements ClientRequestAuthenticator {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final OauthAuthenticatorConfiguration config;
    private final TempService temp;
    private final UiBaseUrlService baseUrlService;

    public OauthAuthenticator(OauthAuthenticatorConfiguration config, TempService temp, UiBaseUrlService baseUrlService) {
        this.config = checkNotNull(config);
        this.temp = checkNotNull(temp);
        this.baseUrlService = checkNotNull(baseUrlService);
    }

    @Override
    public String getName() {
        return "OauthAuthenticator";
    }

    private String getServiceUrl(@Nullable String defaultValue) {
        return checkNotBlank(firstNotBlankOrNull(config.getOauthServiceUrl(), defaultValue), "missing oauth service url").trim().replaceAll("/+$", "");
    }

    private String getMsAzureServiceUrl() {
        return getServiceUrl("https://login.microsoftonline.com");
    }

    private String getTenantId() {
        return firstNotBlank(config.getOauthTenantId(), "common");
    }

    private String getClientId() {
        return checkNotBlank(config.getOauthClientId(), "missing oauth client id");
    }

    private String getClientSecret() {
        return checkNotBlank(config.getOauthClientSecret(), "missing oauth client secret");
    }

    private String getScope() {
        return checkNotBlank(config.getOauthScope(), "missing ouauth scope param");
    }

    @Override
    @Nullable
    public RequestAuthenticatorResponse<LoginUserIdentity> authenticate(AuthRequestInfo request) {
        switch (config.getOauthProtocol()) {
            case OP_MSAZUREOAUTH2:
                if (shouldRedirectToLoginPage(request)) {
                    String redirectUri = firstNotBlank(config.getOauthRedirectUrl(), request.getRequestUrl());
                    String tempId = temp.putTempData(toJson(map("requestUrl", checkNotBlank(request.getRequestUrl()))));
                    String state = format("cmmsazuressoreq%s", tempId);
                    String authUrl = format("%s/%s/oauth2/v2.0/authorize?response_type=code&response_mode=query&scope=%s&client_id=%s&redirect_uri=%s&state=%s",
                            getMsAzureServiceUrl(), getTenantId(),
                            UrlEscapers.urlFormParameterEscaper().escape(getScope()),
                            UrlEscapers.urlFormParameterEscaper().escape(getClientId()),
                            UrlEscapers.urlFormParameterEscaper().escape(redirectUri),
                            state);
                    logger.debug("oauth login url =< {} >", authUrl);
                    return redirect(authUrl);
                } else if (nullToEmpty(request.getParameter("state")).matches("^cmmsazuressoreq.*")) {
                    String error = request.getParameter("error"),
                            errorDescription = request.getParameter("error_description"),
                            errorUri = request.getParameter("error_uri"),
                            errorMessage = null;
                    if (isNotBlank(error) || isNotBlank(errorDescription)) {
                        errorMessage = format("%s: %s %s", firstNotBlank(error, "error"), nullToEmpty(errorDescription), nullToEmpty(errorUri)).trim();
                        logger.warn(marker(), "oauth endpoint returned error: {}", errorMessage);
                    }
                    try {
                        String code = checkNotBlank(request.getParameter("code"), "missing oauth response code"),
                                state = checkNotBlank(request.getParameter("state"), "missing oauth response state");
                        logger.debug("oauth response code =< {} > state =< {} >", code, state);
                        Map<String, String> stateInfo = fromJson(temp.getTempDataAsString(state.replaceFirst("^cmmsazuressoreq", "")), MAP_OF_STRINGS);
                        logger.debug("state info = \n\n{}\n", mapToLoggableStringLazy(stateInfo));
                        String redirectUrl = checkNotNull(stateInfo.get("requestUrl"), "missing `requestUrl` in state info");
                        try (CloseableHttpClient client = HttpClients.createDefault()) {
                            HttpPost tokenRequest = new HttpPost(format("%s/%s/oauth2/v2.0/token", getMsAzureServiceUrl(), getTenantId()));
                            FluentMap<String, Object> tokenRequestPayload = map(
                                    "client_id", getClientId(),
                                    "scope", getScope(),
                                    "code", code,
                                    "redirect_uri", firstNotBlank(config.getOauthRedirectUrl(), request.getRequestUrl()),
                                    "grant_type", "authorization_code",
                                    "client_secret", getClientSecret());
                            tokenRequest.setEntity(new UrlEncodedFormEntity(tokenRequestPayload.toList((k, v) -> (NameValuePair) new BasicNameValuePair((String) k, (String) v)), StandardCharsets.UTF_8.name()));
                            logger.debug("execute oauth token request =< {} > with payload =\n\n{}\n", tokenRequest, mapToLoggableStringLazy(tokenRequestPayload));
                            Map<String, String> tokenResponse = fromJson(checkStatusAndReadResponse(client.execute(tokenRequest)), MAP_OF_STRINGS);
                            logger.debug("received oauth token response = \n\n{}\n", mapToLoggableStringLazy(tokenResponse));

                            if (isNotBlank(tokenResponse.get("id_token"))) {//note: this may be an alternative way to get user info, adding from jwt additional claims; requires `openid` scope in request above; currently incomplete
                                String idToken = checkNotBlank(tokenResponse.get("id_token"), "missing id token");
                                DecodedJWT jwt = JWT.decode(idToken);
                                Map<String, String> info = map(jwt.getClaims()).mapValues(c -> c.asString());
                                logger.debug("received oauth jwt id token info = \n\n{}\n", mapToLoggableStringLazy(info));
                            } else {
                                logger.debug("no oauth jwt id token found in response");
                            }

                            String accessToken = checkNotBlank(tokenResponse.get("access_token"), "missing access_token in response payload");
                            HttpGet userInfoRequest = new HttpGet("https://graph.microsoft.com/v1.0/me");
                            userInfoRequest.setHeader("Authorization", format("Bearer %s", accessToken));
                            logger.debug("execute user info request =< {} >", userInfoRequest);
                            Map<String, Object> userInfo = fromJson(checkStatusAndReadResponse(client.execute(userInfoRequest)), MAP_OF_OBJECTS);
                            logger.debug("received user info response = \n\n{}\n", mapToLoggableStringLazy(userInfo));
                            String loginAttr = checkNotBlank(config.getOauthLoginAttr(), "missing oauth login attr config");
                            LoginType loginType = parseEnumOrDefault(config.getOauthLoginType(), LT_AUTO);
                            String login = checkNotBlank(toStringOrNull(userInfo.get(loginAttr)), "missing oauth login value for attr =< %s >", loginAttr);
                            logger.debug("oauth returned login identity =< {} >, redirect to initial landing page =< {} >", login, redirectUrl);
                            return login(LoginUserIdentity.builder().withType(loginType).withValue(login).build()).withRedirect(redirectUrl);
                        }
                    } catch (Exception ex) {
                        throw new AuthenticationException(ex, "unable to authenticate oauth request" + (isBlank(errorMessage) ? "" : (": " + errorMessage)));
                    }
                } else {
                    logger.debug("skip request oauth processing");
                    return null;
                }
//            case OP_ADFS4OAUTH2:
//                if (shouldRedirectToLoginPage(request)) {
//                    String requestUrl = request.getRequestUrl();
//                    String authUrl = format("%s/adfs/oauth2/authorize?response_type=code+id_token&response_mode=form_post&resource=%s&client_id=%s&redirect_uri=%s",
//                            checkNotBlank(config.getServiceUrl(), "missing afds service url"),
//                            UrlEscapers.urlFormParameterEscaper().escape(checkNotBlank(config.getResourceId(), "missing adfs resource id")),
//                            UrlEscapers.urlFormParameterEscaper().escape(checkNotBlank(config.getClientId(), "missing adfs resource id")),
//                            UrlEscapers.urlFormParameterEscaper().escape(requestUrl));
//                    logger.info("oauth redirect url =< {} >", authUrl);
//                    return redirect(authUrl);
//                } else if ("GET".equalsIgnoreCase(request.getMethod()) && isNotBlank(request.getParameter("code")) && isNotBlank(request.getParameter("id_token"))) {
//                    String code = checkNotBlank(request.getParameter("code")),
//                            idToken = checkNotBlank(request.getParameter("id_token"));
//                    logger.info("processing adfs code =< {} >", code);
//                    try (CloseableHttpClient client = HttpClients.createDefault()) {
//                        HttpPost post = new HttpPost(format("%s/adfs/oauth2/token", checkNotBlank(config.getServiceUrl(), "missing afds service url")));
//                        post.setEntity(new UrlEncodedFormEntity(map(
//                                "grant_type", "authorization_code",
//                                "code", code,
//                                "resource", checkNotBlank(config.getResourceId(), "missing adfs resource id"),
//                                "client_id", checkNotBlank(config.getClientId(), "missing adfs resource id")
//                        //                        "redirect_uri" TODO check this
//                        ).toList((k, v) -> (NameValuePair) new BasicNameValuePair((String) k, (String) v)), StandardCharsets.UTF_8.name()));
//                        CloseableHttpResponse response = client.execute(post);
//                        String message = response.getEntity() == null ? "" : readToString(response.getEntity().getContent(), response.getEntity().getContentEncoding().getValue());
//                        checkArgument(response.getStatusLine().getStatusCode() == HTTP_OK && isNotBlank(message), "adfs token error = %s : < %s >", response.getStatusLine().toString(), abbreviate(message));
//
//                        Map<String, String> meta = fromJson(message, MAP_OF_STRINGS);
//                        logger.info("received adfs meta = \n\n{}\n", mapToLoggableStringLazy(meta));
//
//                        throw unsupported("TODO get user id !!");
//                    } catch (Exception ex) {
//                        throw new AuthenticationException(ex, "unable to authenticate oauth request");
//                    }
//                } else {
//                    return null;
//                }
            default:
                throw unsupported("unsupported oauth protocol =< %s >", config.getOauthProtocol());
        }
    }

    @Override
    @Nullable
    public RequestAuthenticatorResponse<Void> logout() {
        switch (config.getOauthProtocol()) {
            case OP_MSAZUREOAUTH2:
                if (config.isOauthLogoutEnabled()) {
                    String postLogoutRedirectUri = firstNotBlank(config.getOauthLogoutRedirectUrl(), baseUrlService.getBaseUrl()),
                            logoutUrl = format("%s/%s/oauth2/v2.0/logout?post_logout_redirect_uri=%s", getMsAzureServiceUrl(), getTenantId(), UrlEscapers.urlFormParameterEscaper().escape(postLogoutRedirectUri));
                    logger.debug("oauth logout url =< {} >, post logout redirect url =< {} >", logoutUrl, postLogoutRedirectUri);
                    return redirect(logoutUrl);
                } else {
                    return null;
                }
            default:
                return null;
        }
    }

}
