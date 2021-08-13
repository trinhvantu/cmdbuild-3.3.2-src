/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.api;

import java.util.List;
import org.cmdbuild.client.rest.model.AttributeData;
import org.cmdbuild.client.rest.model.AttributeRequestData;
import org.cmdbuild.client.rest.model.ClassData;
import org.cmdbuild.dao.entrytype.ClassDefinition;

public interface ClassApi {

    ClassData getById(String classeId);

    String getRawJsonById(String classId);

    List<ClassData> getAll();

    ClassData create(ClassData data);

    ClassData create(ClassDefinition data);

    ClassApiWithClassData update(ClassData data);

    ClassApiWithClassData update(String classId, String rawJsonData);

    ClassApi deleteById(String classeId);

    List<AttributeData> getAttributes(String classId);

    ClassApiWithAttrData createAttr(String classId, AttributeRequestData data);

    ClassApiWithAttrData updateAttr(String classId, AttributeRequestData data);

    ClassApi deleteAttr(String classId, String attrId);

    AttributeData getAttr(String classId, String attrId);

    interface ClassApiWithClassData {

        ClassApi then();

        ClassData getClasse();
    }

    interface ClassApiWithAttrData {

        ClassApi then();

        AttributeData getAttr();
    }
}
