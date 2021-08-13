/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.postgres;

import java.io.File;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;

public interface PostgresServerHelper {

    String getVersion();

    int getPort();

    String getAdminPassword();

    File getInstallDirectory();

    PostgresServerHelper withPostgresVersion(@Nullable String version);

    PostgresServerHelperImpl withPostgis(@Nullable String version);

    PostgresServerHelper withAdminPassword(@Nullable String adminPassword);

    PostgresServerHelper withServerPort(@Nullable Integer port);

    PostgresServerHelper withInstallDirectory(@Nullable File dir);

    PostgresServerHelper installAndStartPostgres();

    PostgresServerHelper startPostgres();

    boolean isRunning();

    PostgresServerHelper stopPostgres();

    PostgresServerHelper uninstallPostgres();

    PostgresHelper getClient();

    default PostgresServerHelper withInstallDirectory(@Nullable String dir) {
        return this.withInstallDirectory(isBlank(dir) ? null : new File(dir));
    }

}
