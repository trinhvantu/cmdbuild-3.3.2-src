/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.login.oauth;

public interface OauthAuthenticatorConfiguration {

    OauthProtocol getOauthProtocol();

    String getOauthResourceId();

    String getOauthClientId();

    String getOauthClientSecret();

    String getOauthTenantId();

    String getOauthServiceUrl();

    String getOauthRedirectUrl();

    boolean isOauthLogoutEnabled();

    String getOauthLogoutRedirectUrl();

    String getOauthScope();

    String getOauthLoginAttr();

    String getOauthLoginType();

}
