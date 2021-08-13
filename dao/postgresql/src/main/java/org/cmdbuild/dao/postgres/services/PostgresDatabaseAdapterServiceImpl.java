/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.services;

import org.cmdbuild.dao.postgres.utils.ConnectionWrapperDataSource;
import com.google.common.base.Joiner;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.nullToEmpty;
import static java.lang.String.format;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import static java.util.Collections.emptySet;
import java.util.Set;
import javax.sql.DataSource;
import org.cmdbuild.dao.driver.DatabaseAccessConfig;
import org.cmdbuild.dao.driver.DatabaseAccessUserContext;
import org.cmdbuild.dao.postgres.utils.MyJdbcTemplate;
import static org.cmdbuild.dao.postgres.services.PostgresDatabaseAdapterService.OPERATION_ROLE_POSTGRES_SESSION_VAR;
import static org.cmdbuild.dao.postgres.services.PostgresDatabaseAdapterService.OPERATION_SCOPE_POSTGRES_SESSION_VAR;
import static org.cmdbuild.dao.postgres.services.PostgresDatabaseAdapterService.OPERATION_SESSION_POSTGRES_SESSION_VAR;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.systemToSqlExpr;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowBiConsumer;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;

public class PostgresDatabaseAdapterServiceImpl implements PostgresDatabaseAdapterService {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    private final DatabaseAccessConfig databaseAccessConfig;
    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;

    public PostgresDatabaseAdapterServiceImpl(DataSource innerDataSource, DatabaseAccessConfig databaseAccessConfig) {
        this.databaseAccessConfig = checkNotNull(databaseAccessConfig);
        this.dataSource = new TenantAwareDataSource(checkNotNull(innerDataSource));
        this.jdbcTemplate = new MyJdbcTemplate(this.dataSource);
    }

    @Override
    public DataSource getDataSource() {
        return dataSource;
    }

    @Override
    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    private class TenantAwareDataSource extends ConnectionWrapperDataSource {

        public TenantAwareDataSource(DataSource dataSource) {
            super(dataSource);
        }

        @Override
        protected void prepareConnection(Connection connection) throws SQLException {
            boolean ignoreTenantPolicies;
            Set<Long> tenantIds;
            DatabaseAccessUserContext userContext = databaseAccessConfig.getUserContext();
            if (databaseAccessConfig.getMultitenantConfiguration().isMultitenantDisabled()) {
                ignoreTenantPolicies = true;
                tenantIds = emptySet();
            } else {
                ignoreTenantPolicies = userContext.ignoreTenantPolicies();
                tenantIds = ignoreTenantPolicies ? emptySet() : userContext.getTenantIds();
            }
            logger.trace("ignoreTenantPolicies = {} tenantIds = {}", ignoreTenantPolicies, tenantIds);
            map(
                    OPERATION_USER_POSTGRES_SESSION_VAR, nullToEmpty(userContext.getUsername()),
                    OPERATION_ROLE_POSTGRES_SESSION_VAR, nullToEmpty(userContext.getRolename()),
                    OPERATION_SESSION_POSTGRES_SESSION_VAR, nullToEmpty(userContext.getSessionId()),
                    OPERATION_SCOPE_POSTGRES_SESSION_VAR, serializeEnum(userContext.getScope()),
                    IGNORE_TENANT_POLICIES_POSTGRES_SESSION_VAR, Boolean.toString(ignoreTenantPolicies),
                    USER_TENANTS_POSTGRES_SESSION_VAR, "{" + Joiner.on(",").join(tenantIds) + "}"
            ).forEach(rethrowBiConsumer((k, v) -> {
                logger.trace("set {} session variable to value = {}", k, v);
                try (Statement statement = connection.createStatement()) {
                    statement.execute(format("SET SESSION %s = %s", k, systemToSqlExpr(v)));//TODO escape value
                }
            }));
        }

        @Override
        protected void releaseConnection(Connection connection) throws SQLException {
            list(OPERATION_USER_POSTGRES_SESSION_VAR, OPERATION_ROLE_POSTGRES_SESSION_VAR, OPERATION_SESSION_POSTGRES_SESSION_VAR, OPERATION_SCOPE_POSTGRES_SESSION_VAR, IGNORE_TENANT_POLICIES_POSTGRES_SESSION_VAR, USER_TENANTS_POSTGRES_SESSION_VAR).forEach(rethrowConsumer(key -> {
                logger.trace("reset {} session variable", key);
                try (Statement statement = connection.createStatement()) {
                    statement.execute(format("RESET %s", key));
                }
            }));
        }

    }
}
