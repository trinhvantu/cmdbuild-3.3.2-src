package org.cmdbuild.auth.login;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.Collection;

import javax.annotation.Nullable;

import org.cmdbuild.auth.role.Role;
import org.cmdbuild.auth.role.RoleInfo;
import org.cmdbuild.auth.user.LoginUser;
import org.cmdbuild.auth.user.OperationUser;
import org.cmdbuild.auth.user.PasswordSupplier;

public interface AuthenticationService extends PasswordSupplier {

    LoginUser checkPasswordAndGetUser(LoginUserIdentity login, String password);

    RequestAuthenticatorResponse<LoginUser> validateCredentialsAndCreateAuthResponse(AuthRequestInfo request);

    RequestAuthenticatorResponse<Void> invalidateCredentialsAndCreateLogoutResponse();

    LoginUser getUserByIdOrNull(Long userId);

    @Nullable
    LoginUser getUserOrNull(LoginUserIdentity identity);

    Collection<Role> getAllGroups();

    Role fetchGroupWithId(Long groupId);

    @Nullable
    Role getGroupWithNameOrNull(String groupName);

    OperationUser validateCredentialsAndCreateOperationUser(LoginData loginData);

    OperationUser updateOperationUser(LoginData loginData, OperationUser operationUser);

    RoleInfo getGroupInfoForGroup(String groupName);

    Collection<String> getGroupNamesForUserWithId(Long userId);

    Collection<String> getGroupNamesForUserWithUsername(String loginString);

    LoginUser getUserWithId(Long userId);

    Role getGroupWithId(Long groupId);

    Role getGroupWithName(String groupName);

    default LoginUser getUser(LoginUserIdentity identity) {
        return checkNotNull(getUserOrNull(identity), "user not found for identity = %s", identity);
    }

    @Nullable
    default LoginUser getUserByUsernameOrNull(String username) {
        return getUserOrNull(LoginUserIdentity.builder().withValue(username).build());
    }

    default LoginUser getUserByUsername(String username) {
        return checkNotNull(getUserByUsernameOrNull(username), "user not found for username = %s", username);
    }

}
