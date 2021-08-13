/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.fault;

import com.google.common.base.Joiner;
import static com.google.common.base.Predicates.equalTo;
import static java.util.Collections.emptyList;
import java.util.List;
import static java.util.stream.Collectors.toList;
import static org.cmdbuild.fault.FaultEventLevel.ERROR;

/**
 * an object that collect error or warning events that may happen in a request
 * and should be reported to user
 *
 * @author davide
 */
public interface FaultEventCollector {

    void enableFullLogCollection();

    boolean isFullLogCollectionEnabled();

    void addEvent(FaultEvent event);

    void addLogs(String logs);

    List<FaultEvent> getCollectedEvents();

    String getLogs();

    default void addInfo(Throwable exception) {
        addEvent(new FaultEventImpl(null, FaultEventLevel.INFO, exception));
    }

    default void addWarning(Throwable exception) {
        addEvent(new FaultEventImpl(null, FaultEventLevel.WARNING, exception));
    }

    default void addError(Throwable exception) {
        addEvent(new FaultEventImpl(null, FaultEventLevel.ERROR, exception));
    }

    default FaultEventCollector withError(Exception exception) {
        addError(exception);
        return this;
    }

    default boolean hasEvents() {
        return !getCollectedEvents().isEmpty();
    }

    default void addEventsFrom(FaultEventCollector inner) {
        inner.getCollectedEvents().forEach(this::addEvent);
    }

    /**
     * return an aggregated user-readable message built from all collected
     * events
     *
     * @return
     */
    default String getMessage() {
        return Joiner.on("; ").join(getCollectedEvents().stream().map((event) -> event.getLevel().name() + ": " + event.getMessage()).collect(toList()));
    }

    static FaultEventCollector dummyErrorOrWarningEventCollector() {
        return new FaultEventCollector() {
            @Override
            public void addEvent(FaultEvent event) {
                //quietly ignore
            }

            @Override
            public List<FaultEvent> getCollectedEvents() {
                return emptyList();
            }

            @Override
            public void enableFullLogCollection() {
                //do nothing
            }

            @Override
            public boolean isFullLogCollectionEnabled() {
                return false;
            }

            @Override
            public void addLogs(String logs) {
                //do nothing
            }

            @Override
            public String getLogs() {
                return "";
            }

        };
    }

    default boolean hasErrors() {
        return hasEvents() && getCollectedEvents().stream().map(FaultEvent::getLevel).anyMatch(equalTo(ERROR));
    }

    default void copyErrorsAndLogsFrom(FaultEventCollector otherCollector) {
        addLogs(otherCollector.getLogs());
        otherCollector.getCollectedEvents().forEach(this::addEvent);
    }

}
