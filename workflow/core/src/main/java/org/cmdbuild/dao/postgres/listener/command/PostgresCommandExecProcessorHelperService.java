/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.listener.command;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.eventbus.Subscribe;
import static groovy.json.JsonOutput.toJson;
import java.util.Map;
import static org.cmdbuild.dao.postgres.listener.PostgresNotificationEvent.PG_NOTIFICATION_OUTPUT;
import static org.cmdbuild.dao.postgres.listener.PostgresNotificationEvent.PG_NOTIFICATION_TYPE_RESPONSE;
import org.cmdbuild.dao.postgres.listener.PostgresNotificationService;
import org.cmdbuild.syscommand.SysCommand;
import org.cmdbuild.syscommand.SysCommandBus;
import org.cmdbuild.temp.TempService;
import org.cmdbuild.utils.ScriptService;
import static org.cmdbuild.utils.io.CmIoUtils.isJson;
import static org.cmdbuild.utils.lang.CmExceptionUtils.exceptionToMessage;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.getClassOfNullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PostgresCommandExecProcessorHelperService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ScriptService scriptService;
    private final PostgresNotificationService notificationService;
    private final TempService tempService;

    public PostgresCommandExecProcessorHelperService(TempService tempService, ScriptService scriptService, SysCommandBus sysCommandBus, PostgresNotificationService notificationService) {
        this.scriptService = checkNotNull(scriptService);
        this.notificationService = checkNotNull(notificationService);
        this.tempService = checkNotNull(tempService);
        sysCommandBus.getEventBus().register(new Object() {
            @Subscribe
            public void handleSysCommand(SysCommand command) {
                switch (command.getAction()) {
                    case "eval":
                        eval(command);
                        break;
                }
            }

        });
    }

    private void eval(SysCommand command) {//TODO improve this, duplicate code with sys ws ; also: execute on separate thread!
        Map<String, Object> response;
        try {
            logger.info("handle eval sys command {}", command.getId());
            Object output = scriptService.helper(getClass()).withScript(command.get("script", String.class), command.get("language", String.class)).executeForOutput("data", command.getData());
            logger.debug("raw output =< {} > ( {} )", output, getClassOfNullable(output).getName());
            if (output != null && (!(output instanceof String) || !isJson((String) output))) {
                output = toJson(output);
            }
            response = map("id", command.getId(), "success", true, PG_NOTIFICATION_OUTPUT, output);
        } catch (Exception ex) {
            logger.error("error processing sys eval command = {}", command.getId(), ex);
            response = map("id", command.getId(), "success", false, "message", exceptionToMessage(ex));
        }
        tempService.putTempData(toJson(response), map("type", "pg_commad_response", "command_id", command.getId()));//TODO check this
        notificationService.sendMessage(PG_NOTIFICATION_TYPE_RESPONSE, response);
    }

}
