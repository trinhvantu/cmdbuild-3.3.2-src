package org.cmdbuild.auth.login.file;

import java.io.File;
import org.cmdbuild.auth.login.LoginUserIdentity;
import org.cmdbuild.auth.login.PasswordAuthenticator;
import org.cmdbuild.auth.login.PasswordCheckResult;
import static org.cmdbuild.auth.login.PasswordCheckResult.PCR_ACCESS_DENIED;
import static org.cmdbuild.auth.login.PasswordCheckResult.PCR_HAS_VALID_PASSWORD;
import static org.cmdbuild.auth.login.file.FileAuthUtils.isAuthFilePassword;
import org.springframework.stereotype.Component;
import static org.cmdbuild.auth.login.file.FileAuthUtils.isValidAuthFilePassword;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class FileAuthenticator implements PasswordAuthenticator {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    public FileAuthenticator() {
    }

    @Override
    public PasswordCheckResult isPasswordValid(LoginUserIdentity login, String password) {
        File authDir = new File(System.getProperty("java.io.tmpdir"));
        logger.debug("check file password with authDir =< {} >", authDir.getAbsolutePath());
        return isAuthFilePassword(password) && isValidAuthFilePassword(authDir, password) ? PCR_HAS_VALID_PASSWORD : PCR_ACCESS_DENIED;
    }

    @Override
    public String getName() {
        return "file";
    }

}
