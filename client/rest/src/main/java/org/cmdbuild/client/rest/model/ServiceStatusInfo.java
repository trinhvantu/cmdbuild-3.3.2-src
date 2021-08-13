/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.model;

import org.cmdbuild.services.MinionStatus;

public interface ServiceStatusInfo {

    String getServiceName();

    MinionStatus getServiceStatus();

}
