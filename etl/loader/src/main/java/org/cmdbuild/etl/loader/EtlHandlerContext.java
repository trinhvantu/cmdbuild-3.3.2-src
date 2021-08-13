/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import java.util.Map;
import javax.annotation.Nullable;

public interface EtlHandlerContext<T> {

    @Nullable
    T getData();

    Map<String, String> getMeta();

    default boolean hasEtlProcessingResult() {
        return getData() instanceof EtlProcessingResult;
    }

    default EtlProcessingResult getEtlProcessingResult() {
        return (EtlProcessingResult) getData();
    }

    default boolean hasData() {
        return getData() != null;
    }

}
