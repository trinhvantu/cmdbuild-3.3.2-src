/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.audit;

import org.cmdbuild.fault.FaultEvent;
import org.cmdbuild.fault.FaultEventImpl;
import org.cmdbuild.fault.FaultEventLevel;
import org.cmdbuild.utils.json.JsonBean;

@JsonBean(ErrorMessageDataImpl.class)
public interface ErrorMessageData {

    FaultEventLevel getLevel();

    String getMessage();

    String getStackTrace();

    default boolean isError() {
        switch (getLevel()) {
            case ERROR:
                return true;
            default:
                return false;
        }
    }

    default FaultEvent toFaultEvent() {
        return new FaultEventImpl(getMessage(), FaultEventLevel.NEVER, getStackTrace());
    }
}
