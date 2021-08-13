package org.cmdbuild.menu;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Predicates.notNull;
import static org.cmdbuild.menu.MenuConstants.DEFAULT_MENU_GROUP_NAME;

import java.util.List;

import static java.util.stream.Collectors.toList;
import java.util.stream.IntStream;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.apache.commons.lang3.tuple.Pair;
import org.cmdbuild.auth.user.OperationUserStore;
import org.cmdbuild.auth.user.OperationUser;
import org.cmdbuild.classe.access.UserClassService;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.springframework.stereotype.Component;
import org.cmdbuild.uicomponents.custompage.CustomPageService;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dashboard.DashboardService;
import org.cmdbuild.report.ReportService;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.cmdbuild.menu.MenuItemType.CLASS;
import static org.cmdbuild.menu.MenuItemType.CUSTOM_PAGE;
import static org.cmdbuild.menu.MenuItemType.DASHBOARD;
import static org.cmdbuild.menu.MenuItemType.FOLDER;
import static org.cmdbuild.menu.MenuItemType.PROCESS;
import static org.cmdbuild.menu.MenuItemType.REPORT_ODT;
import static org.cmdbuild.menu.MenuItemType.REPORT_PDF;
import static org.cmdbuild.menu.MenuItemType.REPORT_XML;
import static org.cmdbuild.menu.MenuItemType.VIEW;
import static org.cmdbuild.menu.MenuItemType.REPORT_CSV;
import static org.cmdbuild.menu.MenuItemType.ROOT;
import org.cmdbuild.navtree.NavTreeService;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNullOrNull;
import org.cmdbuild.view.ViewDefinitionService;
import org.cmdbuild.workflow.WorkflowConfiguration;

