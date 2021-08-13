/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.debuginfo;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.trimToEmpty;

public interface BuildInfoService {

    boolean hasBuildInfo();

    String getVersionNumberOrUnknownIfNotAvailable();

    String getModuleVersionNumberOrUnknownIfNotAvailable();

    BuildInfo getBuildInfo();

    default String getCommitInfo() {
        return getBuildInfo().getCommitInfo();
    }

    default String getCommitInfoOrUnknownIfNotAvailable() {
        return hasBuildInfo() ? getCommitInfo() : "unknown";
    }

    default String getVersionNumberWithModuleOrUnknownIfNotAvailable() {
        return trimToEmpty(format("%s %s", getModuleVersionNumberOrUnknownIfNotAvailable(), getVersionNumberOrUnknownIfNotAvailable())).replaceAll(" ", "-");
    }

}
