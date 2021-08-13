/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.login.db;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.auth.login.LoginUserIdentity;
import org.cmdbuild.auth.login.PasswordAuthenticator;
import org.cmdbuild.auth.login.PasswordCheckResult;
import static org.cmdbuild.auth.login.PasswordCheckResult.PCR_ACCESS_DENIED;
import static org.cmdbuild.auth.login.PasswordCheckResult.PCR_HAS_VALID_PASSWORD;
import static org.cmdbuild.auth.login.PasswordCheckResult.PCR_HAS_VALID_RECOVERY_TOKEN;
import org.cmdbuild.auth.login.PasswordEncodingService;
import org.cmdbuild.auth.user.UserData;
import org.cmdbuild.auth.user.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class DbAuthenticator implements PasswordAuthenticator {

    private final UserRepository userRepository;
    private final PasswordEncodingService encodingService;

    public DbAuthenticator(UserRepository userRepository, PasswordEncodingService encodingService) {
        this.userRepository = checkNotNull(userRepository);
        this.encodingService = checkNotNull(encodingService);
    }

    @Override
    public String getName() {
        return "DBAuthenticator";
    }

    @Override
    public PasswordCheckResult isPasswordValid(LoginUserIdentity login, String password) {
        if (isBlank(password)) {
            return PCR_ACCESS_DENIED;
        } else {
            UserData userData = userRepository.getActiveUserDataOrNull(login);
            if (userData == null) {
                return PCR_ACCESS_DENIED;
            } else if (encodingService.verifyPassword(password, userData.getPassword())) {
                return PCR_HAS_VALID_PASSWORD;//TODO check expiration
            } else if (encodingService.verifyPassword(password, userData.getRecoveryToken())) {
                return PCR_HAS_VALID_RECOVERY_TOKEN;
            } else {
                return PCR_ACCESS_DENIED;
            }
        }
    }

}
