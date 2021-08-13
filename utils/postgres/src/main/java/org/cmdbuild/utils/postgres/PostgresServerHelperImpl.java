/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.postgres;

import static com.google.common.base.Preconditions.checkArgument;
import java.io.File;
import static java.lang.String.format;
import javax.annotation.Nullable;
import static org.apache.commons.io.FileUtils.deleteQuietly;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.cmdbuild.utils.exec.CmProcessUtils.executeBashScript;
import static org.cmdbuild.utils.io.CmIoUtils.cmTmpDir;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.postgres.PostgresUtils.POSTGRES_SERVER_VERSION_DEFAULT;
import static org.cmdbuild.utils.postgres.PostgresUtils.getPostgresServerAvailablePort;
import static org.cmdbuild.utils.random.CmRandomUtils.randomId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.postgres.PostgresUtils.POSTGRES_SERVER_VERSIONS;

public class PostgresServerHelperImpl implements PostgresServerHelper {

    private final static String PG_INIT_SCRIPT_CONTENT = readToString(PostgresServerHelperImpl.class.getResourceAsStream("/org/cmdbuild/utils/postgres/pg_init.sh"));

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private String version = POSTGRES_SERVER_VERSION_DEFAULT, postgis;
    private int port = getPostgresServerAvailablePort();
    private String adminPassword = randomId();
    private File installDirectory = tempPgDir();

    @Override
    public String getVersion() {
        return version;
    }

    @Override
    public int getPort() {
        return port;
    }

    @Override
    public String getAdminPassword() {
        return adminPassword;
    }

    @Override
    public File getInstallDirectory() {
        return installDirectory;
    }

    @Override
    public PostgresServerHelperImpl withPostgresVersion(@Nullable String version) {
        if (isBlank(version)) {
            this.version = POSTGRES_SERVER_VERSION_DEFAULT;
        } else {
            this.version = list(POSTGRES_SERVER_VERSIONS).reverse().stream().filter(v -> v.startsWith(version)).limit(1).collect(onlyElement("invalid postgres version =< %s >", version));
        }
        return this;
    }

    @Override
    public PostgresServerHelperImpl withPostgis(@Nullable String postgis) {
        this.postgis = postgis;
        return this;
    }

    @Override
    public PostgresServerHelperImpl withAdminPassword(@Nullable String adminPassword) {
        this.adminPassword = firstNotBlank(adminPassword, randomId());
        return this;
    }

    @Override
    public PostgresServerHelperImpl withServerPort(@Nullable Integer port) {
        this.port = firstNotNull(port, getPostgresServerAvailablePort());
        return this;
    }

    @Override
    public PostgresServerHelperImpl withInstallDirectory(@Nullable File dir) {
        this.installDirectory = firstNotNull(dir, tempPgDir());
        return this;
    }

    @Override
    public PostgresServerHelperImpl installAndStartPostgres() {
        logger.info("install postgres version = {} to path = {} with port = {}", version, installDirectory.getAbsolutePath(), port);
        installDirectory.mkdirs();
        checkArgument(installDirectory.isDirectory(), "invalid install directory = %s", installDirectory.getAbsolutePath());
        if (new File(installDirectory, "pgsql/bin/psql").exists()) {
            logger.info("found existing postgres instance, skip installation");
            //TODO validate postgres version (?)
            startPostgres();
        } else {
            doInstallAndStart();
        }
        return this;
    }

    @Override
    public PostgresServerHelperImpl startPostgres() {
        if (!isRunning()) {
            logger.info("start postgres = {}", installDirectory.getAbsolutePath());
            executePgCtlNohup("-l \"%s\"/log -w start", installDirectory.getAbsolutePath());
        }
        return this;
    }

    @Override
    public boolean isRunning() {
        return executePgCtl("status; true").matches("(?s).*server is running.*");
    }

    @Override
    public PostgresServerHelperImpl stopPostgres() {
        if (isRunning()) {
            logger.info("stop postgres = {}", installDirectory.getAbsolutePath());
            executePgCtl("stop");
        }
        return this;
    }

    @Override
    public PostgresServerHelperImpl uninstallPostgres() {
        if (isRunning()) {
            stopPostgres();
        }
        logger.info("remove postgres server from path = {}", installDirectory.getAbsolutePath());
        deleteQuietly(installDirectory);
        checkArgument(!installDirectory.exists(), "unable to delete postgres from dir = %s", installDirectory.getAbsolutePath());
        return this;
    }

    @Override
    public PostgresHelper getClient() {
        return new PostgresHelperImpl(PostgresUtils.newHelper("localhost", port, "postgres", adminPassword).build());
    }

    private void doInstallAndStart() {
        throw new UnsupportedOperationException(); //TODO redo with docker (!)
//        checkArgument(isPortAvailable(port), "invalid port = %s : port is not available", port);
//        File binaries = getPostgresServerBinaries(version);
//        logger.info("got binaries = {} {}", binaries.getAbsolutePath(), byteCountToDisplaySize(binaries.length()));
//        checkArgument(installDirectory.listFiles().length == 0, "install directory is not empty = %s", installDirectory.getAbsolutePath());
//        executeBashScript(PG_INIT_SCRIPT_CONTENT, installDirectory.getAbsolutePath(), binaries.getAbsolutePath(), port, adminPassword);
//        if (isNotBlank(postgis)) {
//            String actualPostgis;
//            if (postgis.matches("[0-9.]+_[0-9.]+")) {
//                actualPostgis = postgis;
//            } else {
//                actualPostgis = format("%s_%s", version.replaceFirst("([0-9]+[.][0-9]+).*", "$1"), postgis);
//            }
//            unpackPostgisBinaries(actualPostgis, installDirectory);
//        }
//        startPostgres();
//        logger.debug("set admin password");
//        executeBashScript(format("#!/bin/bash\n\nexport PGPASSFILE=\nexport PATH=\"%s\"/pgsql/bin:$PATH\npsql -p %s -U postgres -w -c \"ALTER USER postgres WITH PASSWORD '%s'\"", installDirectory.getAbsolutePath(), port, adminPassword));
    }

    private String executePgCtl(String other, Object... args) {
        return executeBashScript(format("#!/bin/bash\n\nexport PATH=\"%s\"/pgsql/bin:$PATH\npg_ctl -D \"%s\"/data %s", installDirectory.getAbsolutePath(), installDirectory.getAbsolutePath(), format(other, args)));
    }

    private void executePgCtlNohup(String other, Object... args) {
        executeBashScript(format("#!/bin/bash\n\nexport PATH=\"%s\"/pgsql/bin:$PATH\n/usr/bin/nohup pg_ctl -D \"%s\"/data %s &>/dev/null", installDirectory.getAbsolutePath(), installDirectory.getAbsolutePath(), format(other, args)));
    }

    private static File tempPgDir() {
        return new File(cmTmpDir(), format("postgres_%s", randomId(8)));
    }

}
