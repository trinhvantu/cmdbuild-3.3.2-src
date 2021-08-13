package org.cmdbuild.auth.user;

import static com.google.common.base.Preconditions.checkArgument;
import org.cmdbuild.auth.role.RoleRepository;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.MoreCollectors.toOptional;
import static java.lang.Math.toIntExact;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.defaultString;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.auth.multitenant.api.MultitenantService;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;

import org.springframework.stereotype.Component;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import org.cmdbuild.auth.config.UserRepositoryConfig;
import org.cmdbuild.auth.login.LoginUserIdentity;
import org.cmdbuild.auth.multitenant.UserAvailableTenantContextImpl;
import org.cmdbuild.auth.multitenant.api.UserAvailableTenantContext;
import org.cmdbuild.auth.multitenant.api.UserAvailableTenantContext.TenantActivationPrivileges;
import static org.cmdbuild.dao.core.q3.WhereOperator.EQ_CASE_INSENSITIVE;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import org.cmdbuild.common.utils.PagedElements;
import static org.cmdbuild.common.utils.PagedElements.isPaged;
import static org.cmdbuild.common.utils.PagedElements.paged;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.CmdbSorter;
import org.cmdbuild.auth.role.Role;
import static org.cmdbuild.auth.user.UserData.USER_ATTR_EMAIL;
import static org.cmdbuild.auth.user.UserData.USER_ATTR_USERNAME;
import org.cmdbuild.auth.userrole.UserRole;
import org.cmdbuild.common.utils.PositionOf;
import org.cmdbuild.config.CoreConfiguration;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import static org.cmdbuild.dao.utils.PositionOfUtils.buildPositionOf;
import static org.cmdbuild.userconfig.UserConfigConst.USER_CONFIG_MULTITENANT_ACTIVATION_PRIVILEGES;
import org.cmdbuild.userconfig.UserConfigService;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import org.springframework.context.annotation.Primary;
import static org.cmdbuild.userconfig.UserConfigConst.USER_CONFIG_MULTIGROUP;

@Component
@Primary
public class UserRepositoryImpl implements UserRepository {

    private final UserRepositoryConfig configuration;
    private final CoreConfiguration coreConfig;
    private final DaoService dao;
    private final MultitenantService multitenantService;
    private final RoleRepository groupRepository;
    private final UserConfigService userConfigService;

    public UserRepositoryImpl(UserRepositoryConfig configuration, CoreConfiguration coreConfig, DaoService dao, MultitenantService multitenantService, RoleRepository groupRepository, UserConfigService userConfigService) {
        this.configuration = checkNotNull(configuration);
        this.coreConfig = checkNotNull(coreConfig);
        this.dao = checkNotNull(dao);
        this.multitenantService = checkNotNull(multitenantService);
        this.groupRepository = checkNotNull(groupRepository);
        this.userConfigService = checkNotNull(userConfigService);
    }

    @Override
    public LoginUser getActiveValidUserOrNull(LoginUserIdentity login) {
        UserData userCard = getActiveUserDataOrNull(login);
        if (userCard == null) {
            return null;
        } else {
            LoginUser user = buildUserFromCard(userCard);
            checkArgument(!user.getRoleInfos().isEmpty(), "invalid login user =< %s > : this user has no valid groups", user.getUsername());
            return user;
        }
    }

    @Override
    public LoginUser getUserByIdOrNull(Long userId) {
        UserData user = dao.selectAll().from(UserData.class).where(ATTR_ID, EQ, userId).getOne();
        return buildUserFromCard(user);
    }

    @Override
    public PagedElements<UserData> getMany(DaoQueryOptions queryOptions) {
        CmdbFilter filter = queryOptions.getFilter();
        CmdbSorter sorter = queryOptions.getSorter();
        long offset = queryOptions.getOffset();

        PositionOf positionOf = null;
        if (queryOptions.hasPositionOf()) {
            Long rowNumber = dao.selectRowNumber().where(ATTR_ID, EQ, queryOptions.getPositionOf()).then()
                    .from(UserData.class)
                    .orderBy(sorter)
                    .where(filter)
                    .build().getRowNumberOrNull();
            positionOf = buildPositionOf(rowNumber, queryOptions);
            offset = positionOf.getActualOffset();
        }

        List<UserData> users = dao.selectAll()
                .from(UserData.class)
                .orderBy(sorter)
                .where(filter)
                .paginate(offset, queryOptions.getLimit())
                .asList();

        long total;
        if (isPaged(offset, queryOptions.getLimit())) {
            total = dao.selectCount()
                    .from(UserData.class)
                    .where(filter)
                    .getCount();
        } else {
            total = users.size();
        }
        return new PagedElements<>(users, total, positionOf);
    }

    @Override
    public PagedElements<UserData> getAllWithoutRole(long roleId, CmdbFilter filter, CmdbSorter sorter, @Nullable Long offset, @Nullable Long limit) {
        return getAllWithRole(roleId, filter, sorter, offset, limit, false);
    }

