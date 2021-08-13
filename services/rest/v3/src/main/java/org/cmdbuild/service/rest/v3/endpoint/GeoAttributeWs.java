package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import static com.google.common.base.Objects.equal;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.ImmutableList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import static java.util.stream.Collectors.toList;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.common.utils.PagedElements;
import static org.cmdbuild.common.utils.PagedElements.paged;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.gis.GisService;

import org.cmdbuild.gis.GisAttributeImpl;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import org.cmdbuild.gis.GisAttribute;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.ATTRIBUTE;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.DETAILED;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.LIMIT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.START;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import org.cmdbuild.easyupload.EasyuploadItem;
import org.cmdbuild.easyupload.EasyuploadService;
import org.cmdbuild.gis.GisAttributeImpl.GisAttributeImplBuilder;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.CLASS_ID;
import static org.cmdbuild.utils.json.CmJsonUtils.MAP_OF_OBJECTS;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.HeaderParam;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_GIS_MODIFY_AUTHORITY;
import org.cmdbuild.classe.access.UserClassService;
import org.cmdbuild.gis.GisAttributeType;
import static org.cmdbuild.service.rest.common.utils.WsRequestUtils.isAdminViewMode;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.VIEW_MODE_HEADER_PARAM;
import org.cmdbuild.utils.date.CmDateUtils;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;

@Path("{a:processes|classes}/{" + CLASS_ID + "}/geoattributes/")
@Produces(APPLICATION_JSON)
public class GeoAttributeWs {

    private final static String TYPE_GEOMETRY = "geometry";

    private final GisService service;
    private final EasyuploadService easyuploadService;
    private final UserClassService userClassService;

    public GeoAttributeWs(GisService service, EasyuploadService easyuploadService, UserClassService userClassService) {
        this.service = checkNotNull(service);
        this.easyuploadService = checkNotNull(easyuploadService);
        this.userClassService = checkNotNull(userClassService);
    }

    @GET
    @Path(EMPTY)
    public Object readAllAttributes(
            @HeaderParam(VIEW_MODE_HEADER_PARAM) String viewMode,
            @PathParam(CLASS_ID) String classId,
            @QueryParam(START) Integer offset,
            @QueryParam(LIMIT) Integer limit,
            @QueryParam(DETAILED) @DefaultValue(FALSE) Boolean detailed,
            @QueryParam("visible") @DefaultValue(FALSE) Boolean visible) {
        List<GisAttribute> elements;
        if (equal(classId, "_ANY")) {
            elements = service.getGisAttributes();
        } else if (visible) {
            elements = service.getGisAttributesVisibleFromClass(classId);
        } else {
            elements = service.getGisAttributesByOwnerClassIncludeInherited(classId);
        }
        PagedElements<GisAttribute> paged = paged(elements, offset, limit);
        if (isAdminViewMode(viewMode)) {
            return response(paged.stream().map(this::serializeGisAttribute).collect(toList()), paged.totalSize());
        } else {
            List<Object> filteredAttributes = paged.stream().filter((a) -> userClassService.isActiveAndUserCanRead(a.getOwnerClassName()) && a.isActive())
                    .map(this::serializeGisAttribute).collect(toList());
            return response(filteredAttributes, filteredAttributes.size());
        }
    }

    @POST
    @Path("order")
    @RolesAllowed(ADMIN_GIS_MODIFY_AUTHORITY)
    public Object reorder(@PathParam(CLASS_ID) String classId, List<Long> attrOrder) {
        checkArgument(equal(classId, "_ANY"), "service available only for _ANY classes");
        List<GisAttribute> attrs = service.updateGisAttributesOrder(attrOrder);
        return response(attrs.stream().map(this::serializeGisAttribute));
    }

    @GET
    @Path("{" + ATTRIBUTE + "}/")
    public Object readAttribute(@PathParam(CLASS_ID) String classId, @PathParam(ATTRIBUTE) String attributeId) {
        GisAttribute layer = service.getGisAttributeByClassAndNameOrId(classId, attributeId);
        return response(serializeGisAttribute(layer));
    }

    @POST
    @Path(EMPTY)
    @RolesAllowed(ADMIN_GIS_MODIFY_AUTHORITY)
    public Object create(@PathParam(CLASS_ID) String classId, WsGeoAttribute attributeData) {
        GisAttribute layer = toGisAttribute(attributeData, classId).build();
        layer = service.createGisAttribute(layer);
        return response(serializeGisAttribute(layer));
    }

    @POST
    @Path("visibility")
    @RolesAllowed(ADMIN_GIS_MODIFY_AUTHORITY)
    public Object updateVisibility(@PathParam(CLASS_ID) String classId, List<Long> geoAttributes) {
        service.updateGeoAttributesVisibilityForClass(classId, geoAttributes);
        return response(list(service.getGisAttributesVisibleFromClass(classId)).map(this::serializeGisAttribute));
    }

