/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package org.cmdbuild.system;

import com.google.common.eventbus.EventBus;

public interface SystemEventbusService {
	
	EventBus getEventBus();

}
