/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate;

import static java.util.Collections.emptyMap;
import java.util.Map;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import org.cmdbuild.etl.gate.inner.EtlGate;
import org.cmdbuild.etl.gate.inner.EtlGateRepository;

public interface EtlGateService extends EtlGateRepository {

    final String ETLGATE_REQUEST_PATH = "ETLGATE_REQUEST_PATH",
            ETLGATE_REQUEST_METHOD = "ETLGATE_REQUEST_METHOD";

    @Nullable
    DataSource receive(EtlGate gate, DataSource payload, Map<String, String> meta);

    @Nullable
    DataSource receive(String gate, DataSource payload, Map<String, String> meta);

    @Nullable
    default DataSource receive(EtlGate gate, DataSource payload) {
        return receive(gate, payload, emptyMap());
    }

    @Nullable
    default DataSource receive(String gate, DataSource payload) {
        return receive(gate, payload, emptyMap());
    }
}
