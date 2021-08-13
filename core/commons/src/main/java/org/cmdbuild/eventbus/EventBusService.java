/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.eventbus;

import com.google.common.eventbus.EventBus;

public interface EventBusService {

    /** 
     * events: {@link DaoEvent} 
     */
    EventBus getDaoEventBus();

    /**
     * events: {@link GrantDataUpdatedEvent}
     */
    EventBus getGrantEventBus();

    /**
     * events: {@link CardEvent}
     */
    EventBus getCardEventBus();

    /**
     * events: {@link FlowUpdatedEvent}
     */
    EventBus getWorkflowEventBus();

    /**
     * events: {@link FilterUpdateEvent}
     */
    EventBus getFilterEventBus();

}
