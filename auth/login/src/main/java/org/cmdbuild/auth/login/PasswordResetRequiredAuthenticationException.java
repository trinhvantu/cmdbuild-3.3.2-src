/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.login;

public class PasswordResetRequiredAuthenticationException extends AuthenticationException {

    public PasswordResetRequiredAuthenticationException(String format, Object... params) {
        super(format, params);
    }

}
