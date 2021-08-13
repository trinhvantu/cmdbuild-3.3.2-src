/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.cluster;

public interface ClusterNode {

    boolean isThisNode();

    String getNodeId();

    String getAddress();

    default boolean isOtherNode() {
        return !isThisNode();
    }
}
