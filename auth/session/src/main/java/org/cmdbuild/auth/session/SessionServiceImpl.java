/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.session;

import static com.google.common.base.Objects.equal;
import org.cmdbuild.auth.session.inner.CurrentSessionHolder;
import org.cmdbuild.auth.session.inner.SessionDataService;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.eventbus.Subscribe;
import java.util.List;
import java.util.function.Function;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.audit.RequestEventService;
import org.cmdbuild.audit.RequestEventService.RequestCompleteEvent;
import org.cmdbuild.auth.user.OperationUserStore;
import org.cmdbuild.auth.user.OperationUser;
import static org.cmdbuild.auth.user.OperationUserImpl.anonymousOperationUser;
import org.cmdbuild.auth.login.LoginDataImpl;
import org.springframework.stereotype.Component;
import static org.cmdbuild.auth.session.model.SessionImpl.builder;
import static org.cmdbuild.auth.session.model.SessionImpl.copyOf;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.cmdbuild.auth.session.model.Session;
import org.cmdbuild.auth.session.model.SessionData;
import org.cmdbuild.auth.login.LoginData;
import static org.cmdbuild.utils.random.CmRandomUtils.DEFAULT_RANDOM_ID_SIZE;
import static org.cmdbuild.utils.random.CmRandomUtils.randomId;
import org.cmdbuild.auth.session.dao.SessionRepository;
import org.cmdbuild.auth.login.AuthenticationService;
import org.cmdbuild.auth.login.RequestAuthenticatorResponse;
import static org.cmdbuild.auth.session.SessionExpirationStrategy.ES_DEFAULT;
import org.cmdbuild.auth.session.dao.beans.AuthenticationToken;
import org.cmdbuild.auth.session.model.SessionImpl;
import org.cmdbuild.auth.user.LoginUserImpl;
import static org.cmdbuild.auth.user.OperationUser.USER_ATTR_SESSION_ID;
import org.cmdbuild.auth.user.OperationUserImpl;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Component
public class SessionServiceImpl implements SessionService {

    public static final int SESSION_TOKEN_SIZE = DEFAULT_RANDOM_ID_SIZE;

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final CurrentSessionHolder currentSessionIdHolder;
    private final SessionRepository sessionRepository;
    private final OperationUserStore userStore;
    private final AuthenticationService authenticationService;
    private final SessionDataService sessionDataService;

    public SessionServiceImpl(CurrentSessionHolder currentSessionHolder, CurrentSessionHolder currentSessionIdHolder, SessionRepository sessionStore, OperationUserStore userStore, AuthenticationService authenticationLogic, RequestEventService requestEventService, SessionDataService sessionDataService) {
        this.sessionRepository = checkNotNull(sessionStore);
        this.userStore = checkNotNull(userStore);
        this.authenticationService = checkNotNull(authenticationLogic);
        this.sessionDataService = checkNotNull(sessionDataService);
        this.currentSessionIdHolder = checkNotNull(currentSessionIdHolder);
        requestEventService.getEventBus().register(new Object() {
            @Subscribe
            public void handleRequestCompleteEvent(RequestCompleteEvent event) {
                Session session = getCurrentSessionOrNull();
                if (session != null) {
                    updateSession(session);
                }
            }
        });

    }

    @Override
    public void validateSessionId(String sessionId) {
        getSessionById(sessionId);//TODO replace with more efficent query
    }

    @Override
    public Session getSessionById(String sessionId) {
        return checkNotNull(getSessionByIdOrNull(sessionId), "cannot find session for id = %s", sessionId);
    }

    @Override
    public List<Session> getAllSessions() {
        return sessionRepository.getAllSessions();
    }

    @Override
    @Nullable
    public Session getSessionByIdOrNull(String sessionId) {
        return sessionRepository.getSessionByIdOrNull(sessionId);
    }

    @Override
    public int getActiveSessionCount() {
        return sessionRepository.getActiveSessionCount();
    }

    @Override
    public String create(LoginData login) {
        OperationUser user = authenticationService.validateCredentialsAndCreateOperationUser(login);
        String sessionId = createSessionToken();
        user = OperationUserImpl.copyOf(user).withParam(USER_ATTR_SESSION_ID, sessionId).build();
        updateSession(sessionId, user);
        return sessionId;
    }

    @Override
    public void update(String sessionId, LoginData login) {
        Session session = getSessionById(sessionId);
        OperationUser user = authenticationService.updateOperationUser(login, session.getOperationUser());
        user = OperationUserImpl.copyOf(user).withParam(USER_ATTR_SESSION_ID, sessionId).build();
        updateSession(sessionId, user);
        if (equal(sessionId, getCurrentSessionIdOrNull())) {
            userStore.setUser(session.getOperationUser());
        }
    }