@Component
public class MenuServiceImpl implements MenuService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DaoService dao;
    private final MenuRepository menuRepository;
    private final ViewDefinitionService viewService;
    private final CustomPageService customPageService;
    private final OperationUserStore userStore;
    private final ReportService reportService;
    private final UserClassService userClassService;
    private final DashboardService dashboardService;
    private final NavTreeService navTreeService;
    private final WorkflowConfiguration workflowConfiguration;

    public MenuServiceImpl(
            DaoService dao,
            MenuRepository menuRepository,
            ViewDefinitionService viewService,
            CustomPageService customPageService,
            OperationUserStore userStore,
            ReportService reportService,
            UserClassService userClassService,
            DashboardService dashboardService,
            NavTreeService navTreeService,
            WorkflowConfiguration workflowConfiguration) {
        this.dao = checkNotNull(dao);
        this.menuRepository = checkNotNull(menuRepository);
        this.viewService = checkNotNull(viewService);
        this.customPageService = checkNotNull(customPageService);
        this.userStore = checkNotNull(userStore);
        this.reportService = checkNotNull(reportService);
        this.userClassService = checkNotNull(userClassService);
        this.dashboardService = checkNotNull(dashboardService);
        this.navTreeService = checkNotNull(navTreeService);
        this.workflowConfiguration = checkNotNull(workflowConfiguration);
    }

    @Nullable
    @Override
    public Menu getMenuByIdOrNull(long menuId) {
        MenuData data = menuRepository.getMenuDataByIdOrNull(menuId);
        return data == null ? null : toMenu(data);
    }

    @Override
    public List<MenuInfo> getAllMenuInfos() {
        return menuRepository.getAllMenuInfos();
    }

    @Override
    public Menu create(String groupName, MenuTreeNode menu, TargetDevice targetDevice) {
        return toMenu(menuRepository.createMenuData(MenuDataImpl.builder()
                .withGroupName(groupName)
                .withMenuRootNode(toJsonMenu(menu))
                .withTargetDevice(targetDevice)
                .build()));
    }

    @Override
    public Menu update(long menuId, MenuTreeNode menu, TargetDevice targetDevice) {
        MenuData data = menuRepository.getMenuDataById(menuId);
        return toMenu(menuRepository.updateMenuData(MenuDataImpl.copyOf(data)
                .withMenuRootNode(toJsonMenu(menu))
                .withTargetDevice(targetDevice)
                .build()));
    }

    @Override
    public Menu getMenuForCurrentUser() {
        OperationUser user = userStore.getUser();
        String defaultGroup = user.getDefaultGroupNameOrNull();
        Menu menu = isBlank(defaultGroup) ? null : getMenuForGroupOrNull(defaultGroup, user.getTargetDevice());
        if (menu == null) {
            menu = getMenuForGroupOrNull(DEFAULT_MENU_GROUP_NAME, user.getTargetDevice());
        }
        if (menu == null) {
            menu = create(defaultGroup, MenuTreeNodeImpl.builder()
                    .withType(ROOT)
                    .withDescription("ROOT")
                    .build(), user.getTargetDevice());
        }
        List<MenuTreeNode> nodes = filterMenuForUser(menu.getRootNode().getChildren());
        MenuTreeNodeImpl rootNode = MenuTreeNodeImpl.copyOf(menu.getRootNode()).withChildren(nodes).build();
        return new MenuImpl(menu.getId(), rootNode, "current", menu.getTargetDevice());
    }

    @Override
    public void delete(long menuId) {
        menuRepository.delete(menuId);
    }

    @Nullable
    private Menu getMenuForGroupOrNull(String groupName, TargetDevice preferredDevice) {
        MenuData data = firstNotNullOrNull(menuRepository.getMenuDataForGroupOrNull(groupName, preferredDevice), menuRepository.getMenuDataForGroupOrNull(groupName, TD_DEFAULT));
        return data == null ? null : toMenu(data);
    }

    private Menu toMenu(MenuData data) {
        return new MenuImpl(data.getId(), toMenuItem(data.getMenuRootNode()), data.getGroupName(), data.getTargetDevice());
    }

    private MenuJsonRootNode toJsonMenu(MenuTreeNode menu) {
        checkArgument(equal(menu.getType(), ROOT));
        return new MenuJsonRootNodeImpl(toJsonMenuNodes(menu.getChildren()));
    }

    private MenuJsonNode toJsonMenuNode(Pair<MenuTreeNode, Integer> pair) {
        MenuTreeNode node = pair.getLeft();
        return new MenuJsonNodeImpl(node.getType(),
                node.getTarget(),
                node.getDescription(),
                node.getCode(),
                toJsonMenuNodes(node.getChildren()));
    }

    private List<MenuJsonNode> toJsonMenuNodes(List<MenuTreeNode> list) {
        return IntStream.range(0, list.size()).mapToObj((i) -> Pair.of(list.get(i), i + 1)).map(this::toJsonMenuNode).collect(toList());
    }

    private List<MenuTreeNode> filterMenuForUser(List<MenuTreeNode> menu) {
        return menu.stream()
                .filter((m) -> {
                    try {
                        switch (m.getType()) {
                            case FOLDER:
                            case ROOT:
                                return true;
                            case NAVTREE:
                                return userClassService.isActiveAndUserCanRead(navTreeService.getTree(m.getTarget()).getData().getTargetClassName());
                            case CLASS:
                                    return userClassService.isActiveAndUserCanRead(m.getTarget());
                            case PROCESS:
                                if (workflowConfiguration.isEnabled()) {
                                    return userClassService.isActiveAndUserCanRead(m.getTarget());
                                } else {
                                    return false;
                                }
                            case REPORT_CSV:
                            case REPORT_ODT:
                            case REPORT_PDF:
                            case REPORT_XML:
                                return reportService.isAccessibleByCode(m.getTarget());
                            case DASHBOARD:
                                return dashboardService.isAccessibleByCode(m.getTarget());
                            case VIEW:
                                return viewService.isActiveAndUserAccessibleByName(m.getTarget());
                            case CUSTOM_PAGE:
                                return customPageService.isAccessibleByName(m.getTarget());
                            default:
                                throw unsupported("unsupported menu type = %s", m.getType());
                        }
                    } catch (Exception ex) {
                        logger.error(marker(), "error processing menu record = {}", m, ex);
                        return false;
                    }

                }).map((n) -> {
            if (n.getChildren().isEmpty()) {
                return n;
            } else {
                return MenuTreeNodeImpl.copyOf(n).withChildren(filterMenuForUser(n.getChildren())).build();
            }
        }).collect(toList());
    }

    private MenuTreeNode toMenuItem(MenuJsonRootNode root) {
        return MenuTreeNodeImpl.buildRoot(root.getMenuNodes().stream().map(this::convertMenuElementToMenuItemBuilderOrNullIfError).filter(notNull()).collect(toList()));
    }

    @Nullable
    private MenuTreeNode convertMenuElementToMenuItemBuilderOrNullIfError(MenuJsonNode menuElement) {
        try {
            return convertMenuElementToMenuItemBuilder(menuElement);
        } catch (Exception e) {
            logger.error(marker(), "Error converting MenuItem from element = {}", menuElement, e);
            return null;
        }
    }

    private MenuTreeNode convertMenuElementToMenuItemBuilder(MenuJsonNode record) {
        return MenuTreeNodeImpl.builder()
                .withCode(record.getCode())
                .withType(record.getMenuType())
                .withDescription(record.getDescription())
                .accept((b) -> {
                    switch (record.getMenuType()) {
                        case CLASS:
                        case PROCESS:
                            b.withTarget(record.getTarget()).withTargetDescription(dao.getClasse(record.getTarget()).getDescription());
                            break;
                        case REPORT_CSV:
                        case REPORT_ODT:
                        case REPORT_PDF:
                        case REPORT_XML:
                            b.withTarget(record.getTarget()).withTargetDescription(reportService.getByCode(record.getTarget()).getDescription());
                            break;
                        case CUSTOM_PAGE:
                            b.withTarget(record.getTarget()).withTargetDescription(customPageService.getByName(record.getTarget()).getDescription());
                            break;
                        case VIEW:
                            b.withTarget(record.getTarget()).withTargetDescription(viewService.getSharedByName(record.getTarget()).getDescription());
                            break;
                        case DASHBOARD:
                            b.withTarget(record.getTarget()).withTargetDescription(dashboardService.getByCode(record.getTarget()).getDescription());
                            break;
                        case NAVTREE:
                            b.withTarget(record.getTarget()).withTargetDescription(navTreeService.getTree(record.getTarget()).getDescription());
                            break;
                        case FOLDER:
                        case ROOT:
                        case SYSTEM_FOLDER:
                            break;//no target
                        default:
                            throw unsupported("unsupported menu item type = %s", record.getMenuType());
                    }
                })
                .withChildren(record.getChildren().stream().map(this::convertMenuElementToMenuItemBuilderOrNullIfError).filter(notNull()).collect(toList()))
                .build();
    }

}
