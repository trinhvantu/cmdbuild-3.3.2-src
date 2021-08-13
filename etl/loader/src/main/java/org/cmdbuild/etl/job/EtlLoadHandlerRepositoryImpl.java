/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.job;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.Maps.uniqueIndex;
import java.util.List;
import java.util.Map;
import org.cmdbuild.etl.gate.inner.EtlGateHandlerType;
import org.springframework.stereotype.Component;

@Component
public class EtlLoadHandlerRepositoryImpl implements EtlLoadHandlerRepository {

    private final Map<EtlGateHandlerType, EtlLoadHandler> handlers;

    public EtlLoadHandlerRepositoryImpl(List<EtlLoadHandler> loaders) {
        this.handlers = uniqueIndex(loaders, EtlLoadHandler::getType);
    }

    @Override
    public EtlLoadHandler getHandler(EtlGateHandlerType type) {
        return checkNotNull(handlers.get(type), "handler not found for type =< %s >", type);
    }

}
