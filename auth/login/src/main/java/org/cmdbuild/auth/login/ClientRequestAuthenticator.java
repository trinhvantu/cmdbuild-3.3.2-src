package org.cmdbuild.auth.login;

import javax.annotation.Nullable;

public interface ClientRequestAuthenticator extends AuthenticatorDelegate {

    @Nullable
    RequestAuthenticatorResponse<LoginUserIdentity> authenticate(AuthRequestInfo request);

    @Nullable
    default RequestAuthenticatorResponse<Void> logout() {
        return null;
    }
}