    @Override
    public boolean exists(String id) {
        try {
            getSessionById(id); //TODO more efficient query; do not rely on exception for control flow
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public RequestAuthenticatorResponse<Void> deleteSession(String sessionId) {
        Session session = getSessionById(sessionId);
        RequestAuthenticatorResponse<Void> response = authenticationService.invalidateCredentialsAndCreateLogoutResponse();
        sessionRepository.deleteSession(session.getSessionId());
        return response;
    }

    @Override
    public void deleteAll() {
        sessionRepository.deleteAll();
    }

    @Override
    public void impersonate(ImpersonateRequest request) {
        OperationUser user = authenticationService.validateCredentialsAndCreateOperationUser(LoginDataImpl.builder().withNoPasswordRequired().withServiceUsersAllowed(true).withForceUserGroup(true)
                .withLoginString(request.hasUsername() ? request.getUsername() : getCurrentSession().getOperationUser().getUsername()).withGroupName(request.getGroup()).build());
        if (request.hasSponsor()) {
            user = OperationUserImpl.copyOf(user).withSponsor(LoginUserImpl.build(request.getSponsor())).build();
        }
        impersonate(user);
    }

    @Override
    public void impersonate(OperationUser imp) {
        Session session = getCurrentSession();
        session = sessionRepository.createOrUpdateSession(copyOf(session).impersonate(imp).build());
        userStore.setUser(session.getOperationUser());
    }

    @Override
    public void deimpersonate() {
        Session session = sessionRepository.createOrUpdateSession(copyOf(getCurrentSession()).deImpersonate().build());
        userStore.setUser(session.getOperationUser());
    }

    @Override
    @Nullable
    public String getCurrentSessionIdOrNull() {
        return currentSessionIdHolder.getOrNull();
    }

    @Override
    public void setCurrent(@Nullable String sessionId) {
        currentSessionIdHolder.set(sessionId);
        if (isBlank(sessionId)) {
            logger.trace("remove session from current request context");
            userStore.setUser(anonymousOperationUser());
            SecurityContextHolder.getContext().setAuthentication(null);
        } else {
            userStore.setUser(getUserOrAnonymousWhenMissing(sessionId));
            Authentication auth = new AuthenticationToken(sessionId);
            logger.trace("set spring security auth = {}", auth);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    }

    @Override
    public Session getCurrentSession() {
        return getSessionById(checkNotBlank(getCurrentSessionIdOrNull(), "current session not set"));
    }

    @Override
    @Nullable
    public Session getCurrentSessionOrNull() {
        String sessionId = getCurrentSessionIdOrNull();
        return sessionId == null ? null : getSessionByIdOrNull(sessionId);
    }

    @Override
    public void updateCurrentSession(Function<Session, Session> fun) {
        Session session = getCurrentSessionOrNull();
        if (session == null) {
            logger.warn("cannot update current session: current session is not available");
        } else {
            session = fun.apply(session);
            updateSession(session);
        }
    }

    @Override
    public boolean sessionExistsAndHasDefaultGroup(String sessionId) {
        return (sessionId == null) ? false : getUserOrAnonymousWhenMissing(sessionId).hasDefaultGroup();
    }

    @Override
    public OperationUser getUser(String sessionId) {
        return getSessionById(sessionId).getOperationUser();
    }

    @Override
    public void setUser(String sessionId, OperationUser user) {
        sessionRepository.createOrUpdateSession(copyOf(getSessionById(sessionId)).impersonate(user).build());
    }

    @Override
    public void updateSession(Session session) {
        logger.debug("update session = {}", session);
        sessionRepository.createOrUpdateSession(SessionImpl.copyOf(session).withLastActiveDate(now()).build());
        if (equal(session.getSessionId(), getCurrentSessionIdOrNull())) {
            userStore.setUser(session.getOperationUser());
        }
    }

    @Override
    public SessionData getCurrentSessionDataSafe() {
        return sessionDataService.getCurrentSessionDataSafe();
    }

    private Session updateSession(String sessionId, OperationUser user) {
//        Map<String, String> userConfig = userConfigService.getByUsername(user.getUsername());//TODO check this
//        return sessionRepository.updateSession(builder().withSessionId(sessionId).withOperationUser(user).withSessionData((Map) userConfig).build());
        return sessionRepository.createOrUpdateSession(builder().withSessionId(sessionId).withOperationUser(user).withExpirationStrategy(ES_DEFAULT).build());
    }

    private String createSessionToken() {
        return randomId(SESSION_TOKEN_SIZE);
    }

    private OperationUser getUserOrAnonymousWhenMissing(String sessionId) {
        Session session = getSessionByIdOrNull(sessionId);
        return session == null ? anonymousOperationUser() : session.getOperationUser();
    }

}
