package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
import javax.ws.rs.Consumes;
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
import static javax.ws.rs.core.MediaType.APPLICATION_OCTET_STREAM;
import static javax.ws.rs.core.MediaType.MULTIPART_FORM_DATA;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILE;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import javax.annotation.security.RolesAllowed;
import org.cmdbuild.uicomponents.UiComponentInfoImpl;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_UICOMPONENTS_MODIFY_AUTHORITY;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_UICOMPONENTS_VIEW_AUTHORITY;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.uicomponents.contextmenu.ContextMenuComponentService;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.EXTENSION;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.PARAMETERS;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import org.cmdbuild.uicomponents.UiComponentInfo;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;

@Path("components/contextmenu")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
public class ContextMenuComponentWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ContextMenuComponentService service;

    public ContextMenuComponentWs(ContextMenuComponentService service) {
        this.service = checkNotNull(service);
    }

    @GET
    @Path(EMPTY)
    @RolesAllowed(ADMIN_UICOMPONENTS_VIEW_AUTHORITY)
    public Object list() {
        return response(service.getAll().stream().map(this::serializeInfo));
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
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler download(@PathParam("id") Long id, @QueryParam(EXTENSION) String extension, @QueryParam(PARAMETERS) String parametersStr) {
        UiComponentInfo customMenuComponent = service.get(id);
        return service.getContextMenuData(customMenuComponent.getName());
    }

    @POST
    @Path(EMPTY)
    @Consumes(MULTIPART_FORM_DATA)
    @RolesAllowed(ADMIN_UICOMPONENTS_MODIFY_AUTHORITY)
    public Object create(@Multipart(FILE) DataHandler dataHandler, @QueryParam("merge") @DefaultValue(FALSE) Boolean merge, @Multipart(value = "data", required = false) @Nullable WsContextMenuComponentData data) {
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
    public Object update(@PathParam("id") Long id, @Multipart(value = FILE, required = false) DataHandler dataHandler, @Nullable WsContextMenuComponentData data) {
        UiComponentInfo contextMenuComponent = service.get(id);
        checkArgument(dataHandler != null || data != null, "missing data");
        if (dataHandler != null) {
            contextMenuComponent = service.update(id, toByteArray(dataHandler));
        }
        if (data != null) {
            contextMenuComponent = service.update(UiComponentInfoImpl.copyOf(contextMenuComponent).withDescription(data.description).withActive(data.isActive).withTargetDevice(data.targetDevice).build());
        }
        return toResponse(contextMenuComponent);
    }

    private Object toResponse(UiComponentInfo customPage) {
        return response(serializeInfo(customPage));
    }

    private Object serializeInfo(UiComponentInfo customPage) {
        return map(
                "_id", customPage.getId(),
                "active", customPage.getActive(),
                "name", customPage.getName(),
                "description", customPage.getDescription(),
                "alias", customPage.getExtjsAlias(),
                "componentId", customPage.getExtjsComponentId(),
                "device", serializeEnum(customPage.getTargetDevice()));
    }

    public static class WsContextMenuComponentData {

        private final String description;
        private final Boolean isActive;
        private final TargetDevice targetDevice;

        public WsContextMenuComponentData(@JsonProperty("description") String description, @JsonProperty("device") String targetDevice, @JsonProperty("active") Boolean isActive) {
            this.description = description;
            this.isActive = isActive;
            this.targetDevice = parseEnumOrDefault(targetDevice, TD_DEFAULT);
        }

    }
}
