/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.utils;

import org.cmdbuild.auth.login.AuthRequestInfo;

public class RequestAuthUtils {

    public static boolean shouldSkipSso(AuthRequestInfo request) {
        return request.hasParameter("skipsso");
    }

    public static boolean isUiRequest(AuthRequestInfo request) {
        return "GET".equalsIgnoreCase(request.getMethod()) && request.getRequestPath().matches("/ui(_dev)?/?");
    }

    public static boolean shouldRedirectToLoginPage(AuthRequestInfo request) {
        return isUiRequest(request) && !shouldSkipSso(request);
    }
}
