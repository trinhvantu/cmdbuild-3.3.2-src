package org.cmdbuild.auth.login;

public interface PasswordAuthenticator extends AuthenticatorDelegate {

    PasswordCheckResult isPasswordValid(LoginUserIdentity login, String password);

}
