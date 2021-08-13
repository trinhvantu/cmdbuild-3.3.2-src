package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
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
import static javax.ws.rs.core.MediaType.APPLICATION_OCTET_STREAM;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.uicomponents.custompage.CustomPageService;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILE;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import javax.annotation.security.RolesAllowed;
import org.cmdbuild.uicomponents.UiComponentInfoImpl;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_UICOMPONENTS_MODIFY_AUTHORITY;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import static org.cmdbuild.service.rest.common.utils.WsRequestUtils.isAdminViewMode;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.VIEW_MODE_HEADER_PARAM;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.EXTENSION;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.PARAMETERS;
import org.cmdbuild.translation.ObjectTranslationService;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import org.cmdbuild.uicomponents.UiComponentInfo;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;

@Path("custompages/")
@Produces(APPLICATION_JSON)
public class CustomPageWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final CustomPageService service;
    private final ObjectTranslationService translationService;

    public CustomPageWs(CustomPageService customPageService, ObjectTranslationService translationService) {
        this.service = checkNotNull(customPageService);
        this.translationService = checkNotNull(translationService);
    }

    @GET
    @Path(EMPTY)
    public Object list(@HeaderParam(VIEW_MODE_HEADER_PARAM) String viewMode) {
        logger.debug("list all custom pages for current user");
        List<UiComponentInfo> list = isAdminViewMode(viewMode) ? service.getAllForCurrentUser() : service.getActiveForCurrentUserAndDevice();
        return response(list.stream().map(this::serializeCustomPage));
    }

    @GET
    @Path("{id}")
    public Object get(@PathParam("id") Long id) {
        UiComponentInfo customPage = service.get(id);
        return toResponse(customPage);
    }

    @DELETE
    @Path("{id}")
    @RolesAllowed(ADMIN_UICOMPONENTS_MODIFY_AUTHORITY)
    public Object delete(@PathParam("id") Long id) {
        service.delete(id);
        return success();
    }

    @POST
    @Path(EMPTY)
    @RolesAllowed(ADMIN_UICOMPONENTS_MODIFY_AUTHORITY)
    public Object create(@Multipart(FILE) DataHandler dataHandler, @QueryParam("merge") @DefaultValue(FALSE) Boolean merge, @Multipart(value = "data", required = false) @Nullable WsCustomPageData data) {
        UiComponentInfo customPage;
        if (merge) {
            customPage = service.createOrUpdate(toByteArray(dataHandler));
        } else {
            customPage = service.create(toByteArray(dataHandler));
        }
        customPage = UiComponentInfoImpl.copyOf(customPage).accept(b -> {
            if (data != null) {
                b.withDescription(data.description).withActive(data.isActive).withTargetDevice(data.targetDevice);
            }
        }).build();
        return toResponse(service.update(customPage));
    }

    @PUT
    @Path("{id}")
    @RolesAllowed(ADMIN_UICOMPONENTS_MODIFY_AUTHORITY)
    public Object update(@PathParam("id") Long id, @Multipart(value = FILE, required = false) DataHandler dataHandler, @Nullable WsCustomPageData data) {
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

    @GET
    @Path("{id}/{file}")
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler download(@PathParam("id") Long id, @QueryParam(EXTENSION) String extension, @QueryParam(PARAMETERS) String parametersStr) {
        UiComponentInfo customPage = service.get(id);
        return service.getCustomPageData(customPage.getName());
    }

    private Object toResponse(UiComponentInfo customPage) {
        return response(serializeCustomPage(customPage));
    }

    private Object serializeCustomPage(UiComponentInfo customPage) {
        return map(
                "_id", customPage.getId(),
                "active", customPage.getActive(),
                "name", customPage.getName(),
                "description", customPage.getDescription(),
                "_description_translation", translationService.translateCustomPageDesciption(customPage.getName(), customPage.getDescription()),
                "alias", customPage.getExtjsAlias(),
                "componentId", customPage.getExtjsComponentId(),
                "device", serializeEnum(customPage.getTargetDevice()));
    }

    public static class WsCustomPageData {

        private final String description;
        private final boolean isActive;
        private final TargetDevice targetDevice;

        public WsCustomPageData(
                @JsonProperty("description") String description,
                @JsonProperty("device") String targetDevice,
                @JsonProperty("active") boolean active) {
            this.description = description;
            this.isActive = active;
            this.targetDevice = parseEnumOrDefault(targetDevice, TD_DEFAULT);
        }

    }
}
