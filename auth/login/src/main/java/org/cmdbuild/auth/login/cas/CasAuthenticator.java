package org.cmdbuild.auth.login.cas;

import static com.google.common.base.Preconditions.checkNotNull;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.auth.login.AuthRequestInfo;
import org.cmdbuild.auth.login.ClientRequestAuthenticator;
import org.cmdbuild.auth.login.LoginUserIdentity;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.login;
import org.jasig.cas.client.util.CommonUtils;
import org.jasig.cas.client.validation.Assertion;
import org.jasig.cas.client.validation.Cas20ServiceTicketValidator;
import org.jasig.cas.client.validation.TicketValidationException;
import org.jasig.cas.client.validation.TicketValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.redirect;
import org.cmdbuild.auth.login.RequestAuthenticatorResponse;
import static org.cmdbuild.auth.utils.RequestAuthUtils.shouldRedirectToLoginPage;

@Component
public class CasAuthenticator implements ClientRequestAuthenticator {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final CasAuthenticatorConfiguration conf;

    public CasAuthenticator(CasAuthenticatorConfiguration conf) {
        this.conf = checkNotNull(conf);
    }

    @Override
    public String getName() {
        return "CasAuthenticator";
    }

    @Override
    @Nullable
    public RequestAuthenticatorResponse<LoginUserIdentity> authenticate(AuthRequestInfo request) {
        String userFromTicket = getValidatedUsernameFromTicketOrNull(request);
        if (userFromTicket != null) {
            LoginUserIdentity login = LoginUserIdentity.builder().withValue(userFromTicket).build();
            logger.debug("authenticated as user =< {} >", login);
            return login(login).withRedirect(request.getRequestUrl());
        }
        if (shouldRedirectToLoginPage(request)) {
            String casServerLoginUrl = conf.getCasServerUrl() + conf.getCasLoginPage(),
                    serviceUrl = request.getRequestUrl(),
                    redirectUrl = CommonUtils.constructRedirectUrl(casServerLoginUrl, conf.getCasServiceParam(), serviceUrl, false, false);
            logger.debug("redirect to cas url =< {} >", redirectUrl);
            return redirect(redirectUrl);
        } else {
            return null;
        }
    }

    @Nullable
    private String getValidatedUsernameFromTicketOrNull(AuthRequestInfo request) {
        try {
            String ticket = request.getParameter(conf.getCasTicketParam());
            if (isBlank(ticket)) {
                return null;
            } else {
                logger.debug("processing cas ticket =< {} >", ticket);
                String service = request.getRequestUrl();
                TicketValidator ticketValidator = new Cas20ServiceTicketValidator(conf.getCasServerUrl());
                Assertion assertion = ticketValidator.validate(ticket, service);
                String username = assertion.getPrincipal().getName();
                logger.debug("validated cas ticket, got username =< {} >", username);
                return username;
            }
        } catch (TicketValidationException ex) {
            logger.warn("ticket validation exception", ex);
            return null;
        }
    }

}
