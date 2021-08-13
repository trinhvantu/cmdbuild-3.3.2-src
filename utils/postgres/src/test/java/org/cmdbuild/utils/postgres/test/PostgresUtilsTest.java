/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.postgres.test;

import java.net.URI;
import org.cmdbuild.utils.postgres.PostgresServerHelper;
import org.cmdbuild.utils.postgres.PostgresUtils;
import static org.cmdbuild.utils.postgres.PostgresUtils.POSTGRES_SERVER_VERSIONS;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import org.junit.Ignore;
import org.junit.Test;

public class PostgresUtilsTest {

    @Test
    public void testPgUntilsInit() {
        PostgresUtils.checkBinaries();
    }

    @Test
    public void testUriParsing() {
        URI uri = URI.create("x://10.0.0.173:5432/cmdbuild_30");
        assertEquals(5432, uri.getPort());
        assertEquals("10.0.0.173", uri.getHost());
        assertEquals("/cmdbuild_30", uri.getPath());
    }

    @Test
    @Ignore //TODO fix this
    public void testPgInstall() {
        for (String pgVersion : POSTGRES_SERVER_VERSIONS) {//TODO parametrized test

            PostgresServerHelper postgres = PostgresUtils.serverHelper().withPostgresVersion(pgVersion);

            postgres.installAndStartPostgres();

            assertTrue(postgres.getInstallDirectory().isDirectory());
            assertTrue(postgres.isRunning());

            postgres.stopPostgres();

            assertFalse(postgres.isRunning());

            postgres.uninstallPostgres();

            assertFalse(postgres.getInstallDirectory().exists());

        }
    }

    @Test
    @Ignore //TODO fix this
    public void testPostgisInstall() {
        PostgresServerHelper postgres = PostgresUtils.serverHelper()
                .withPostgresVersion("9.5")
                .withPostgis("2.4.4");
        try {
            postgres.installAndStartPostgres();
            postgres.getClient().executeQuery("CREATE EXTENSION postgis");
        } finally {
            postgres.uninstallPostgres();
        }
    }

//    @Test
//    @Ignore //TODO fix this
//    public void testPostgisBinaries() {
//        File temp = tempDir();
//        unpackPostgisBinaries("9.5_2.4.4", temp);
//        sleepSafe(1000);
//    }
}
