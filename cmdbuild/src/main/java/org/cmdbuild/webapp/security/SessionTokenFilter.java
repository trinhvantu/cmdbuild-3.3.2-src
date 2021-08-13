/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.webapp.security;

import static com.google.common.base.Preconditions.checkArgument;
import org.cmdbuild.webapp.beans.AuthRequestInfoImpl;
import static com.google.common.collect.MoreCollectors.toOptional;
import java.io.IOException;
import java.lang.invoke.MethodHandles;
import java.nio.charset.StandardCharsets;
import static java.util.Arrays.stream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.annotation.Nullable;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.codec.binary.Base64;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.auth.login.AuthenticationService;
import org.cmdbuild.auth.login.LoginDataImpl;
import org.cmdbuild.auth.login.RequestAuthenticatorResponse;
import org.cmdbuild.auth.login.custom.CustomLoginService;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.cmdbuild.auth.session.SessionService;
import org.cmdbuild.auth.session.model.Session;
import org.cmdbuild.auth.user.LoginUser;
import static org.cmdbuild.auth.user.SessionType.ST_BATCH;
import static org.cmdbuild.auth.utils.SessionTokenUtils.basicAuthTokenToLoginData;
import static org.cmdbuild.auth.utils.SessionTokenUtils.isBasicAuthToken;
import static org.cmdbuild.common.http.HttpConst.CMDBUILD_AUTHORIZATION_COOKIE;
import static org.cmdbuild.common.http.HttpConst.CMDBUILD_AUTHORIZATION_HEADER;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.webapp.services.FilterHelperService;
import static org.cmdbuild.auth.utils.SessionTokenUtils.buildBasicAuthToken;

@Component
@Primary
public class SessionTokenFilter extends OncePerRequestFilter {

    private static final String CMDBUILD_AUTHORIZATION_PARAM = CMDBUILD_AUTHORIZATION_HEADER;

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    @Autowired
    private FilterHelperService helper;
    @Autowired
    private SessionService sessionService;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private CustomLoginService customLoginService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        LOGGER.trace("session token filter BEGIN");

        boolean redirectToLoginPage = false, showLoginErrorPage = false, responseAlreadyProcessed = false;
        String customRedirect = null;

        if (request.getRequestURI().startsWith(request.getContextPath() + "/services/custom-login")) {
            try {
                customLoginService.handleCustomLoginRequestAndCreateAndSetSession(new AuthRequestInfoImpl(request));
                helper.addSessionCookie(request, response);
                redirectToLoginPage = true;
            } catch (Exception ex) {
                LOGGER.error("custom login filter auth error", ex);
                showLoginErrorPage = true;
            }
        } else {
            try {
                String sessionToken = getSessionTokenFromRequest(request);
                LOGGER.trace("session token from request =< {} >", sessionToken);
                if (isNotBlank(sessionToken)) {
                    if (isBasicAuthToken(sessionToken)) {
                        sessionToken = sessionService.create(LoginDataImpl.copyOf(basicAuthTokenToLoginData(sessionToken)).withServiceUsersAllowed(true).withSessionType(ST_BATCH).build());
                    }
                    Session session = sessionService.getSessionByIdOrNull(sessionToken);
                    boolean sessionExists = session != null, sessionHasGroup = session != null && session.getOperationUser().hasDefaultGroup();
                    if (!sessionExists) {
                        LOGGER.debug("session not found for token =< {} >", sessionToken);
                    } else if (!sessionHasGroup && !allowSessionsWithoutGroup()) {
                        LOGGER.warn(marker(), "invalid session for token =< {} >", sessionToken);
                    } else {
                        LOGGER.trace("validated session token =< {} >", sessionToken);
                        sessionService.setCurrent(sessionToken);
                    }
                }
            } catch (Exception ex) {
                LOGGER.error("session token filter error", ex);
            }
            if (!sessionService.hasSession()) {
                try {
                    RequestAuthenticatorResponse<LoginUser> authenticatorResponse = authenticationService.validateCredentialsAndCreateAuthResponse(new AuthRequestInfoImpl(request));
                    if (authenticatorResponse.hasLogin()) {
                        sessionService.createAndSet(LoginDataImpl.builder().withNoPasswordRequired().withUser(authenticatorResponse.getLogin()).build());
                        helper.addSessionCookie(request, response);
                        if (!sessionService.getCurrentSession().getOperationUser().hasDefaultGroup() && enableRedirectToLoginForIncompleteSession()) {
                            redirectToLoginPage = true;
                        }
                    }
                    if (authenticatorResponse.hasRedirectUrl()) {
                        customRedirect = authenticatorResponse.getRedirectUrl();
                    }
                    if (authenticatorResponse.hasResponseHandler()) {
                        try {
                            authenticatorResponse.getResponse().accept(response);
                            responseAlreadyProcessed = true;
                        } catch (Exception ex) {
                            LOGGER.error("custom response handler error", ex);
                            showLoginErrorPage = true;
                        }
                    }
                } catch (Exception ex) {
                    LOGGER.error("request auth error", ex);
                }
            }
        }

        LOGGER.trace("session token filter END");

        if (responseAlreadyProcessed) {
            //do nothing
        } else if (showLoginErrorPage) {
            response.setStatus(401);
            response.setContentType("text/html");
            response.getOutputStream().write(toByteArray(getClass().getResourceAsStream("/org/cmdbuild/webapp/custom_login_error_page.html")));
        } else if (redirectToLoginPage) {
            response.sendRedirect(helper.getLoginRedirectUrl(request));
        } else if (isNotBlank(customRedirect)) {
            response.sendRedirect(customRedirect);
        } else {
            filterChain.doFilter(request, response);
        }
    }

    @Nullable
    public static String getSessionTokenFromRequest(HttpServletRequest httpRequest) {
        try {
            String sessionToken = httpRequest.getParameter(CMDBUILD_AUTHORIZATION_PARAM);
            if (isBlank(sessionToken)) {
                sessionToken = httpRequest.getHeader(CMDBUILD_AUTHORIZATION_HEADER);
            }
            if (isBlank(sessionToken) && httpRequest.getCookies() != null) {
                sessionToken = stream(httpRequest.getCookies()).filter(input -> input.getName().equalsIgnoreCase(CMDBUILD_AUTHORIZATION_COOKIE)).map(Cookie::getValue).distinct().collect(toOptional()).orElse(null);
            }
            if (isBlank(sessionToken)) {
                String auth = httpRequest.getHeader("Authorization");
                if (isNotBlank(auth)) {
                    Matcher matcher = Pattern.compile("Basic\\s+([^\\s]+)").matcher(auth.trim());
                    checkArgument(matcher.matches(), "invalid auth header =< {} >", auth);
                    String value = checkNotBlank(matcher.group(1));
                    matcher = Pattern.compile("([^:]+):(.+)").matcher(new String(Base64.decodeBase64(value), StandardCharsets.UTF_8));
                    checkArgument(matcher.matches(), "invalid auth value pattern =< {} >", value);
                    String username = checkNotBlank(matcher.group(1)), password = checkNotBlank(matcher.group(2));
                    sessionToken = buildBasicAuthToken(username, password);
                }
            }
            return sessionToken;
        } catch (Exception ex) {
            LOGGER.error("error retrieving session token from request", ex);
            return null;
        }
    }

    protected boolean allowSessionsWithoutGroup() {
        return false;
    }

    protected boolean enableRedirectToLoginForIncompleteSession() {
        return false;
    }

}
