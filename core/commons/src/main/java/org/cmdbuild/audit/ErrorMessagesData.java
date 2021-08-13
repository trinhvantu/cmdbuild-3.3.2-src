/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.audit;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.ImmutableList;
import static java.util.Collections.emptyList;
import java.util.List;
import static java.util.stream.Collectors.toList;
import org.cmdbuild.fault.FaultEvent;

public class ErrorMessagesData {

    private final static ErrorMessagesData EMPTY = new ErrorMessagesData(emptyList());

    private final List<ErrorMessageData> data;

    @JsonCreator
    public ErrorMessagesData(@JsonProperty("data") List<ErrorMessageDataImpl> data) {
        this.data = ImmutableList.copyOf(data);
    }

    @JsonProperty("data")
    public List<ErrorMessageData> getData() {
        return data;
    }

    public static ErrorMessagesData fromErrorsAndWarningEvents(List<FaultEvent> events) {
        return new ErrorMessagesData(events.stream().map((e) -> new ErrorMessageDataImpl(e.getLevel(), e.getMessage(), e.getStacktrace())).collect(toList()));
    }

    public static ErrorMessagesData emptyErrorMessagesData() {
        return EMPTY;
    }

}
