/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import java.util.List;

public interface EtlTemplateRepository {

    List<EtlTemplate> getAll();

    List<EtlTemplate> getAllForTarget(EtlTemplateTarget type, String name);

    List<EtlTemplate> getAllForTargetClassAndRelatedDomains(String classId);

    EtlTemplate getOne(long templateId);

    EtlTemplate getTemplateByName(String templateName);

    EtlTemplate create(EtlTemplate template);

    EtlTemplate update(EtlTemplate template);

    void delete(long templateId);

}
