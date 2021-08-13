/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.login.saml;

import javax.annotation.Nullable;

public interface SamlAuthenticatorConfiguration {

    String getSamlServiceProviderEntityId();

    String getSamlIdpEntityId();

    String getSamlIdpLoginUrl();

    @Nullable
    String getSamlIdpLogoutUrl();

    @Nullable
    String getSamlLoginHanlderScript();

    @Nullable
    String getCmdbuildBaseUrlForSaml();

    @Nullable
    String getSamlServiceProviderKey();

    @Nullable
    String getSamlServiceProviderCertificate();

    @Nullable
    String getSamlIdpCertificate();
}