    @Override
    public PagedElements<UserData> getAllWithRole(long roleId, CmdbFilter filter, CmdbSorter sorter, @Nullable Long offset, @Nullable Long limit) {
        return getAllWithRole(roleId, filter, sorter, offset, limit, true);
    }

    @Override
    public UserData get(long id) {
        return dao.getById(UserData.class, id);
    }

    @Override
    public UserData create(UserData user) {
        return dao.create(user);
    }

    @Override
    public UserData update(UserData user) {
        if (isBlank(user.getPassword())) {
            UserData current = get(user.getId());
            user = UserDataImpl.copyOf(user)
                    .withPassword(current.getPassword())
                    .build();
        }
        return dao.update(user);
    }

    @Nullable
    @Override
    public UserData getActiveUserDataOrNull(LoginUserIdentity login) {
        String attribute = getLoginAttribute(login);
        return dao.selectAll().from(UserData.class)
                .where("Active", EQ, true)
                .where(attribute, configuration.isCaseInsensitive() ? EQ_CASE_INSENSITIVE : EQ, login.getValue())
                .getOneOrNull();
    }

    @Override
    public UserData getUserDataOrNull(LoginUserIdentity login) {
        String attribute = getLoginAttribute(login);
        return dao.selectAll().from(UserData.class)
                .where(attribute, configuration.isCaseInsensitive() ? EQ_CASE_INSENSITIVE : EQ, login.getValue())
                .getOneOrNull();
    }

    private PagedElements<UserData> getAllWithRole(long roleId, CmdbFilter filter, CmdbSorter sorter, @Nullable Long offset, @Nullable Long limit, boolean assigned) {
        String query = "EXISTS (SELECT * FROM \"Map_UserRole\" _mur WHERE _mur.\"IdObj1\" = Q3_MASTER.\"Id\" AND _mur.\"IdObj2\" = ? AND _mur.\"Status\" = 'A')";
        if (assigned == false) {
            query = "NOT " + query;
        }
        List<UserData> list = dao.selectAll().from(UserData.class).where(filter)
                .whereExpr(query, roleId)
                .orderBy(sorter).paginate(offset, limit).asList();
        if (isPaged(offset, limit)) {
            long count = dao.selectCount().from(UserData.class).where(filter)
                    .whereExpr(query, roleId)
                    .getCount();
            return paged(list, count);
        } else {
            return paged(list);
        }
    }

    private LoginUser buildUserFromCard(UserData user) {
        List<UserRole> groups = groupRepository.getActiveUserGroups(user.getId());
        String defaultGroupName = groups.stream().filter(UserRole::isDefault).collect(toOptional()).map(UserRole::getRole).map(Role::getName).orElse(null);
        Map<String, String> userConfig = userConfigService.getByUsername(user.getUsername());
        UserAvailableTenantContext userAvailableTenantContext = multitenantService.getAvailableTenantContextForUser(user.getId());
        if (isNotBlank(userConfig.get(USER_CONFIG_MULTITENANT_ACTIVATION_PRIVILEGES))) {
            userAvailableTenantContext = UserAvailableTenantContextImpl.copyOf(userAvailableTenantContext).withTenantActivationPrivileges(parseEnum(userConfig.get(USER_CONFIG_MULTITENANT_ACTIVATION_PRIVILEGES), TenantActivationPrivileges.class)).build();
        }
        return LoginUserImpl.builder()
                .withId(user.getId())
                .withUsername(user.getUsername())
                .withEmail(defaultString(user.getEmail()))
                .withDescription(defaultString(user.getDescription()))
                .withDefaultGroupName(defaultGroupName)
                .withActiveStatus(user.isActive())
                .withServiceStatus(user.isService())
                .withMultigroupEnabled(toBooleanOrDefault(userConfig.get(USER_CONFIG_MULTIGROUP), coreConfig.enableMultigrupByDefault()))
                .withAvailableTenantContext(userAvailableTenantContext)
                .accept(b -> {
                    groups.stream().map(UserRole::getRole).forEach(b::addGroup);
                })
                .build();
    }

    private String getLoginAttribute(LoginUserIdentity login) {
        switch (login.getType()) {
            case LT_EMAIL:
                return USER_ATTR_EMAIL;
            case LT_USERNAME:
                return USER_ATTR_USERNAME;
            case LT_AUTO:
                switch (configuration.getLoginAttributeMode()) {
                    case LAM_AUTO_DETECT_EMAIL:
                        if (login.getValue().matches(".+[@].+")) {
                            return USER_ATTR_EMAIL;
                        } else {
                            return USER_ATTR_USERNAME;
                        }
                    case LAM_EMAIL:
                        return USER_ATTR_EMAIL;
                    case LAM_USERNAME:
                        return USER_ATTR_USERNAME;
                }
            default:
                throw unsupported("unsupported login type = %s", login.getType());
        }
    }

}
