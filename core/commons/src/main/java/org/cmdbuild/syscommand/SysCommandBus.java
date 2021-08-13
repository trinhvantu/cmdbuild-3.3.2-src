/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.syscommand;

import com.google.common.eventbus.EventBus;
import static org.cmdbuild.utils.lang.EventBusUtils.logExceptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SysCommandBus {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EventBus eventBus = new EventBus(logExceptions(logger));

    public EventBus getEventBus() {
        return eventBus;
    }

    public void postCommand(SysCommand command) {
        logger.info("processing system command = {}", command);
        eventBus.post(command);
    }
}
