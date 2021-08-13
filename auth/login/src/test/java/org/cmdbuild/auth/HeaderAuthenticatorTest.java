package org.cmdbuild.auth;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.cmdbuild.auth.login.header.HeaderAuthenticator;
import org.junit.Test;
import org.cmdbuild.auth.login.header.HeaderAuthenticatorConfiguration;
import org.cmdbuild.auth.login.AuthRequestInfo;
import org.cmdbuild.auth.login.LoginUserIdentity;
import org.cmdbuild.auth.login.RequestAuthenticatorResponse;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class HeaderAuthenticatorTest {

    private static final String USER_HEADER_NAME = "X-Username";
    private static final String USER_HEADER_VALUE = "MyUser";

    private final HeaderAuthenticatorConfiguration config = new HeaderAuthenticatorConfiguration() {

        @Override
        public String getHeaderAttributeName() {
            return USER_HEADER_NAME;
        }
    };
    private final HeaderAuthenticator authenticator = new HeaderAuthenticator(config);

    @Test
    public void doesNotAuthenticateIfTheHeaderIsNotPresent() {
        AuthRequestInfo request = mock(AuthRequestInfo.class);
        when(request.getMethod()).thenReturn("GET");
        when(request.getRequestPath()).thenReturn("/services/rest/v3/sessions/current");
        RequestAuthenticatorResponse<LoginUserIdentity> response = authenticator.authenticate(request);
        assertNull(response);
    }

    @Test
    public void testHeaderAuth1() {
        AuthRequestInfo request = mock(AuthRequestInfo.class);
        when(request.getMethod()).thenReturn("GET");
        when(request.getRequestPath()).thenReturn("something");
        when(request.getHeader(USER_HEADER_NAME)).thenReturn(USER_HEADER_VALUE);

        RequestAuthenticatorResponse<LoginUserIdentity> response = authenticator.authenticate(request);

        assertNull(response);
    }

    @Test
    public void testHeaderAuth2() {
        AuthRequestInfo request = mock(AuthRequestInfo.class);
        when(request.getMethod()).thenReturn("GET");
        when(request.getRequestPath()).thenReturn("/services/rest/v3/sessions/current");
        when(request.getHeader(USER_HEADER_NAME)).thenReturn(USER_HEADER_VALUE);

        RequestAuthenticatorResponse<LoginUserIdentity> response = authenticator.authenticate(request);

        assertTrue(response.hasLogin());
        assertFalse(response.hasRedirectUrl());
        assertEquals(response.getLogin().getValue(), USER_HEADER_VALUE);
    }
}
