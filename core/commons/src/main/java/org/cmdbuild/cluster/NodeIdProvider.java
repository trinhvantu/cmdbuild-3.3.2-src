/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.cluster;

import static java.lang.String.format;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.cmdbuild.utils.io.CmNetUtils.getHostname;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;

public interface NodeIdProvider {

    @Nullable
    String getConfiguredNodeId();

    String getRuntimeNodeId();

    default boolean hasConfiguredNodeId() {
        return isNotBlank(getConfiguredNodeId());
    }

    default String getClusterNodeId() {
        return getConfiguredNodeIdOrInformativeRuntimeNodeId();
    }

    default String getConfiguredNodeIdOrInformativeRuntimeNodeId() {
        return firstNotBlank(getConfiguredNodeId(), getInformativeNodeId());
    }

    default String getInformativeNodeId() {
        return hasConfiguredNodeId()
                ? format("%s/%s/%s", getConfiguredNodeId(), getHostname(), ProcessHandle.current().pid())
                : format("%s/%s/%s", getHostname(), ProcessHandle.current().pid(), getRuntimeNodeId());
    }

    default String getInformativeRuntimeNodeId() {
        return hasConfiguredNodeId()
                ? format("%s/%s/%s/%s", getConfiguredNodeId(), getHostname(), ProcessHandle.current().pid(), getRuntimeNodeId())
                : format("%s/%s/%s", getHostname(), ProcessHandle.current().pid(), getRuntimeNodeId());
    }
}
