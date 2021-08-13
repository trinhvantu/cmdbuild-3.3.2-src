/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.sysmon;

import java.time.ZonedDateTime;
import java.util.List;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import org.cmdbuild.utils.date.Interval;

public interface SysmonRepository {

    void store(SystemStatusLog systemStatusRecord);

    List<SystemStatusLog> getRecordsSince(ZonedDateTime since);

    default List<SystemStatusLog> getRecentRecords(Interval interval) {
        ZonedDateTime since = now().minus(interval.toDuration());
        return getRecordsSince(since);
    }

}
