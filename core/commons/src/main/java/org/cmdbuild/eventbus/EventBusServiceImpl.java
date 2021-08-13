/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.eventbus;

import com.google.common.eventbus.EventBus;
import static java.lang.String.format;
import java.lang.invoke.MethodHandles;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.EventBusUtils.logExceptions;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EventBusServiceImpl implements EventBusService {

    private final EventBus daoEventBus = buildEventBus("DAO"), grantEventBus = buildEventBus("GRANT"), cardEventBus = buildEventBus("CARD"), workflowEventBus = buildEventBus("WORKFLOW"), filterEventBus = buildEventBus("FILTER");

    @Override
    public EventBus getDaoEventBus() {
        return daoEventBus;
    }

    @Override
    public EventBus getGrantEventBus() {
        return grantEventBus;
    }

    @Override
    public EventBus getCardEventBus() {
        return cardEventBus;
    }

    @Override
    public EventBus getWorkflowEventBus() {
        return workflowEventBus;
    }

    @Override
    public EventBus getFilterEventBus() {
        return filterEventBus;
    }

    private static EventBus buildEventBus(String name) {
        return new EventBus(logExceptions(LoggerFactory.getLogger(format("%s.%s", MethodHandles.lookup().lookupClass().getName(), checkNotBlank(name)))));
    }

}
