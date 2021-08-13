/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import java.util.Map;
import javax.annotation.Nullable;

public interface EtlData {

    @Nullable
    Long getId();

    String getGate();

    byte[] getData();

    String getContentType();

    Map<String, String> getMeta();

}
