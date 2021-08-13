package org.cmdbuild.service.rest.v2.endpoint;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.emptyToNull;
import java.util.concurrent.atomic.AtomicInteger;
import static java.util.stream.Collectors.toList;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import org.cmdbuild.dashboard.DashboardService;
import org.cmdbuild.menu.Menu;
import org.cmdbuild.menu.MenuService;
import org.cmdbuild.menu.MenuTreeNode;
import org.cmdbuild.report.ReportService;
import static org.cmdbuild.service.rest.v3.serializationhelpers.MenuSerializationHelper.MENU_ITEM_TYPE_WS_MAP;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.view.ViewService;

@Path("menu/")
@Produces(APPLICATION_JSON)
public class MenuWsV2 {

    private final MenuService menuService;
    private final ReportService reportService;
    private final DashboardService dashboardService;
    private final ViewService viewService;

    private AtomicInteger index;

    public MenuWsV2(MenuService menuService, ReportService reportService, DashboardService dashboardService, ViewService viewService) {
        this.menuService = checkNotNull(menuService);
        this.reportService = checkNotNull(reportService);
        this.dashboardService = checkNotNull(dashboardService);
        this.viewService = checkNotNull(viewService);
    }

    @GET
    @Path(EMPTY)
    public Object read() {
        index = new AtomicInteger(-1);
        Menu menuForCurrentUser = menuService.getMenuForCurrentUser();
        return map("success", true, "data", serializeMenuTree(menuForCurrentUser), "meta", map());
    }

    public FluentMap serializeMenuTree(Menu menu) {
        return serializeMenuItemAndChilds(menu.getRootNode());
    }

    private FluentMap serializeMenuItemAndChilds(MenuTreeNode item) {
        return serializeMenuItem(item).with("index", index.incrementAndGet()).with("children", item.getChildren().stream().map((i) -> serializeMenuItemAndChilds(i).with("index", index.incrementAndGet())).collect(toList()));
    }

    private FluentMap serializeMenuItem(MenuTreeNode item) {
        return map(
                "specificTypeValues", "",
                "objectDescription", item.getDescription(),
                "menuType", checkNotNull(MENU_ITEM_TYPE_WS_MAP.get(item.getType())),
                "referencedElementId", emptyToNull(item.getTarget()) == null ? 0 : item.getTarget(),
                "uuid", item.getCode()
        ).skipNullValues().with("referencedClassName", emptyToNull(item.getTarget()), "objectType", emptyToNull(item.getTarget()))
                .accept(e -> {
                    if (MENU_ITEM_TYPE_WS_MAP.get(item.getType()).contains("report")) {
                        e.put("objectId", reportService.getByCode(item.getTarget()).getId());
                    } else if (MENU_ITEM_TYPE_WS_MAP.get(item.getType()).equals("dashboard")) {
                        e.put("objectId", dashboardService.getForUserByIdOrCode(item.getTarget()).getId());
                    } else if (MENU_ITEM_TYPE_WS_MAP.get(item.getType()).equals("view")) {
                        e.put("objectId", viewService.getForCurrentUserByIdOrName(item.getTarget()).getId());
                    }
                }).then();
    }

}
