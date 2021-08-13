/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.services;

import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public interface PostgresDatabaseAdapterService {

    final static String OPERATION_USER_POSTGRES_SESSION_VAR = "cmdbuild.operation_user",
            OPERATION_ROLE_POSTGRES_SESSION_VAR = "cmdbuild.operation_role",
            OPERATION_SESSION_POSTGRES_SESSION_VAR = "cmdbuild.operation_session",
            OPERATION_SCOPE_POSTGRES_SESSION_VAR = "cmdbuild.operation_scope",
            USER_TENANTS_POSTGRES_SESSION_VAR = "cmdbuild.user_tenants",
            IGNORE_TENANT_POLICIES_POSTGRES_SESSION_VAR = "cmdbuild.ignore_tenant_policies";

    DataSource getDataSource();

    JdbcTemplate getJdbcTemplate();
}
