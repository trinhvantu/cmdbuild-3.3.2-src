/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.classe.access;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.eventbus.Subscribe;
import static java.lang.String.format;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import javax.annotation.Nullable;
import javax.inject.Provider;
import org.apache.commons.lang3.tuple.Pair;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_FLOW_START;
import static org.cmdbuild.auth.grant.GrantUtils.mergePrivilegeGroups;
import org.cmdbuild.auth.grant.GroupOfPrivileges;
import org.cmdbuild.auth.grant.UserRoleGrantPrivilegeUpdateEvent;
import org.cmdbuild.classe.ExtendedClass;
import org.cmdbuild.classe.ExtendedClassDefinition;
import static org.cmdbuild.auth.role.RolePrivilege.RP_ADMIN_CLASSES_MODIFY;
import org.cmdbuild.cache.CacheService;
import org.cmdbuild.cache.CmCache;
import org.cmdbuild.calendar.CalendarService;
import org.cmdbuild.calendar.beans.CalendarTrigger;
import org.cmdbuild.cardfilter.CardFilterService;
import org.cmdbuild.cardfilter.FilterForRoleUpdateEvent;
import org.cmdbuild.cardfilter.StoredFilter;
import org.cmdbuild.classe.ExtendedClassDefinition.Direction;
import org.cmdbuild.classe.ExtendedClassImpl;
import static org.cmdbuild.classe.access.UserClassService.ClassQueryFeatures.CQ_FILTER_CEVICE;
import static org.cmdbuild.classe.access.UserClassService.ClassQueryFeatures.CQ_FOR_USER;
import static org.cmdbuild.classe.access.UserClassService.ClassQueryFeatures.CQ_INCLUDE_INACTIVE_ELEMENTS;
import static org.cmdbuild.classe.access.UserClassUtils.applyPrivilegesToClass;
import org.cmdbuild.contextmenu.ContextMenuItem;
import org.cmdbuild.contextmenu.ContextMenuService;
import static org.cmdbuild.contextmenu.ContextMenuType.COMPONENT;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.AttributeImpl;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.formtrigger.FormTrigger;
import org.cmdbuild.formtrigger.FormTriggerService;
import org.cmdbuild.widget.WidgetService;
import org.cmdbuild.widget.model.WidgetData;
import org.springframework.stereotype.Component;
import org.cmdbuild.dao.driver.repository.AttributeRepository;
import org.cmdbuild.dao.driver.repository.ClasseRepository;
import org.cmdbuild.dao.entrytype.AttributeGroupService;
import org.cmdbuild.dao.entrytype.ClassDefinition;
import org.cmdbuild.dao.entrytype.ClassMetadata;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_WF_BASIC;
import org.cmdbuild.dao.entrytype.ClassPermissionsImpl;
import org.cmdbuild.dao.entrytype.ClasseImpl;
import org.cmdbuild.dao.event.DaoEvent;
import org.cmdbuild.dao.graph.ClasseHierarchyService;
import org.cmdbuild.dao.user.UserDaoHelperService;
import org.cmdbuild.eventbus.EventBusService;
import org.cmdbuild.formstructure.FormStructure;
import org.cmdbuild.formstructure.FormStructureService;
import org.cmdbuild.ui.TargetDevice;
import org.cmdbuild.uicomponents.UiComponentInfo;
import org.cmdbuild.uicomponents.contextmenu.ContextMenuComponentService;
import org.cmdbuild.uicomponents.widget.WidgetComponentService;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import org.cmdbuild.workflow.WorkflowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class UserClassServiceImpl implements UserClassService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final UserDaoHelperService user;
    private final ClasseRepository classeRepository;
    private final AttributeRepository attributeRepository;
    private final AttributeGroupService attributeGroupService;
    private final FormTriggerService formTriggerService;
    private final ContextMenuService contextMenuService;
    private final ContextMenuComponentService contextMenuComponentService;
    private final WidgetComponentService widgetComponentService;
    private final WidgetService widgetService;
    private final MetadataValidatorService validatorService;
    private final FormStructureService formStructureService;
    private final Provider<WorkflowService> workflowService; //TOD improve this 
    private final CalendarService calendarService;
    private final CardFilterService filterService;
    private final ClasseHierarchyService hierarchyService;

    private final CmCache<Classe> userClassCache;

    public UserClassServiceImpl(ContextMenuComponentService contextMenuComponentService, CacheService cacheService, EventBusService eventBusService, WidgetComponentService widgetComponentService, ClasseHierarchyService hierarchyService, CardFilterService filterService, Provider<WorkflowService> workflowService, CalendarService calendarService, UserDaoHelperService userHelper, ClasseRepository classeRepository, AttributeRepository attributeRepository, AttributeGroupService attributeGroupService, FormTriggerService formTriggerService, ContextMenuService contextMenuService, WidgetService widgetService, MetadataValidatorService validatorService, FormStructureService formStructureService) {
        this.user = checkNotNull(userHelper);
        this.classeRepository = checkNotNull(classeRepository);
        this.attributeRepository = checkNotNull(attributeRepository);
        this.attributeGroupService = checkNotNull(attributeGroupService);
        this.formTriggerService = checkNotNull(formTriggerService);
        this.contextMenuService = checkNotNull(contextMenuService);
        this.widgetService = checkNotNull(widgetService);
        this.validatorService = checkNotNull(validatorService);
        this.formStructureService = checkNotNull(formStructureService);
        this.workflowService = checkNotNull(workflowService);
        this.calendarService = checkNotNull(calendarService);
        this.filterService = checkNotNull(filterService);
        this.hierarchyService = checkNotNull(hierarchyService);
        this.widgetComponentService = checkNotNull(widgetComponentService);
        this.contextMenuComponentService = checkNotNull(contextMenuComponentService);

        this.userClassCache = cacheService.newCache("user_class_by_user_and_class");
        eventBusService.getGrantEventBus().register(new Object() {
            @Subscribe
            public void handleGrantDataUpdatedEvent(UserRoleGrantPrivilegeUpdateEvent event) {
                invalidateCache();
            }
        });
        eventBusService.getDaoEventBus().register(new Object() {
            @Subscribe
            public void handleDaoEvent(DaoEvent event) {
                invalidateCache();
            }
        });
        eventBusService.getFilterEventBus().register(new Object() {
            @Subscribe
            public void handleFilterForRoleUpdateEvent(FilterForRoleUpdateEvent event) {
                invalidateCache();
            }
        });
    }

    private void invalidateCache() {
        userClassCache.invalidateAll();
    }

    @Override
    public boolean userCanModify(String classId) {
        return getUserClass(classId).hasServiceModifyPermission();
    }

    @Override
    public boolean userCanRead(Classe classe) {
        return toUserClass(classe).hasServiceReadPermission();
    }

    @Override
    public boolean isActiveAndUserCanRead(String classId) {
        Classe classe = classeRepository.getClasse(classId);
        switch (classe.getClassSpeciality()) {
            case CS_DEFAULT:
                return classe.isActive() && userCanRead(classe);
            case CS_PROCESS:
                return classe.isActive() && toUserClass(classe).hasServicePermission(CP_WF_BASIC);
            case CS_DMSMODEL:
                return classe.isActive();
            default:
                throw unsupported("unsupported class speciality = %s", classe.getClassSpeciality());
        }
    }

    @Override
    public ExtendedClass getExtendedClass(String classId, ClassQueryFeatures... features) {
        return getExtendedClass(classeRepository.getClasse(classId), features);
    }

    @Override
    public ExtendedClass getExtendedClass(Classe classe, ClassQueryFeatures... features) {
        boolean includeInactiveElements = set(features).contains(CQ_INCLUDE_INACTIVE_ELEMENTS),
                filterDevice = set(features).contains(CQ_FILTER_CEVICE),
                forUser = set(features).contains(CQ_FOR_USER);
        if (forUser) {
            classe = toUserClass(classe);
            checkArgument(classe.hasServiceListPermission(), "CM: permission denied: user not authorized to list class = %s", classe);
        }
        List<FormTrigger> triggers = formTriggerService.getFormTriggersForClass(classe);
        List<ContextMenuItem> contextMenuItems = contextMenuService.getContextMenuItems(classe);
        List<WidgetData> widgets = widgetService.getAllWidgetsForClass(classe);
        FormStructure form = formStructureService.getFormForClassOrNull(classe);
        List<CalendarTrigger> calendarTriggers = calendarService.getTriggersByOwnerClassIncludeInherited(classe.getName());
        if (filterDevice) {
            Map<String, Object> permissions = classe.getOtherPermissions();
            TargetDevice targetDevice = user.getUser().getTargetDevice();
            contextMenuItems = list(contextMenuItems).withOnly(i -> i.isOfType(COMPONENT) ? contextMenuComponentService.getByCode(i.getComponentId()).allowsTargetDevice(targetDevice) : true)
                    .withOnly(c -> toBooleanOrDefault(permissions.get(format("contextmenu_%s", c.getComponentId())), true));
            widgets = list(widgets).withOnly(w -> {
                UiComponentInfo customWidgetComponent = widgetComponentService.getOneByCodeOrNull(w.getType()); //TODO improve this, detect if widget config is custom widget or standard widget !!
                return customWidgetComponent == null ? true : customWidgetComponent.allowsTargetDevice(targetDevice);
            }).withOnly(w -> toBooleanOrDefault(permissions.get(format("widget_%s", w.getId())), true));
        }
        if (!includeInactiveElements) {
            triggers = list(triggers).withOnly(FormTrigger::isActive);
            contextMenuItems = list(contextMenuItems).withOnly(ContextMenuItem::isActive);
            widgets = list(widgets).withOnly(WidgetData::isActive);
            calendarTriggers = list(calendarTriggers).withOnly(CalendarTrigger::isActive);
        }
        return ExtendedClassImpl.builder()
                .withClasse(classe)
                .withContextMenuItems(contextMenuItems)
                .withFormTriggers(triggers)
                .withWidgets(widgets)
                .withFormStructure(form)
                .withCalendarTriggers((List) calendarTriggers)
                .build();
    }

    @Override
    public ExtendedClass createClass(ExtendedClassDefinition definition) {
        checkArgument(user.hasPrivileges(RP_ADMIN_CLASSES_MODIFY), "CM: permission denied: user not authorized to create class");
        Classe classe = classeRepository.createClass(validateClassMetadata(definition.getClassDefinition()));
        return updateClassExtendedStuff(classe, definition);
    }

    @Override
    public ExtendedClass updateClass(ExtendedClassDefinition definition) {
        checkUserCanModify(definition.getClassDefinition().getName(), "CM: permission denied: user not authorized to modify class");
        Classe classe = classeRepository.updateClass(validateClassMetadata(definition.getClassDefinition()));
        return updateClassExtendedStuff(classe, definition);
    }

    private ExtendedClass updateClassExtendedStuff(Classe classe, ExtendedClassDefinition definition) {
        formTriggerService.updateFormTriggersForClass(classe, definition.getFormTriggers());
        contextMenuService.updateContextMenuItems(classe, definition.getContextMenuItems());
        widgetService.updateWidgetsForClass(classe, definition.getWidgets());
        formStructureService.setFormForClass(classe, definition.getFormStructure());
        updateDefaultOrder(classe, definition.getDefaultClassOrdering());
        attributeGroupService.updateAttributeGroupsForEntryType(classe, definition.getAttributeGroups());
        return getExtendedClass(classe.getName(), CQ_FOR_USER);
    }

    @Override
    public void deleteClass(String classId) {
        Classe classe = getUserClass(classId);
        checkArgument(classe.hasServiceModifyPermission(), "CM: permission denied: user not authorized to drop class");
        formTriggerService.deleteForClass(classe);
        contextMenuService.deleteForClass(classe);
        widgetService.deleteForClass(classe);
        classeRepository.deleteClass(classe);
    }

    @Override
    public List<Classe> getAllUserClasses() {
        return classeRepository.getAllClasses().stream().filter(Classe::isDefaultSpeciality).map(this::toUserClass).filter(Classe::hasServiceListPermission).collect(toList());
    }

    @Override
    public Attribute getUserAttribute(String classId, String attrId) {
        Attribute attribute = getUserClass(classId).getAttribute(attrId);
        checkArgument(attribute.hasServiceListPermission(), "CM: permission denied: user not authorized to read attribute = %s.%s", classId, attrId);
        return attribute;
    }

    @Override
    public List<Attribute> getUserAttributes(String classId) {
        return getUserClass(classId).getServiceAttributes();
    }

    @Override
    public Attribute createAttribute(Attribute attribute) {
//		Classe classe = getUserClass(attribute.getOwner().getName());
        checkUserCanModify(attribute.getOwner().getName(), "CM: permission denied: user not authorized to modify class");
//		checkArgument(classe.getAttributeOrNull(data.getName()) == null, "attribute already present in class = %s for name = %s", classId, data.getName()); TODO move to inner repo
        attributeRepository.createAttribute(attribute);
        return getUserAttribute(attribute.getOwner().getName(), attribute.getName());
    }

    @Override
    public Attribute updateAttribute(Attribute data) {
        Attribute attribute = getUserAttribute(data.getOwner().getName(), data.getName());
        checkArgument(attribute.hasServiceModifyPermission(), "CM: permission denied: user not authorized to modify attribute = %s", attribute);
        attributeRepository.updateAttribute(data);
        return getUserAttribute(data.getOwner().getName(), data.getName());
    }

    @Override
    public void deleteAttribute(String classId, String attrId) {
        Attribute attribute = getUserAttribute(classId, attrId);
        checkArgument(attribute.hasServiceModifyPermission(), "CM: permission denied: user not authorized to delete attribute = %s", attribute);
        attributeRepository.deleteAttribute(attribute);
    }

    @Override
    public void updateAttributes(List<Attribute> attributes) {
        attributes.forEach((data) -> {
            Attribute attribute = getUserAttribute(data.getOwner().getName(), data.getName());
            checkArgument(attribute.hasServiceModifyPermission(), "CM: permission denied: user not authorized to modify attribute = %s", attribute);
        });
        attributeRepository.updateAttributes(attributes);
    }

    @Override
    public Classe getUserClass(String classId) {
        Classe classe = toUserClass(classeRepository.getClasse(classId));
        checkArgument(classe.hasServiceListPermission(), "CM: permission denied: user not authorized to list class = %s", classId);
        return classe;
    }

    @Override
    @Nullable
    public Classe getUserClassOrNull(String classId) {
        Classe classe = toUserClass(classeRepository.getClasse(classId));
        return (classe.isProcess() && classe.hasServicePermission(CP_WF_BASIC)) || classe.hasServiceReadPermission() ? classe : null;
    }

    private Classe toUserClass(Classe classe) {
        return userClassCache.get(key(user.getUserPrivilegesChecksum(), classe.getName()), () -> doToUserClass(classe));
    }

    private Classe doToUserClass(Classe classe) {
        if (classe.isSuperclass()) {
            Collection<Classe> concreteClasses = hierarchyService.getClasseHierarchy(classe).getLeaves();
            List<GroupOfPrivileges> subclassesPrivileges = concreteClasses.stream().map(c -> user.getPrivilegesForObject(c).getMaxPrivilegesForSomeRecords()).collect(toList());
            classe = applyPrivilegesToClass(user.getRolePrivileges(), mergePrivilegeGroups(subclassesPrivileges).withSource("subclasses").build(), classe);
        } else {
            classe = applyPrivilegesToClass(user.getRolePrivileges(), user.getPrivilegesForObject(classe).getMaxPrivilegesForSomeRecords(), classe);
            if (classe.isProcess()) {
                boolean canStart = classe.hasServicePermission(CP_WF_BASIC) && workflowService.get().hasEntryTaskForCurrentUser(classe.getName());
                classe = ClasseImpl.copyOf(classe).withPermissions(ClassPermissionsImpl.copyOf(classe).withOtherPermissions(GDCP_FLOW_START, canStart).build()).build();
            }
        }
        StoredFilter userFilter = filterService.getDefaultFilterForCurrentUserAndClassOrNull(classe);
        if (userFilter != null) {
            classe = ClasseImpl.copyOf(classe).withMetadata((m) -> m.withDefaultFilter(userFilter.getId())).build();
        }
        return classe;
    }

    private void updateDefaultOrder(Classe classe, List<Pair<String, Direction>> defaultOrder) {
        List<Attribute> allAttributes = list(classe.getAllAttributes());
        List<Attribute> attributesPreviouslyUsedInOrder = allAttributes.stream().filter((a) -> a.getClassOrder() != 0).collect(toList());

        List<Attribute> changedAttributes = list();
        for (int index = 0; index < defaultOrder.size(); index++) {
            int newClassOrder = index + 1;
            Pair<String, Direction> record = defaultOrder.get(index);
            Direction order = record.getRight();
            switch (order) {
                case ASC:
                    //nothing to do
                    break;
                case DESC:
                    newClassOrder = -newClassOrder;
                    break;
                default:
                    throw new UnsupportedOperationException("unsupported order direction = " + order);
            }
            Attribute attr = classe.getAttribute(record.getLeft());
            if (attr.getClassOrder() != newClassOrder) {
                changedAttributes.add(AttributeImpl.copyOf(attr).withClassOrderInMeta(newClassOrder).build());
            }
        }

        Set<String> newOrderNames = defaultOrder.stream().map(Pair::getLeft).collect(toSet());
        checkArgument(newOrderNames.size() == defaultOrder.size());

        attributesPreviouslyUsedInOrder.forEach((attr) -> {
            if (!newOrderNames.contains(attr.getName())) {
                changedAttributes.add(AttributeImpl.copyOf(attr).withClassOrderInMeta(0).build());
            }
        });

        attributeRepository.updateAttributes(changedAttributes);
    }

    private ClassDefinition validateClassMetadata(ClassDefinition classDefinition) {
        ClassMetadata metadata = classDefinition.getMetadata();
        validatorService.validateMedata(classDefinition.getName(), metadata);
        return classDefinition;
    }

}
