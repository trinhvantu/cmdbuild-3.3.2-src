/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.cluster;

import static com.google.common.base.Objects.equal;
import static com.google.common.collect.ImmutableList.toImmutableList;
import com.google.common.collect.Ordering;
import com.google.common.eventbus.EventBus;
import java.util.List;
import javax.annotation.Nullable;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public interface ClusterService extends NodeIdProvider {

    void sendMessage(ClusterMessage clusterMessage);

    String invokeRpcMethod(String nodeId, @Nullable String sessionId, String payload);

    /**
     * an eventbus to listen to {@link ClusterMessageReceivedEvent} events
     */
    EventBus getEventBus();

    boolean isRunning();

    List<ClusterNode> getClusterNodes();

    ClusterNode selectSingleNodeForKey(@Nullable String key);

    ClusterNode getThisClusterNode();

    default boolean isSingleActiveNode() {
        return !isRunning() || getClusterNodes().size() <= 1;
    }

    default boolean isActiveNodeForKey(@Nullable String key) {
        return isSingleActiveNode() || selectSingleNodeForKey(key).isThisNode();
    }

    default boolean isFirstNode() {
        return getClusterNodes().stream().sorted(Ordering.natural().onResultOf(ClusterNode::getNodeId)).findFirst().get().isThisNode();
    }

    default boolean hasOtherKnownNodeForId(String nodeId) {
        checkNotBlank(nodeId);
        return getOtherClusterNodes().stream().filter(c -> equal(c.getNodeId(), nodeId)).findAny().isPresent();
    }

    default List<ClusterNode> getOtherClusterNodes() {
        return getClusterNodes().stream().filter(ClusterNode::isOtherNode).collect(toImmutableList());
    }

    default ClusterNode getClusterNodeById(String nodeId) {
        checkNotBlank(nodeId);
        return getClusterNodes().stream().filter(n -> equal(n.getNodeId(), nodeId)).collect(onlyElement("cluster node not found for id =< %s >", nodeId));
    }

    default boolean isThisNode(String nodeId) {
        return equal(getThisClusterNode().getNodeId(), checkNotBlank(nodeId));
    }

}
