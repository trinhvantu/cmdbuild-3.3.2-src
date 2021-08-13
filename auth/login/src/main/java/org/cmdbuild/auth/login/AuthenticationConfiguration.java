/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.login;

import javax.annotation.Nullable;
import org.cmdbuild.auth.login.header.HeaderAuthenticatorConfiguration;
import org.cmdbuild.auth.login.ldap.LdapAuthenticatorConfiguration;
import org.cmdbuild.auth.login.cas.CasAuthenticatorConfiguration;
import org.cmdbuild.auth.config.AuthenticationServiceConfiguration;
import org.cmdbuild.auth.config.UserRepositoryConfig;
import org.cmdbuild.auth.login.custom.CustomLoginConfiguration;
import org.cmdbuild.auth.login.oauth.OauthAuthenticatorConfiguration;
import org.cmdbuild.auth.login.saml.SamlAuthenticatorConfiguration;

public interface AuthenticationConfiguration extends OauthAuthenticatorConfiguration, SamlAuthenticatorConfiguration, HeaderAuthenticatorConfiguration, CasAuthenticatorConfiguration, LdapAuthenticatorConfiguration, AuthenticationServiceConfiguration, UserRepositoryConfig, CustomLoginConfiguration {

    PasswordAlgo getPreferredPasswordAlgorythm();

    @Nullable
    String getLogoutRedirectUrl();

}
