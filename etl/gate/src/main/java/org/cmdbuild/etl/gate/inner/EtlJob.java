/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import java.time.ZonedDateTime;
import java.util.Map;
import javax.annotation.Nullable;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;

public interface EtlJob {

    @Nullable
    Long getId();

    String getGate();

    @Nullable
    Long getDataId();

    Map<String, String> getMeta();

    @Nullable
    ZonedDateTime getTimestamp();

    boolean isEnabled();

    default boolean hasData() {
        return isNotNullAndGtZero(getDataId());
    }
}
