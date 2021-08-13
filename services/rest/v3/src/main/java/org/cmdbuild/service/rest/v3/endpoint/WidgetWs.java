package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.MULTIPART_FORM_DATA;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.security.RolesAllowed;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_UICOMPONENTS_MODIFY_AUTHORITY;
import static org.cmdbuild.service.rest.common.utils.WsRequestUtils.isAdminViewMode;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.EXTENSION;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILE;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.PARAMETERS;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.VIEW_MODE_HEADER_PARAM;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import org.cmdbuild.uicomponents.UiComponentInfo;
import org.cmdbuild.uicomponents.UiComponentInfoImpl;
import org.cmdbuild.uicomponents.widget.WidgetComponentService;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmMapUtils.map;

@Path("components/widget")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
public class WidgetWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final WidgetComponentService service;

    public WidgetWs(WidgetComponentService service) {
        this.service = checkNotNull(service);
    }

    @GET
    @Path(EMPTY)
    public Object list(@HeaderParam(VIEW_MODE_HEADER_PARAM) String viewMode) {//TODO fix this, make admin only (??); see ContextMenuComponentWs
        logger.debug("list all widget components for current user");
        List<UiComponentInfo> list = isAdminViewMode(viewMode) ? service.getAll() : service.getActiveForCurrentUserAndDevice();
        return response(list.stream().map(this::serializeInfo));
    }

    @GET
    @Path("{id}")
    public Object get(@PathParam("id") Long id) {
        UiComponentInfo customMenuComponent = service.get(id);
        return toResponse(customMenuComponent);
    }

    @DELETE
    @Path("{id}")
    @RolesAllowed(ADMIN_UICOMPONENTS_MODIFY_AUTHORITY)
    public Object delete(@PathParam("id") Long id) {
        service.delete(id);
        return success();
    }

    @GET
    @Path("{id}/{file}")
    @Produces(ADMIN_UICOMPONENTS_MODIFY_AUTHORITY)
    public DataHandler download(@PathParam("id") Long id, @QueryParam(EXTENSION) String extension, @QueryParam(PARAMETERS) String parametersStr) {
        UiComponentInfo widgetComponent = service.get(id);
        return service.getWidgetData(widgetComponent.getName());
    }

    @POST
    @Path(EMPTY)
    @Consumes(MULTIPART_FORM_DATA)
    @RolesAllowed(ADMIN_UICOMPONENTS_MODIFY_AUTHORITY)
    public Object create(@Multipart(FILE) DataHandler dataHandler, @QueryParam("merge") @DefaultValue(FALSE) Boolean merge, @Multipart(value = "data", required = false) @Nullable WsWidgetComponentData data) {
        UiComponentInfo info;
        if (merge) {
            info = service.createOrUpdate(toByteArray(dataHandler));
        } else {
            info = service.create(toByteArray(dataHandler));
        }
        info = UiComponentInfoImpl.copyOf(info).accept(b -> {
            if (data != null) {
                b.withDescription(data.description).withActive(data.isActive).withTargetDevice(data.targetDevice);
            }
        }).build();
        return toResponse(service.update(info));
    }

    @PUT
    @Path("{id}")
    @RolesAllowed(ADMIN_UICOMPONENTS_MODIFY_AUTHORITY)
    public Object update(@PathParam("id") Long id, @Nullable WsWidgetComponentData data, @Multipart(value = FILE, required = false) DataHandler dataHandler) {
        UiComponentInfo component = service.get(id);
        checkArgument(dataHandler != null || data != null, "missing data");
        if (dataHandler != null) {
            component = service.update(id, toByteArray(dataHandler));
        }
        if (data != null) {
            component = service.update(UiComponentInfoImpl.copyOf(component).withDescription(data.description).withActive(data.isActive).withTargetDevice(data.targetDevice).build());
        }
        return toResponse(component);
    }

    private Object toResponse(UiComponentInfo widgetComponent) {
        return response(serializeInfo(widgetComponent));
    }

    private Object serializeInfo(UiComponentInfo widgetComponent) {
        return map(
                "_id", widgetComponent.getId(),
                "active", widgetComponent.getActive(),
                "name", widgetComponent.getName(),
                "description", widgetComponent.getDescription(),
                "alias", widgetComponent.getExtjsAlias(),
                "componentId", widgetComponent.getExtjsComponentId(),
                "device", serializeEnum(widgetComponent.getTargetDevice()));
    }

    public static class WsWidgetComponentData {

        private final String description;
        private final Boolean isActive;
        private final TargetDevice targetDevice;

        public WsWidgetComponentData(@JsonProperty("description") String description, @JsonProperty("device") String targetDevice, @JsonProperty("active") Boolean isActive) {
            this.description = description;
            this.isActive = isActive;
            this.targetDevice = parseEnumOrDefault(targetDevice, TD_DEFAULT);
        }

    }
}
