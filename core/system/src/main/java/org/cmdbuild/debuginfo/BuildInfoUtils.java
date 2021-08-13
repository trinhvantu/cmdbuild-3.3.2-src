/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.debuginfo;

import static com.google.common.base.Strings.nullToEmpty;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import static java.lang.String.format;
import java.lang.invoke.MethodHandles;
import java.time.ZonedDateTime;
import java.util.Properties;
import javax.annotation.Nullable;
import org.cmdbuild.utils.date.CmDateUtils;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTimeUtc;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import static org.cmdbuild.utils.io.CmZipUtils.getZipFileContentByPath;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBoolean;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BuildInfoUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static BuildInfo loadBuildInfoFromWarDirSafe(File warDir) {
        Properties properties = new Properties();
        try {
            properties.load(new ByteArrayInputStream(toByteArray(new File(warDir, "WEB-INF/classes/git.properties"))));
            properties.load(new ByteArrayInputStream(toByteArray(new File(warDir, "WEB-INF/classes/org/cmdbuild/version.properties"))));
        } catch (Exception ex) {
            LOGGER.warn("error loading build info from war directory = {}", warDir, ex);
        }
        return parseBuildInfo(properties);
    }

    public static BuildInfo loadBuildInfoFromWarFileSafe(File warFile) {
        Properties properties = new Properties();
        try {
            try (InputStream in = new FileInputStream(warFile)) {
                properties.load(new ByteArrayInputStream(getZipFileContentByPath(in, "WEB-INF/classes/git.properties")));
            }
            try (InputStream in = new FileInputStream(warFile)) {
                properties.load(new ByteArrayInputStream(getZipFileContentByPath(in, "WEB-INF/classes/org/cmdbuild/version.properties")));
            }
        } catch (Exception ex) {
            LOGGER.warn("error loading build info from war file = {}", warFile, ex);
        }
        return parseBuildInfo(properties);
    }

    public static BuildInfo loadBuildInfoFromWarData(byte[] warData) throws IOException {
        Properties properties = new Properties();
        properties.load(new ByteArrayInputStream(getZipFileContentByPath(warData, "WEB-INF/classes/git.properties")));
        properties.load(new ByteArrayInputStream(getZipFileContentByPath(warData, "WEB-INF/classes/org/cmdbuild/version.properties")));
        return parseBuildInfo(properties);
    }

    public static BuildInfo parseBuildInfo(Properties properties) {
        return new BuildInfoImpl(properties);
    }

    private static class BuildInfoImpl implements BuildInfo {

        private final String versionNumber, versionInfo, moduleVersionNumber;
        private final boolean hasBuildInfo;

        private BuildInfoImpl(Properties properties) {
            String vn = "unknown", mvn = "", vi = "version info not available";
            boolean ok = false;
            try {
                String commitId = checkNotBlank(properties.getProperty("git.commit.id.abbrev"));
                String branch = checkNotBlank(properties.getProperty("git.branch"));
                ZonedDateTime timestamp = CmDateUtils.toDateTime(checkNotBlank(properties.getProperty("git.commit.time")));
                boolean isDirty = toBoolean(properties.getProperty("git.dirty"));
                String version = checkNotBlank(properties.getProperty("org.cmdbuild.version"));
                vn = version;
                mvn = nullToEmpty(properties.getProperty("org.cmdbuild.vert.version"));
                vi = format("%s/%s (%s)%s", commitId, branch, toIsoDateTimeUtc(timestamp), isDirty ? " (dirty)" : "");
                ok = true;
            } catch (Exception ex) {
                LOGGER.warn("version info is not available", ex);
            }
            hasBuildInfo = ok;
            versionNumber = vn;
            moduleVersionNumber = mvn;
            versionInfo = vi;
        }

        @Override
        public String getCommitInfo() {
            return versionInfo;
        }

        @Override
        public String getVersionNumber() {
            return versionNumber;
        }

        @Override
        public String toString() {
            return "BuildInfoImpl{" + "info=" + getCommitInfo() + ", version=" + versionNumber + '}';
        }

        @Override
        @Nullable
        public String getModuleVersionNumber() {
            return moduleVersionNumber;
        }

        @Override
        public boolean hasBuildInfo() {
            return hasBuildInfo;
        }

    }
}
