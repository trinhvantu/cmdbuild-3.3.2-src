/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.job;

import org.cmdbuild.etl.gate.inner.EtlGateHandlerType;

public interface EtlLoadHandlerRepository {

    EtlLoadHandler getHandler(EtlGateHandlerType name);
}
