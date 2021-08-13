/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.service.rest.v3.endpoint;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.lang.Long.parseLong;
import java.util.List;
import java.util.Map;
import javax.activation.DataHandler;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.gis.GeoserverLayer;
import org.cmdbuild.gis.GisService;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.CARD_ID;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.ZOOM_DEF;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.ZOOM_MAX;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.ZOOM_MIN;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.CLASS_ID;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILE;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import javax.annotation.security.RolesAllowed;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_GIS_MODIFY_AUTHORITY;
import org.cmdbuild.auth.user.OperationUserSupplier;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.utils.AttributeFilterProcessor;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.FilterType;
import org.cmdbuild.data.filter.utils.CmdbFilterUtils;
import org.cmdbuild.gis.GisAttribute;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILTER;
import org.cmdbuild.utils.date.CmDateUtils;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("{a:processes|classes}/{" + CLASS_ID + "}/{b:cards|instances}/{" + CARD_ID + "}/geolayers/")
@Produces(APPLICATION_JSON)
public class GeoserverLayerWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final OperationUserSupplier user;
    private final GisService service;
    private final DaoService dao;

    public GeoserverLayerWs(OperationUserSupplier user, GisService service, DaoService dao) {
        this.user = checkNotNull(user);
        this.service = checkNotNull(service);
        this.dao = checkNotNull(dao);
    }

    @GET
    @Path("{attrName}/")
    public Object getOneForCard(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, @PathParam("attrName") String layerCodeOrId) {
        GeoserverLayer geoServerLayer = service.getGeoserverLayer(classId, layerCodeOrId, cardId);//TODO add access control
        return response(serializeLayer(geoServerLayer));
    }

    @GET
    @Path("")
    public Object getMany(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) String cardId, @QueryParam(FILTER) String filterStr, @QueryParam("visible") @DefaultValue(FALSE) Boolean isVisible) {
        List list;
        if (equal(classId, "_ANY") && equal(cardId, "_ANY")) {
            //TODO improve this
            list = service.getGeoServerLayers().stream().filter(l -> user.hasPrivileges((p) -> p.hasReadAccess(dao.getClasse(l.getOwnerClass())))).collect(toImmutableList());
        } else {
            //TODO add access control
            list = service.getGeoServerLayersForCard(classId, parseLong(cardId));
        }
        list = list(list).map(l -> serializeLayer((GeoserverLayer) l));
        CmdbFilter filter = CmdbFilterUtils.parseFilter(filterStr);
        filter.checkHasOnlySupportedFilterTypes(FilterType.ATTRIBUTE);
        if (filter.hasAttributeFilter()) {
            list = AttributeFilterProcessor.<Map<String, Object>>builder().withKeyToValueFunction((k, m) -> toStringOrNull(m.get(k))).withFilter(filter.getAttributeFilter()).filter(list);
        }
        return response(list);
    }

    @PUT
    @Path("{attrName}/")
    @RolesAllowed(ADMIN_GIS_MODIFY_AUTHORITY)//TODO remove this
    public Object update(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, @PathParam("attrName") String attrName, @Multipart(FILE) DataHandler dataHandler) {
        GeoserverLayer layer = service.setGeoserverLayer(classId, attrName, cardId, dataHandler);//TODO add user access control
        return response(serializeLayer(layer));
    }

    @DELETE
    @Path("{attrName}/")
    @RolesAllowed(ADMIN_GIS_MODIFY_AUTHORITY)//TODO remove this
    public Object delete(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, @PathParam("attrName") String attrName) {
        service.deleteGeoServerLayer(classId, attrName, cardId);//TODO add user access control
        return success();
    }

    private FluentMap serializeLayer(GeoserverLayer l) {
        GisAttribute a = service.getGisAttributeIncludeInherited(l.getOwnerClass(), l.getAttributeName());
        return map(
                "_id", l.getId(),
                "name", a.getLayerName(),
                "attribute_id", a.getId(),
                "owner_type", a.getOwnerClassName(),
                "active", a.isActive(),
                "type", serializeEnum(a.getType()),
                "description", a.getDescription(),
                "index", a.getIndex(),
                "geoserver_name", l.getGeoserverLayer(),//TODO rename this, then remove
                "geoserver_store", l.getGeoserverStore(),
                "geoserver_layer", l.getGeoserverLayer(),
                "description", a.getDescription(),
                "_owner_description", dao.getCard(l.getOwnerCard()).getDescription(),
                ZOOM_MIN, a.getMinimumZoom(),
                ZOOM_DEF, a.getDefaultZoom(),
                ZOOM_MAX, a.getMaximumZoom(),
                "visibility", a.getVisibility(),
                "owner_type", l.getOwnerClass(),
                "owner_id", l.getOwnerCard(),
                "_beginDate", CmDateUtils.toIsoDateTime(l.getBeginDate()));
    }
}
