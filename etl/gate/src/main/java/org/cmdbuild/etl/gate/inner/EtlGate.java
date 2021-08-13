/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import static com.google.common.collect.Iterables.getOnlyElement;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.annotation.Nullable;
import static org.cmdbuild.auth.grant.PrivilegeSubject.privilegeId;
import org.cmdbuild.auth.grant.PrivilegeSubjectWithInfo;
import static org.cmdbuild.etl.gate.inner.EtlGateHandler.ETL_HANDLER_CONFIG_TEMPLATES;
import static org.cmdbuild.etl.gate.inner.EtlGateHandlerType.ETLHT_SCRIPT;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmConvertUtils.toListOfStrings;

public interface EtlGate extends PrivilegeSubjectWithInfo {

    static final String ETL_GATE_DEFAULT_HANDLER = "default",
            ETL_GATE_CONFIG_SHOW_ON_CLASSES = "showOnClasses";

    @Nullable
    @Override
    Long getId();

    String getCode();

    @Override
    String getDescription();

    boolean getAllowPublicAccess();

    EtlProcessingMode getProcessingMode();

    Map<String, String> getConfig();

    boolean isEnabled();

    List<EtlGateHandler> getHandlers();

    @Override
    default String getName() {
        return getCode();
    }

    @Override
    default String getPrivilegeId() {
        return privilegeId(PS_ETLGATE, getId());
    }

    default String getOnlyScript() {
        EtlGateHandler handler = getHandlers().stream().filter(h -> h.isOfType(ETLHT_SCRIPT)).collect(onlyElement("script handler not found for this gate"));
        return handler.getScript();
    }

    default boolean hasSingleHandler() {
        return getHandlers().size() == 1;
    }

    default EtlGateHandler getSingleHandler() {
        return getOnlyElement(getHandlers());
    }

    default EtlGateHandlerType getSingleHandlerType() {
        return getSingleHandler().getType();
    }

    default Set<String> getShowOnClasses() {
        return set(toListOfStrings(getConfig().get(ETL_GATE_CONFIG_SHOW_ON_CLASSES)));
    }

    default Collection<String> getAllTemplates() {
        return set(toListOfStrings(getConfig().get(ETL_HANDLER_CONFIG_TEMPLATES))).accept(s -> getHandlers().stream().flatMap(h -> h.getTemplates().stream()).forEach(s::add));
    }

}
