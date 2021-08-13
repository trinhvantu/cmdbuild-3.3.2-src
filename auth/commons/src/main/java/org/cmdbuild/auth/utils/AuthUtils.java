/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.utils;

import org.cmdbuild.auth.UnauthorizedAccessException;

public class AuthUtils {

    public static void checkAuthorized(boolean authorized) {
        checkAuthorized(authorized, "access denied");
    }

    public static void checkAuthorized(boolean authorized, String message, Object... args) {
        if (!authorized) {
            throw new UnauthorizedAccessException(message, args);
        }
    }

}
