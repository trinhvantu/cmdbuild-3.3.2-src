/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.api;

import org.cmdbuild.client.rest.model.RelationInfo;
import java.util.List;
import org.cmdbuild.common.beans.CardIdAndClassName;

public interface RelationApi {

    RelationInfo createRelation(String domain, CardIdAndClassName source, CardIdAndClassName destination);

    List<RelationInfo> getRelationsForCard(CardIdAndClassName card);

}
