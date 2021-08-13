package org.cmdbuild.auth;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import org.cmdbuild.auth.login.LoginUserIdentity;
import org.cmdbuild.auth.login.LoginType;
import org.junit.Test;

public class LoginTest {

    @Test
    public void theAtCharacterDoesNotDiscriminatesBetweenEmailAndUsername() {
        String STRING_WITHOUT_AT = "anything without the at char";
        String STRING_WITH_AT = "anything with the @ char"; // "firstname.surname@example.com";

        LoginUserIdentity usernameLogin = LoginUserIdentity.builder() //
                .withValue(STRING_WITHOUT_AT) //
                .build();

        LoginUserIdentity emailLogin = LoginUserIdentity.builder() //
                .withValue(STRING_WITH_AT) //
                .build();

        assertThat(usernameLogin.getValue(), is(STRING_WITHOUT_AT));
        assertThat(usernameLogin.getType(), is(LoginType.LT_AUTO));

        assertThat(emailLogin.getValue(), is(STRING_WITH_AT));
        assertThat(emailLogin.getType(), is(LoginType.LT_AUTO));
    }

    @Test(expected = NullPointerException.class)
    public void disallowsNullLoginStrings() {
        LoginUserIdentity.builder() //
                .build();
    }

}
