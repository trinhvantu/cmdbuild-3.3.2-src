/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.api;

import java.util.List;
import java.util.Map;
import org.cmdbuild.client.rest.model.ServiceStatusInfo;
import org.cmdbuild.cluster.ClusterNode;

public interface NodeStatus {

    Map<String, String> getSystemInfo();

    List<ServiceStatusInfo> getServicesStatus();

    ClusterNode getNodeInfo();

}
