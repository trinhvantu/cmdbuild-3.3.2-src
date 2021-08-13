package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.annotation.JsonProperty;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.emptyToNull;
import static java.util.Collections.emptyList;
import java.util.List;
import java.util.Map;
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
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import org.cmdbuild.menu.Menu;
import org.cmdbuild.menu.MenuItemType;
import org.cmdbuild.menu.MenuService;
import org.cmdbuild.menu.MenuTreeNode;
import org.cmdbuild.menu.MenuTreeNodeImpl;
import org.cmdbuild.service.rest.v3.serializationhelpers.MenuSerializationHelper;
import static org.cmdbuild.service.rest.v3.serializationhelpers.MenuSerializationHelper.MENU_ITEM_TYPE_WS_MAP;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.random.CmRandomUtils.randomId;
import javax.annotation.security.RolesAllowed;

import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_MENUS_MODIFY_AUTHORITY;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_MENUS_VIEW_AUTHORITY;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.menu.MenuInfo;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.DETAILED;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;

@Path("menu/")
@Produces(APPLICATION_JSON)
@RolesAllowed(ADMIN_MENUS_VIEW_AUTHORITY)
public class MenuWs {

    private final MenuService menuService;
    private final MenuSerializationHelper helper;

    public MenuWs(MenuService menuService, MenuSerializationHelper helper) {
        this.menuService = checkNotNull(menuService);
        this.helper = checkNotNull(helper);
    }

    @GET
    @Path("")
    public Object readAll(@QueryParam(DETAILED) @DefaultValue(FALSE) Boolean detailed) {
        return response(menuService.getAllMenuInfos().stream().map(detailed ? (m) -> serializeDetailedMenu(menuService.getMenuById(m.getId())) : this::serializeBasicMenu).collect(toList()));
    }

    @GET
    @Path("/{menuId}")
    public Object read(@PathParam("menuId") Long menuId) {
        Menu menu = menuService.getMenuById(menuId);
        return menuResponse(menu);
    }

    @POST
    @Path("")
    @RolesAllowed(ADMIN_MENUS_MODIFY_AUTHORITY)
    public Object create(MenuRootNodeWsBean data) {
        Menu menu = menuService.create(data.groupName, toMenuTreeNode(data, true), data.targetDevice);
        return menuResponse(menu);
    }

    @PUT
    @Path("/{menuId}")
    @RolesAllowed(ADMIN_MENUS_MODIFY_AUTHORITY)
    public Object update(@PathParam("menuId") Long menuId, MenuRootNodeWsBean data) {
        Menu menu = menuService.update(menuId, toMenuTreeNode(data, false), data.targetDevice);
        return menuResponse(menu);
    }

    @DELETE
    @Path("/{menuId}")
    @RolesAllowed(ADMIN_MENUS_MODIFY_AUTHORITY)
    public Object delete(@PathParam("menuId") Long menuId) {
        menuService.delete(menuId);
        return success();
    }

    private MenuTreeNode toMenuTreeNode(MenuRootNodeWsBean data, boolean regenerateNodeCodes) {
        return MenuTreeNodeImpl.buildRoot(data.children.stream().map((n) -> toMenuTreeNode(n, regenerateNodeCodes)).collect(toList()));
    }

    private MenuTreeNode toMenuTreeNode(MenuNodeWsBean data, boolean regenerateNodeCodes) {
        return MenuTreeNodeImpl.builder()
                .withCode(regenerateNodeCodes ? randomId() : data.code)
                .withDescription(data.objectDescription)
                .withTarget(data.target)
                .withType(data.menuType)
                .withChildren(data.children.stream().map((n) -> toMenuTreeNode(n, regenerateNodeCodes)).collect(toList()))
                .build();
    }

    private Object menuResponse(Menu menu) {
        return response(serializeDetailedMenu(menu));
    }

    private Map serializeBasicMenu(MenuInfo menu) {
        return map("_id", menu.getId(), "group", menu.getGroup(), "device", serializeEnum(menu.getTargetDevice()));
    }

    private Object serializeDetailedMenu(Menu menu) {
        return map(helper.serializeMenu(menu)).with(serializeBasicMenu(menu));
    }

    public static class MenuRootNodeWsBean {

        public final String groupName;
        public final List<MenuNodeWsBean> children;
        public final TargetDevice targetDevice;

        public MenuRootNodeWsBean(
                @JsonProperty("device") String targetDevice,
                @JsonProperty("group") String groupName,
                @JsonProperty("children") List<MenuNodeWsBean> children) {
            this.groupName = checkNotBlank(groupName);
            this.children = firstNonNull(children, emptyList());
            this.targetDevice = parseEnumOrDefault(targetDevice, TD_DEFAULT);
        }

    }

    public static class MenuNodeWsBean {

        public final MenuItemType menuType;
        public final String target, objectDescription, code;
        public final List<MenuNodeWsBean> children;

        public MenuNodeWsBean(
                @JsonProperty("menuType") String menuType,
                @JsonProperty("objectTypeName") String target,
                @JsonProperty("_id") String code,
                @JsonProperty("objectDescription") String objectDescription,
                @JsonProperty("children") List<MenuNodeWsBean> children) {
            this.menuType = checkNotNull(MENU_ITEM_TYPE_WS_MAP.inverse().get(checkNotBlank(menuType)), "unknown menu type = '%s'", menuType);
            this.target = target;
            this.objectDescription = objectDescription;
            this.code = firstNonNull(emptyToNull(code), randomId());
            this.children = firstNonNull(children, emptyList());
        }

    }

}
