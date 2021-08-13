/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dms.cmis;

import static com.google.common.collect.Lists.transform;
import java.lang.invoke.MethodHandles;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.annotation.Nullable;
import org.apache.chemistry.opencmis.client.api.CmisObjectProperties;
import org.apache.chemistry.opencmis.client.api.Repository;
import org.apache.chemistry.opencmis.client.api.SessionFactory;
import org.apache.chemistry.opencmis.client.runtime.SessionFactoryImpl;
import static org.apache.chemistry.opencmis.commons.SessionParameter.ATOMPUB_URL;
import static org.apache.chemistry.opencmis.commons.SessionParameter.AUTH_HTTP_BASIC;
import static org.apache.chemistry.opencmis.commons.SessionParameter.BINDING_TYPE;
import static org.apache.chemistry.opencmis.commons.SessionParameter.CONNECT_TIMEOUT;
import static org.apache.chemistry.opencmis.commons.SessionParameter.PASSWORD;
import static org.apache.chemistry.opencmis.commons.SessionParameter.READ_TIMEOUT;
import static org.apache.chemistry.opencmis.commons.SessionParameter.USER;
import org.apache.chemistry.opencmis.commons.enums.BindingType;
import org.cmdbuild.exception.DmsException;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableString;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CmisDmsUtils {

    public static final String CMIS_DOCUMENT = "cmis:document",
            CMIS_FOLDER = "cmis:folder",
            CMIS_PROPERTY_AUTHOR = "cm:author",
            CMIS_PROPERTY_DESCRIPTION = "cm:description",
            CMIS_PROPERTY_CATEGORY = "cmdbuild:classification";

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static Repository getCmisRepository(CmisDmsRepositoryConfig repoConfig) {
        LOGGER.info("init dms (cmis) repository");
        try {
            SessionFactory sessionFactory = SessionFactoryImpl.newInstance();
            Map<String, String> parameters = map(
                    ATOMPUB_URL, checkNotBlank(repoConfig.getUrl(), "missing cmis url"),
                    BINDING_TYPE, BindingType.ATOMPUB.value(),
                    AUTH_HTTP_BASIC, "true",
                    USER, checkNotBlank(repoConfig.getUsername(), "missing cmis username"),
                    PASSWORD, checkNotBlank(repoConfig.getPassword(), "missing cmis password"),
                    CONNECT_TIMEOUT, Integer.toString(10000),
                    READ_TIMEOUT, Integer.toString(repoConfig.getReadTimeout()));
            LOGGER.debug("parameters for dms repository : \n\n{}\n", mapToLoggableString(parameters));
            List<Repository> repositories = sessionFactory.getRepositories(parameters);
            LOGGER.debug("got repository list = {}", transform(repositories, Repository::getId));
            Repository firstRepo = repositories.get(0);
            LOGGER.debug("selected repository = {}", firstRepo.getId());
            return firstRepo;
        } catch (Exception ex) {
            throw new DmsException(ex, "unable to open cmis repository");
        }
    }

    @Nullable
    public static String getProperty(CmisObjectProperties item, String property) {
        return Optional.ofNullable(item.getProperty(property)).map(p -> toStringOrNull(p.getValue())).orElse(null);
    }
}
