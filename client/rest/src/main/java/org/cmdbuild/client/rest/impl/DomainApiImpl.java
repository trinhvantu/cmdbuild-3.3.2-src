/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.impl;

import com.fasterxml.jackson.databind.JsonNode;
import org.cmdbuild.client.rest.core.RestWsClient;
import org.cmdbuild.client.rest.core.AbstractServiceClientImpl;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.client.rest.api.DomainApi;
import org.cmdbuild.client.rest.model.DomainInfo;
import org.cmdbuild.dao.entrytype.DomainDefinition;
import static org.cmdbuild.dao.utils.DomainUtils.serializeDomainCardinality;

public class DomainApiImpl extends AbstractServiceClientImpl implements DomainApi {

    public DomainApiImpl(RestWsClient restClient) {
        super(restClient);
    }

    @Override
    public DomainInfo create(DomainDefinition domain) {
        JsonNode response = post("domains/", map(
                "name", domain.getName(),
                "source", domain.getSourceClassName(),
                "destination", domain.getTargetClassName(),
                "cardinality", serializeDomainCardinality(domain.getMetadata().getCardinality()),
                "active", domain.getMetadata().isActive()
        //TODO other params
        )).asJackson();
        return new DomainInfoImpl(response.get("data").get("name").asText());
    }

    private static class DomainInfoImpl implements DomainInfo {

        final String name;

        public DomainInfoImpl(String name) {
            this.name = checkNotBlank(name);
        }

        @Override
        public String getName() {
            return name;
        }

    }

}
