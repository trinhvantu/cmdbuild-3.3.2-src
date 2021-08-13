/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.config;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.lang.String.format;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.cluster.ClusterConfiguration;
import static org.cmdbuild.cluster.ClusterConfiguration.CLUSTER_CONFIG_NAMESPACE;
import static org.cmdbuild.config.api.ConfigCategory.CC_ENV;
import org.cmdbuild.config.api.ConfigComponent;
import static org.cmdbuild.config.api.ConfigLocation.CL_FILE_ONLY;
import org.cmdbuild.config.api.ConfigValue;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.springframework.stereotype.Component;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.random.CmRandomUtils.randomId;
import org.springframework.context.annotation.Primary;

@Component
@Primary
@ConfigComponent(CLUSTER_CONFIG_NAMESPACE)
public class ClusterConfigurationImpl implements ClusterConfiguration {

    @ConfigValue(key = CLUSTER_CONFIG_ENABLED, description = "enable clustering features (jgroups)", defaultValue = FALSE)
    private boolean isEnabled;

    @ConfigValue(key = "name", description = "cluster name; all cmdbuild instances with the same cluster name will try to connect and form a cluster", defaultValue = "CMDBuild-Cluster", category = CC_ENV)
    private String clusterName;

    @ConfigValue(key = "tcp.port", description = "default jgroups tcp port", defaultValue = "7800", category = CC_ENV)
    private int tcpPort;

    @ConfigValue(key = CLUSTER_CONFIG_NODE_PORT, description = "jgroups tcp port (override for this node); you usually need to change this only if you want to start a cluster with multiple nodes on the same host", defaultValue = "", location = CL_FILE_ONLY, category = CC_ENV)
    private Integer nodeTcpPort;

    @ConfigValue(key = CLUSTER_CONFIG_NODE_ADDR, description = "bind interfaces", location = CL_FILE_ONLY, category = CC_ENV)
    private String nodeTcpAddr;

    @ConfigValue(key = CLUSTER_CONFIG_NODES, description = "cluster nodes, example: '10.0.0.1[7800],10.0.0.2[7800]' or '10.0.0.1,10.0.0.2' (if not specified, default tcp port value will be used)", defaultValue = "", category = CC_ENV)
    private List<String> clusterNodes;

    @ConfigValue(key = "node.id", description = "this cluster node id, default to a random generated id", defaultValue = "", location = CL_FILE_ONLY, category = CC_ENV)
    private String nodeId;

    @ConfigValue(key = "rpc.timeout", description = "cluster rpc timeout, in ms", defaultValue = "600000", category = CC_ENV)
    private Long rpcTimeout;

    private final String runtimeNodeId = randomId(4);

    @Override
    public String getClusterName() {
        return checkNotBlank(clusterName, "error: cluster name is null");
    }

    @Override
    public long getRpcTimeout() {
        return rpcTimeout;
    }

    @Override
    @Nullable
    public String getTcpAddr() {
        return nodeTcpAddr;
    }

    @Override
    public List<String> getClusterNodes() {
        return clusterNodes.stream().map((s) -> {
            Matcher matcher = Pattern.compile("[^\\[]+(\\[[0-9]+\\])?$").matcher(s);
            checkArgument(matcher.matches(), "invalid syntax for cluster node = %s", s);
            if (isNotBlank(matcher.group(1))) {
                return s;
            } else {
                return format("%s[%s]", s, tcpPort);
            }
        }).collect(toImmutableList());
    }

    @Override
    public int getTcpPort() {
        return firstNonNull(nodeTcpPort, tcpPort);
    }

    @Override
    public boolean isClusterEnabled() {
        return isEnabled;
    }

    @Override
    public String getRuntimeNodeId() {
        return runtimeNodeId;
    }

    @Override
    @Nullable
    public String getConfiguredNodeId() {
        return nodeId;
    }
}
