/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.workflow.core.fluentapi;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.Map;
import javax.activation.DataSource;
import org.cmdbuild.etl.gate.EtlGateService;
import org.springframework.stereotype.Component;

@Component
public class EtlApiImpl implements EtlApi {

    private final EtlGateService gateService;

    public EtlApiImpl(EtlGateService gateService) {
        this.gateService = checkNotNull(gateService);
    }

    @Override
    public void load(String gate, DataSource data, Map<String, String> meta) {
        gateService.receive(gate, data, meta);
    }

}
