/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

public interface EtlDataRepository {

    long create(EtlData data);

    EtlData getById(long id);

}
