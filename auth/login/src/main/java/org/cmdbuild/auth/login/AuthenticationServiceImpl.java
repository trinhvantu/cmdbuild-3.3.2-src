package org.cmdbuild.auth.login;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import org.cmdbuild.auth.user.UserRepository;
import org.cmdbuild.auth.role.RoleRepository;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Predicates.isNull;
import static com.google.common.base.Predicates.not;
import static com.google.common.collect.Collections2.transform;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Iterables.getOnlyElement;
import static com.google.common.collect.Maps.uniqueIndex;

import java.util.Collection;
import java.util.List;

import org.cmdbuild.auth.user.OperationUser;

import static java.util.Collections.emptyList;
import java.util.Map;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.auth.config.AuthenticationServiceConfiguration;
import org.cmdbuild.auth.grant.UserPrivileges;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.auth.role.Role;
import org.cmdbuild.auth.role.RoleInfo;
import org.cmdbuild.auth.user.LoginUser;
import static org.cmdbuild.auth.login.GodUserUtils.getGodDummyGroup;
import static org.cmdbuild.auth.login.GodUserUtils.getGodLoginUser;
import static org.cmdbuild.auth.login.GodUserUtils.getGodPrivilegeContext;
import static org.cmdbuild.auth.login.GodUserUtils.isGodDummyGroup;
import static org.cmdbuild.auth.login.GodUserUtils.isGodUser;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.emptyResponse;
import static org.cmdbuild.auth.login.RequestAuthenticatorResponseImpl.login;
import org.cmdbuild.auth.multitenant.api.MultitenantService;
import org.cmdbuild.auth.multitenant.api.UserTenantContext;
import static org.cmdbuild.auth.role.RolePrivilege.RP_DATA_ALL_TENANT;
import org.cmdbuild.auth.user.LoginUserImpl;
import static org.cmdbuild.auth.user.OperationUserImpl.builder;
import org.cmdbuild.auth.user.UserPrivilegesImpl;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import org.cmdbuild.auth.user.PasswordSupplier;
import org.cmdbuild.eventlog.EventLogService;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotNullAndGtZero;
import javax.inject.Provider;

