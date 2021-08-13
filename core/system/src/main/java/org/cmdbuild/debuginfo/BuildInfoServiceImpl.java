/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.debuginfo;

import java.util.Properties;
import org.cmdbuild.config.api.DirectoryService;
import org.springframework.stereotype.Component;
import static org.cmdbuild.debuginfo.BuildInfoUtils.loadBuildInfoFromWarDirSafe;
import static org.cmdbuild.debuginfo.BuildInfoUtils.parseBuildInfo;

@Component
public class BuildInfoServiceImpl implements BuildInfoService {

    private final BuildInfo buildInfo;

    public BuildInfoServiceImpl(DirectoryService directoryService) {
        if (directoryService.hasWebappDirectory()) {
            buildInfo = loadBuildInfoFromWarDirSafe(directoryService.getWebappDirectory());
        } else {
            buildInfo = parseBuildInfo(new Properties());
        }
    }

    @Override
    public BuildInfo getBuildInfo() {
        return buildInfo;
    }

    @Override
    public boolean hasBuildInfo() {
        return buildInfo.hasBuildInfo();
    }

    @Override
    public String getVersionNumberOrUnknownIfNotAvailable() {
        return buildInfo.getVersionNumber();
    }

    @Override
    public String getModuleVersionNumberOrUnknownIfNotAvailable() {
        return buildInfo.getModuleVersionNumber();
    }

}
