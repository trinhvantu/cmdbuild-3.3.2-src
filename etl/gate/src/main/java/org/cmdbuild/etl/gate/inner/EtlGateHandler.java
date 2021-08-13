/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import static com.google.common.base.Objects.equal;
import com.google.common.base.Preconditions;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.Iterables;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import org.cmdbuild.utils.lang.CmNullableUtils;

public interface EtlGateHandler {

    final String ETL_HANDLER_CONFIG_TYPE = "type", ETL_HANDLER_CONFIG_TEMPLATES = "templates", ETL_HANDLER_CONFIG_SCRIPT = "script";

    EtlGateHandlerType getType();

    List<String> getTemplates();

    @Nullable
    String getScript();

    Map<String, String> getConfig();

    @Nullable
    default String getConfig(String key) {
        return getConfig().get(key);
    }

    default String getTemplate() {
        Preconditions.checkArgument(hasSingleTemplate(), "this gate does not have a single template");
        return Iterables.getOnlyElement(getTemplates());
    }

    default boolean hasScript() {
        return CmNullableUtils.isNotBlank(getScript());
    }

    default boolean hasSingleTemplate() {
        return getTemplates().size() == 1;
    }

    default boolean isOfType(EtlGateHandlerType type) {
        return equal(checkNotNull(type), getType());
    }

}
