package org.cmdbuild.service.rest.v3.providers;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;

import java.util.List;

import static org.cmdbuild.fault.FaultUtils.buildResponseMessages;
import org.cmdbuild.config.CoreConfiguration;
import org.cmdbuild.utils.ws3.api.Ws3WarningSource;
import org.springframework.stereotype.Component;
import org.cmdbuild.fault.FaultEventCollectorService;
import org.cmdbuild.fault.FaultEvent;

@Component
public class WarningHandlerService implements Ws3WarningSource {

    private final CoreConfiguration config;
    private final FaultEventCollectorService errorAndWarningCollectorService;

    public WarningHandlerService(CoreConfiguration config, FaultEventCollectorService errorAndWarningCollectorService) {
        this.config = checkNotNull(config);
        this.errorAndWarningCollectorService = checkNotNull(errorAndWarningCollectorService);
    }

    @Override
    public List<Object> getWarningJsonMessages() {
        List<FaultEvent> eventsToReport = errorAndWarningCollectorService.getCurrentRequestEventCollector().getCollectedEvents().stream().filter(e -> e.hasLevel(config.getNotificationMessagesLevelThreshold())).collect(toImmutableList());
        return buildResponseMessages(eventsToReport);
    }
}
