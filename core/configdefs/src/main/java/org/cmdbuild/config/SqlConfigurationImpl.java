package org.cmdbuild.config;

import javax.annotation.Nullable;
import org.springframework.stereotype.Component;
import org.cmdbuild.config.api.ConfigValue;
import org.cmdbuild.config.api.ConfigComponent;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.dao.config.SqlConfiguration;
import static org.cmdbuild.config.SqlConfigurationImpl.SQL_CONFIGURATION;

@Component(SQL_CONFIGURATION)
@ConfigComponent("org.cmdbuild.sql")
public class SqlConfigurationImpl implements SqlConfiguration {

    public static final String SQL_CONFIGURATION = "sqlConfiguration",
            DEFAULT_EXCLUDE_REGEXP = "(SET SESSION|RESET) cmdbuild[.].*| quartz.qrtz_|(INSERT INTO|UPDATE) \"(_Request|_SystemStatusLog|_Temp|_Uploads)\"|SELECT COUNT.*FROM \"_Session\"|SELECT _cm3_temp_put",
            DEFAULT_DDL_INCLUDE_REGEXP = "pax0in78bro0gggg0f39s4dlgsbgjjh0crs1lqr5es8u5gbaap2qdtq05mtrdg0rld2ob2if2l20l2av9ej8qp0b8tonb3sfi18rd07imn3fqj46n2k64kaj4nprl6bu1e5deuep88asbcovqkpif943gd30mj3bm745trfu783balu3s353ujfisgl68sfbn7shqa8dqkagpnevpafrmltbgqt1vmji0ao0ee2hivghfqk994r43j7h388ltj2jimrgo3ahr7cfcrr4mo198nq0v1cnu11qcblhogp46rdo5e6d0m5g12r9lqgpvi222d2kd5pn8icp97mj2c0305u7b156cfs8pogsf6mqppkqrcitakn2ueouq2hl2kmgbsqrjnegnvm03j73f9e7a9cxap",
            SQL_LOG_ENABLED_KEY = "log.enabled";

    @ConfigValue(key = SQL_LOG_ENABLED_KEY, description = "enable logging of all sql queries (on logback category org.cmdbuild.sql)", defaultValue = FALSE)
    private Boolean sqlLoggingEnabled;

    @ConfigValue(key = "log.pretty", description = "enable pretty printing of sql/ddl log statements", defaultValue = FALSE)
    private Boolean sqlPrettyPrintEnabled;

    @ConfigValue(key = "log.include", description = "include in sql log queries matching this regex")
    private String sqlLoggingInclude;

    @ConfigValue(key = "log.exclude", description = "exclude from logs sql queries matching this regex", defaultValue = DEFAULT_EXCLUDE_REGEXP)
    private String sqlLoggingExclude;

    @ConfigValue(key = "log.trackTimes", description = "track and log running time of all queries", defaultValue = FALSE)
    private Boolean sqlLoggingTrackTimes;

    @ConfigValue(key = "ddl_log.enabled", description = "enable logging of ddl queries (on logback category org.cmdbuild.sql_ddl)", defaultValue = FALSE)
    private Boolean ddlLoggingEnabled;

    @ConfigValue(key = "ddl_log.include", description = "include in ddl log only queries matching this regex (default should be good for most applications", defaultValue = DEFAULT_DDL_INCLUDE_REGEXP)
    private String ddlLoggingInclude;

    @ConfigValue(key = "ddl_log.exclude", description = "exclude from ddl log queries matching this regex", defaultValue = DEFAULT_EXCLUDE_REGEXP)
    private String ddlLoggingExclude;

    @ConfigValue(key = "pool.debug.enabled", description = "enable connection pool debug", defaultValue = FALSE)
    private Boolean poolDebugEnabled;

    @ConfigValue(key = "pool.debug.removeAbandonedTimeout", description = "when connection pool debug is enabled, mark connections as abandoned when they are not returned after timeout seconds", defaultValue = "120")
    private Integer poolDebugRemoveAbandonedTimeoutSeconds;

    @ConfigValue(key = "pool.maxIdle", description = "max idle connection", defaultValue = "20")
    private Integer maxIdle;

    @ConfigValue(key = "pool.maxActive", description = "max active connection", defaultValue = "50")
    private Integer maxActive;

    @ConfigValue(key = "pool.connectionTimeout", description = "timeout on connection acquisition from pool (millis)", defaultValue = "30000")
    private Integer connectionTimeoutMillis;

    @Override
    public boolean enablePoolDebug() {
        return poolDebugEnabled;
    }

    @Override
    public int getPoolDebugRemoveAbandonedTimeoutSeconds() {
        return poolDebugRemoveAbandonedTimeoutSeconds;
    }

    @Override
    public int getMaxIdle() {
        return maxIdle;
    }

    @Override
    public int getMaxActive() {
        return maxActive;
    }

    @Override
    public int getConnectionTimeout() {
        return connectionTimeoutMillis;
    }

    @Override
    public boolean enableSqlLogging() {
        return sqlLoggingEnabled;
    }

    @Override
    public boolean enableSqlPrettyPrint() {
        return sqlPrettyPrintEnabled;
    }

    @Override
    @Nullable
    public String excludeSqlRegex() {
        return sqlLoggingExclude;
    }

    @Override
    @Nullable
    public String includeSqlRegex() {
        return sqlLoggingInclude;
    }

    @Override
    public boolean enableSqlLoggingTimeTracking() {
        return sqlLoggingTrackTimes;
    }

    @Override
    public boolean enableDdlLogging() {
        return ddlLoggingEnabled;
    }

    @Override
    @Nullable
    public String includeDdlRegex() {
        return ddlLoggingInclude;
    }

    @Override
    @Nullable
    public String excludeDdlRegex() {
        return ddlLoggingExclude;
    }

}
