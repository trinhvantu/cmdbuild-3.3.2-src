/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.workflow.core.fluentapi;

import static java.util.Collections.emptyMap;
import java.util.Map;
import javax.activation.DataSource;
import static org.cmdbuild.utils.io.CmIoUtils.isUrl;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSourceFromUrl;

public interface EtlApi {

    void load(String gate, DataSource data, Map<String, String> meta);

    default void load(String gate, Map<String, String> meta) {
        load(gate, "", meta);
    }

    default void load(String gate, DataSource data) {
        load(gate, data, emptyMap());
    }

    default void load(String gate, byte[] data, Map<String, String> meta) {
        load(gate, newDataSource(data), meta);
    }

    default void load(String gate, byte[] data) {
        load(gate, newDataSource(data));
    }

    default void load(String gate, String data) {
        load(gate, data, emptyMap());
    }

    default void load(String gate, String data, Map<String, String> meta) {
        if (isUrl(data)) {
            load(gate, newDataSourceFromUrl(data), meta);
        } else {
            load(gate, newDataSource(data), meta);
        }
    }

}
