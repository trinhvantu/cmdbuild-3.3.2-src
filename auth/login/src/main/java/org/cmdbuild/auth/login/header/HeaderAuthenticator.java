package org.cmdbuild.auth.login.header;

import static com.google.common.base.Preconditions.checkNotNull;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.auth.login.AuthRequestInfo;
import org.cmdbuild.auth.login.ClientRequestAuthenticator;
import org.cmdbuild.auth.login.LoginUserIdentity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.login;
import org.cmdbuild.auth.login.RequestAuthenticatorResponse;

/**
 * Authenticates a user based on the presence of a header parameter. It can be
 * used when a Single Sign-On proxy adds the header.
 */
@Component
public class HeaderAuthenticator implements ClientRequestAuthenticator {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final HeaderAuthenticatorConfiguration conf;

    public HeaderAuthenticator(HeaderAuthenticatorConfiguration conf) {
        this.conf = checkNotNull(conf);
    }

    @Override
    public String getName() {
        return "HeaderAuthenticator";
    }

    @Override
    @Nullable
    public RequestAuthenticatorResponse<LoginUserIdentity> authenticate(AuthRequestInfo request) {
        String headerAttr = conf.getHeaderAttributeName(),
                loginString = request.getHeader(headerAttr);
        logger.trace("using header attr = {}", headerAttr);
        if ("GET".equalsIgnoreCase(request.getMethod()) && request.getRequestPath().matches("/services/rest/v3/sessions/current/?") && isNotBlank(loginString)) {
            LoginUserIdentity login = LoginUserIdentity.build(loginString);
            logger.debug("Authenticated user = {}", loginString);
            return login(login);
        } else {
            return null;
        }
    }

}