    @PUT
    @Path("{" + ATTRIBUTE + "}/")
    @RolesAllowed(ADMIN_GIS_MODIFY_AUTHORITY)
    public Object update(@PathParam(CLASS_ID) String classId, @PathParam(ATTRIBUTE) String attributeId, WsGeoAttribute attributeData) {
        GisAttribute layer = toGisAttribute(attributeData, classId).withId(service.getGisAttributeByClassAndNameOrId(classId, attributeId).getId()).build();
        layer = service.updateGisAttribute(layer);
        return response(serializeGisAttribute(layer));
    }

    @DELETE
    @Path("{" + ATTRIBUTE + "}/")
    @RolesAllowed(ADMIN_GIS_MODIFY_AUTHORITY)
    public Object delete(@PathParam(CLASS_ID) String classId, @PathParam(ATTRIBUTE) String attributeId) {
        service.deleteGisAttribute(classId, service.getGisAttributeByClassAndNameOrId(classId, attributeId).getLayerName());
        return success();
    }

    private Object serializeGisAttribute(GisAttribute layer) {
        Map<String, Object> styleMap = map((Map<String, Object>) fromJson(layer.getMapStyle(), MAP_OF_OBJECTS));
        return map(
                "_id", layer.getId(),
                "name", layer.getLayerName(),
                "owner_type", layer.getOwnerClassName(),
                "active", layer.isActive(),
                "type", layer.isPostgis() ? TYPE_GEOMETRY : serializeEnum(layer.getType()),
                "subtype", serializeEnum(layer.getType()),
                "description", layer.getDescription(),
                "index", layer.getIndex(),
                "visibility", list(layer.getVisibility()),
                "zoomMin", layer.getMinimumZoom(),
                "zoomMax", layer.getMaximumZoom(),
                "zoomDef", layer.getDefaultZoom(),
                "_beginDate", CmDateUtils.toIsoDateTime(layer.getBeginDate()),
                "_is_geometry", layer.isPostgis(),
                "_is_coverage", layer.isGeoserver(),
                "style", map(styleMap).withoutKeys("externalGraphic")).accept((m) -> {
            String icon = toStringOrNull(styleMap.get("externalGraphic"));
            if (isNotBlank(icon)) {
                m.put("_icon", Optional.ofNullable(easyuploadService.getByPathOrNull(icon)).map(EasyuploadItem::getId).orElse(null));
            }
        });
    }

    private GisAttributeImplBuilder toGisAttribute(WsGeoAttribute data, String classId) {
        return data.toGisAttribute().withOwnerClassName(classId).accept((b) -> {
            Map<String, Object> styleMap = map(data.style);
            if (isNotNullAndGtZero(data.icon)) {
                styleMap.put("externalGraphic", easyuploadService.getById(data.icon).getPath());
            }
            b.withMapStyle(toJson(styleMap));
        });
    }

    public static class WsGeoAttribute {

        private final String name;
        private final Long icon;
        private final String description;
        private final GisAttributeType type;
        private final boolean active;
        private final Integer index, zoomMin, zoomDef, zoomMax;
        private final List<String> visibility;
        private final Map<String, Object> style;

        public WsGeoAttribute(
                @JsonProperty("_icon") Long icon,
                @JsonProperty("name") String name,
                @JsonProperty("description") String description,
                @JsonProperty("active") boolean active,
                @JsonProperty("type") String type,
                @JsonProperty("subtype") String subtype,
                @JsonProperty("index") Integer index,
                @JsonProperty("zoomMin") Integer zoomMin,
                @JsonProperty("zoomDef") Integer zoomDef,
                @JsonProperty("zoomMax") Integer zoomMax,
                @JsonProperty("visibility") List<String> visibility,
                @JsonProperty("style") Map<String, Object> style) {
            this.icon = icon;
            this.name = name;
            this.description = description;
            this.active = active;
            this.type = parseEnum(equal(type, TYPE_GEOMETRY) ? subtype : type, GisAttributeType.class);
            this.index = index;
            this.zoomMin = zoomMin;
            this.zoomDef = zoomDef;
            this.zoomMax = zoomMax;
            this.visibility = ImmutableList.copyOf(visibility);
            this.style = map(style).immutable();
        }

        public GisAttributeImplBuilder toGisAttribute() {
            return GisAttributeImpl.builder()
                    .withLayerName(name)
                    .withDescription(description)
                    .withActive(active)
                    .withType(type)
                    .withIndex(index)
                    .withMinimumZoom(zoomMin)
                    .withDefaultZoom(zoomDef)
                    .withMaximumZoom(zoomMax)
                    .withVisibility(set(visibility));
        }

    }
}
