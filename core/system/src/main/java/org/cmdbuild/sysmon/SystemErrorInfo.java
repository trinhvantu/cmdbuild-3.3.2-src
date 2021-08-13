/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.sysmon;

import java.time.ZonedDateTime;
import org.cmdbuild.fault.FaultEventLevel;

public interface SystemErrorInfo {

    FaultEventLevel getLevel();

    String getMessage();

    String getCategory();

    String getSource();

    ZonedDateTime getTimestamp();
}