@Component
public class AuthenticationServiceImpl implements AuthenticationService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final static String EVENT_LOGIN_FAILED = "cm_auth_login_failed";

    private final RoleRepository groupRepository;
    private final MultitenantService multitenantService;
    private final Map<String, PasswordAuthenticator> passwordAuthenticatorsByName;
    private final Map<String, ClientRequestAuthenticator> clientRequestAuthenticatorsByName;
    private final UserRepository userRepository;
    private final AuthenticationServiceConfiguration conf;
    private final PasswordSupplier passwordService;
    private final Provider<EventLogService> eventLogService; //TODO fix this

    public AuthenticationServiceImpl(Provider<EventLogService> eventLogService, PasswordSupplier passwordService, RoleRepository groupRepository, MultitenantService multitenantService, List<PasswordAuthenticator> passwordAuthenticators, List<ClientRequestAuthenticator> clientRequestAuthenticators, UserRepository userRepository, AuthenticationServiceConfiguration conf) {
        this.groupRepository = checkNotNull(groupRepository);
        this.multitenantService = checkNotNull(multitenantService);
        this.passwordAuthenticatorsByName = uniqueIndex(passwordAuthenticators, PasswordAuthenticator::getName);
        this.clientRequestAuthenticatorsByName = uniqueIndex(clientRequestAuthenticators, ClientRequestAuthenticator::getName);
        this.userRepository = checkNotNull(userRepository);
        this.conf = checkNotNull(conf);
        this.passwordService = checkNotNull(passwordService);
        this.eventLogService = checkNotNull(eventLogService);
    }

    @Override
    public String getEncryptedPassword(LoginUserIdentity login) {
        return passwordService.getEncryptedPassword(login);
    }

    @Override
    public LoginUser checkPasswordAndGetUser(LoginUserIdentity login, String password) {
        boolean validRecoveryToken = false;
        if (isNotNullAndGtZero(conf.getMaxLoginAttempts())) {
            long failedLogins = eventLogService.get()
                    .getEvents(EVENT_LOGIN_FAILED, now().minusSeconds(checkNotNullAndGtZero(conf.getMaxLoginAttemptsWindowSeconds())))
                    .stream().filter(e -> equal(e.getData().get("login"), login.getValue())).count();
            if (failedLogins >= conf.getMaxLoginAttempts()) {
                storeLoginFailedEvent(login);
                logger.debug("too many failed login attempts for user = {} (failed {} times): access denied", login, failedLogins);
                throw new UserVisibleAuthenticationException("CM: too many failed login attempts for user =< %s >: account locked, retry later", login.getValue());
            }
        }
        for (PasswordAuthenticator passwordAuthenticator : getActivePasswordAuthenticators()) {
            try {
                logger.debug("try to validate password for user = {} with authenticator = {}", login, passwordAuthenticator.getName());
                PasswordCheckResult passwordValid = passwordAuthenticator.isPasswordValid(login, password);
                switch (passwordValid) {
                    case PCR_HAS_VALID_PASSWORD:
                        logger.debug("successfully authenticated user = {} with authenticator = {}", login, passwordAuthenticator.getName());
                        return getUser(login);
                    case PCR_HAS_VALID_RECOVERY_TOKEN:
                        validRecoveryToken = true;
                        break;
                }
            } catch (Exception ex) {
                logger.error(marker(), "authentication error for user = {}", login, ex);
            }
        }
        if (validRecoveryToken) {
            logger.debug("authenticated user = {} with recovery token user (password reset will be required)", login);
            throw new PasswordResetRequiredAuthenticationException("unable to validate credentials: password reset is required for user = %s", login);
        } else {
            storeLoginFailedEvent(login);
            throw new AuthenticationException("invalid login credentials or authentication error for user = %s", login);
        }
    }

    private void storeLoginFailedEvent(LoginUserIdentity login) {
        LoginUser user = getUserOrNull(login);
        if (user != null) {
            eventLogService.get().store(EVENT_LOGIN_FAILED, user.getId(), map("username", user.getUsername(), "login", login.getValue()));
        } else {
            eventLogService.get().store(EVENT_LOGIN_FAILED, map("login", login.getValue()));
        }
    }

    @Override
    public RequestAuthenticatorResponse<LoginUser> validateCredentialsAndCreateAuthResponse(AuthRequestInfo request) {
        for (ClientRequestAuthenticator clientRequestAuthenticator : getActiveClientRequestAuthenticators()) {
            logger.debug("try to validate request with authenticator = {}", clientRequestAuthenticator.getName());
            RequestAuthenticatorResponse<LoginUserIdentity> response = clientRequestAuthenticator.authenticate(request);
            if (response != null) {
                if (response.hasLogin()) {
                    RequestAuthenticatorResponseImpl<LoginUser> login = login(getUser(response.getLogin()));
                    if (response.hasRedirectUrl()) {
                        login = login.withRedirect(response.getRedirectUrl());
                    }
                    return login;
                } else {
                    return (RequestAuthenticatorResponse) response;
                }
            }
        }
        return emptyResponse();
    }

    @Override
    public RequestAuthenticatorResponse<Void> invalidateCredentialsAndCreateLogoutResponse() {
        for (ClientRequestAuthenticator clientRequestAuthenticator : getActiveClientRequestAuthenticators()) {
            RequestAuthenticatorResponse<Void> response = clientRequestAuthenticator.logout();
            if (response != null) {
                return response;
            }
        }
        return emptyResponse();
    }

    @Nullable
    @Override
    public LoginUser getUserOrNull(LoginUserIdentity identity) {
        if (isGodUser(identity)) {
            return getGodLoginUser();
        } else {
            return userRepository.getActiveValidUserOrNull(identity);
        }
    }

    @Override
    @Nullable
    public String getUnencryptedPasswordOrNull(LoginUserIdentity login) {
        return passwordService.getUnencryptedPasswordOrNull(login);
    }

    @Override
    @Nullable
    public LoginUser getUserByIdOrNull(Long userId) {
        return userRepository.getUserByIdOrNull(userId);
    }

    @Override
    public Collection<Role> getAllGroups() {
        return groupRepository.getAllGroups();
    }

    @Override
    public Role fetchGroupWithId(Long groupId) {
        return groupRepository.getByIdOrNull(groupId);
    }

    @Override
    public Role getGroupWithNameOrNull(String groupName) {
        return groupRepository.getGroupWithNameOrNull(groupName);
    }

    @Override
    public OperationUser validateCredentialsAndCreateOperationUser(LoginData loginData) {
        logger.debug("try to login user = {} with group = {} and full info = {}", loginData.getLoginString(), loginData.getLoginGroupName(), loginData);
        LoginUser loginUser;
        LoginUserIdentity identity = LoginUserIdentity.build(loginData.getLoginString());
        if (loginData.isPasswordRequired()) {
            loginUser = checkPasswordAndGetUser(identity, loginData.getPassword());
        } else {
            loginUser = getUser(identity);
        }

        if (!loginData.isServiceUsersAllowed() && loginUser.isService()) {
            logger.warn("login not allowed for user = %s: user is service and service user login is not allowed", loginUser.getUsername());
            throw new AuthenticationException("login failed");
        }

        if (loginData.forceUserGroup() && isNotBlank(loginData.getLoginGroupName()) && !loginUser.hasGroup(loginData.getLoginGroupName())) {
            logger.debug("force group = {} for user = {}", loginData.getLoginGroupName(), loginUser.getUsername());
            loginUser = LoginUserImpl.copyOf(loginUser).addGroup(getGroupInfoForGroup(loginData.getLoginGroupName())).build();
        }

        return buildOperationUser(loginData, loginUser);
    }

    @Override
    public OperationUser updateOperationUser(LoginData loginData, OperationUser operationUser) {
        return buildOperationUser(loginData, operationUser.getLoginUser());
    }

    @Override
    public RoleInfo getGroupInfoForGroup(String groupName) {
        return groupRepository.getGroupWithName(groupName);
    }

    @Override
    public Collection<String> getGroupNamesForUserWithId(Long userId) {
        LoginUser user = getUserByIdOrNull(userId);
        return user == null ? emptyList() : user.getGroupNames();
    }

    @Override
    public Collection<String> getGroupNamesForUserWithUsername(String loginString) {
        LoginUser user = getUserByUsernameOrNull(loginString);
        return user == null ? emptyList() : user.getGroupNames();
    }

    @Override
    public LoginUser getUserWithId(Long userId) {
        return getUserByIdOrNull(userId);
    }

    @Override
    public Role getGroupWithId(Long groupId) {
        return fetchGroupWithId(groupId);
    }

    @Override
    public Role getGroupWithName(String groupName) {
        return checkNotNull(getGroupWithNameOrNull(groupName), "group not found for name = %s", groupName);
    }

    private List<PasswordAuthenticator> getActivePasswordAuthenticators() {
        return conf.getActiveAuthenticators().stream().map(passwordAuthenticatorsByName::get).filter(not(isNull())).collect(toImmutableList());
    }

    private List<ClientRequestAuthenticator> getActiveClientRequestAuthenticators() {
        return conf.getActiveAuthenticators().stream().map(clientRequestAuthenticatorsByName::get).filter(not(isNull())).collect(toImmutableList());
    }

    private OperationUser buildOperationUser(LoginData loginData, LoginUser loginUser) {
        String groupName = loginData.getLoginGroupName();
        UserPrivileges privilegeCtx;
        Role selectedGroup;
        if (isGodUser(loginUser)) {
            Role godRole = getGodDummyGroup();
            List<RoleInfo> groups = list(godRole);
            if (isNotBlank(groupName) && !isGodDummyGroup(groupName)) {
                selectedGroup = groupRepository.getGroupWithName(groupName);
                groups.add(selectedGroup);
            } else {
                selectedGroup = godRole;
            }
            privilegeCtx = getGodPrivilegeContext();
            loginUser = LoginUserImpl.copyOf(loginUser)
                    .withGroups(groups)
                    .withAvailableTenantContext(multitenantService.getAdminAvailableTenantContext()).build();
        } else {
            if (isNotBlank(groupName)) {
                checkArgument(loginUser.getGroupNames().contains(groupName), "user has not group = %s", groupName);
                selectedGroup = groupRepository.getGroupWithName(groupName);
            } else {
                Role guessedGroup = guessPreferredGroup(loginUser);
                if (guessedGroup == null) {
                    logger.debug("created not-valid session (user = {} does not have a default group and belongs to multiple groups)", loginUser.getUsername());
                    return builder().withAuthenticatedUser(loginUser).withTargetDevice(loginData.getTargetDevice()).withUserTenantContext(multitenantService.buildUserTenantContext(loginUser, loginData)).build();
                } else {
                    selectedGroup = guessedGroup;
                }
            }
            if (loginUser.hasMultigroupEnabled() && loginUser.getGroupNames().size() > 1) {
                privilegeCtx = buildPrivilegeContext(list(transform(loginUser.getGroupNames(), groupRepository::getGroupWithName)));
            } else {
                privilegeCtx = buildPrivilegeContext(selectedGroup);
            }
            if (privilegeCtx.hasPrivileges(RP_DATA_ALL_TENANT)) {
                loginUser = LoginUserImpl.copyOf(loginUser).withAvailableTenantContext(multitenantService.getAdminAvailableTenantContext()).build();
            }
        }
        UserTenantContext userTenantContext = multitenantService.buildUserTenantContext(loginUser, loginData);
        return builder()
                .withAuthenticatedUser(loginUser)
                .withTargetDevice(loginData.getTargetDevice())
                .withPrivilegeContext(privilegeCtx)
                .withDefaultGroup(selectedGroup)
                .withUserTenantContext(userTenantContext)
                .withSessionType(loginData.getSessionType())
                .build();
    }

    private UserPrivileges buildPrivilegeContext(Role... groups) {
        return UserPrivilegesImpl.builder().withGroups(groups).build();
    }

    private UserPrivileges buildPrivilegeContext(Iterable<Role> groups) {
        return UserPrivilegesImpl.builder().withGroups(groups).build();
    }

    /**
     * Gets the default group (if any) or the only one. If no default group has
     * been found and more than one group is present, {@code null} is returned.
     */
    @Nullable
    private Role guessPreferredGroup(LoginUser user) {
        if (user.hasDefaultGroup()) {
            return groupRepository.getGroupWithName(user.getDefaultGroupName());
        } else if (user.getGroupNames().size() == 1) {
            return groupRepository.getGroupWithName(getOnlyElement(user.getGroupNames()));
        } else {
            return null;
        }
    }

}
