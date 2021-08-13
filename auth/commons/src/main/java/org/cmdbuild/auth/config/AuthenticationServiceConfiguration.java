/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.config;

import java.util.Collection;
import javax.annotation.Nullable;

public interface AuthenticationServiceConfiguration {

    Collection<String> getActiveAuthenticators();

    @Nullable
    Integer getMaxLoginAttempts();

    @Nullable
    Integer getMaxLoginAttemptsWindowSeconds(); 

    default boolean isAuthenticatorEnabled(String name) {
        return getActiveAuthenticators().contains(name);//TODO improve this
    }
}
