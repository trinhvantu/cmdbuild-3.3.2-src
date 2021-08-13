/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.eventlog;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.eventbus.Subscribe;
import java.util.Map;
import org.cmdbuild.cluster.NodeIdProvider;
import org.cmdbuild.eventlog.EventLogCollectorService;
import org.cmdbuild.eventlog.EventLogService;
import org.cmdbuild.services.SystemShutdownInitiatedEvent;
import org.cmdbuild.services.SystemReadyEvent;
import static org.cmdbuild.utils.io.CmNetUtils.getHostname;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.springframework.stereotype.Component;
import org.cmdbuild.system.SystemEventbusService;

@Component
public class SystemEventLoggerService {

    private final EventLogCollectorService collector;
    private final NodeIdProvider nodeIdProvider;

    public SystemEventLoggerService(NodeIdProvider nodeIdProvider, EventLogService collector, SystemEventbusService systemEventService) {
        this.collector = checkNotNull(collector);
        this.nodeIdProvider = checkNotNull(nodeIdProvider);
        systemEventService.getEventBus().register(new Object() {

            @Subscribe
            public void handleSystemReadyEvent(SystemReadyEvent event) {
                SystemEventLoggerService.this.collector.storeEvent("cm_system_startup", getSystemInfo());
            }

            @Subscribe
            public void handleSystemBeforeStoppingServicesEvent(SystemShutdownInitiatedEvent event) {
                SystemEventLoggerService.this.collector.storeEvent("cm_system_shutdown", getSystemInfo());
            }

        });
    }

    private Map<String, Object> getSystemInfo() {
        return map(
                "pid", ProcessHandle.current().pid(),
                "hostname", getHostname(),
                "node", nodeIdProvider.getClusterNodeId()
        );
    }

}
