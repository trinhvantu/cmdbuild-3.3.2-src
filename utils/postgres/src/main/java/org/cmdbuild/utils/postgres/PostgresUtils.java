/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.postgres;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.ImmutableList;
import static com.google.common.collect.Iterables.getLast;
import java.io.File;
import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.Set;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.io.CmNetUtils.getAvailablePort;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import org.cmdbuild.utils.postgres.PostgresHelperConfigImpl.PostgresHelperBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PostgresUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final static PgVersionsData PG_UTILS_CONFIG = fromJson(readToString(PostgresUtils.class.getResourceAsStream("/org/cmdbuild/utils/postgres/pg_versions.json")), PgVersionsData.class);

    public final static Set<String> POSTGRES_VERSIONS = set(PG_UTILS_CONFIG.pgVersions).immutable();
    public final static String POSTGRES_VERSION_AUTO = "auto",
            POSTGRES_VERSION_DEFAULT = getLast(POSTGRES_VERSIONS);

    public final static Set<String> POSTGRES_SERVER_VERSIONS = set(PG_UTILS_CONFIG.pgServerVersions).immutable();

    public final static String POSTGRES_SERVER_VERSION_DEFAULT = getLast(POSTGRES_SERVER_VERSIONS);

    public static void checkBinaries() {
        POSTGRES_VERSIONS.stream().map((version) -> PostgresUtils.newHelper().withPostgresVersion(version).buildHelper()).forEach((helper) -> {
            helper.runCommand("pg_dump", "--version");
            helper.runCommand("pg_restore", "--version");
            helper.runCommand("psql", "--version");
        });
    }

    public static void checkDumpFile(File file) {
        newHelper().buildHelper().checkDumpFile(file);
    }

    public static boolean dumpContainsSchema(File dumpFile, String schema) {
        return newHelper().withSchema(schema).buildHelper().dumpContainsSchema(dumpFile);
    }

    public static List<String> getTablesInDump(File dumpFile, String schema) {
        return newHelper().withSchema(schema).buildHelper().getTablesInDump(dumpFile);
    }

    public static List<String> getSchemasInDump(File dumpFile) {
        return newHelper().buildHelper().getSchemasInDump(dumpFile);
    }

    public static PostgresHelperBuilder newHelper() {
        return PostgresHelperConfigImpl.builder();
    }

    public static PostgresHelperBuilder newHelper(String host, int port, String username, String password) {
        return newHelper()
                .withUsername(username)
                .withPassword(password)
                .withHost(host)
                .withPort(port);
    }

    public static PostgresServerHelper serverHelper() {
        return new PostgresServerHelperImpl();
    }

    public static int getPostgresServerAvailablePort() {
        return getAvailablePort(5432);
    }

    private static class PgVersionsData {

        private final List<String> pgVersions, pgServerVersions;

        public PgVersionsData(@JsonProperty("pg_client_versions") List<String> pgVersions,
                @JsonProperty("pg_server_versions") List<String> pgServerVersions) {
            this.pgVersions = ImmutableList.copyOf(pgVersions);
            this.pgServerVersions = ImmutableList.copyOf(pgServerVersions);
        }

    }

}
