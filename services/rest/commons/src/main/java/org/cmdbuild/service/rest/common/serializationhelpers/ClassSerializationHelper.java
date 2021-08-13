/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.service.rest.common.serializationhelpers;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Joiner;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Predicates.equalTo;
import static com.google.common.base.Predicates.not;
import com.google.common.base.Splitter;
import com.google.common.base.Strings;
import static com.google.common.collect.Maps.filterKeys;
import static java.lang.String.format;
import java.util.Collection;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import static java.util.stream.Collectors.toList;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.trimToNull;
import org.apache.commons.lang3.tuple.Pair;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_ATTACHMENT;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_BULK_ABORT;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_BULK_DELETE;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_BULK_UPDATE;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_DETAIL;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_EMAIL;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_FLOW_CLOSED_MODIFY_ATTACHMENT;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_FLOW_START;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_HISTORY;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_NOTE;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_PRINT;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_RELATION;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_RELGRAPH;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_SCHEDULE;
import org.cmdbuild.auth.multitenant.config.MultitenantConfiguration;
import org.cmdbuild.bim.BimService;
import org.cmdbuild.classe.ExtendedClass;
import org.cmdbuild.classe.ExtendedClassDefinition;
import org.cmdbuild.classe.ExtendedClassDefinitionImpl;
import org.cmdbuild.contextmenu.ContextMenuItem;
import org.cmdbuild.contextmenu.ContextMenuItemImpl;
import org.cmdbuild.contextmenu.ContextMenuType;
import org.cmdbuild.contextmenu.ContextMenuVisibility;
import org.cmdbuild.dao.beans.ClassMetadataImpl;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_DESCRIPTION;
import org.cmdbuild.dao.entrytype.ClassDefinition;
import org.cmdbuild.dao.entrytype.ClassDefinitionImpl;
import org.cmdbuild.dao.entrytype.ClassType;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.easyupload.EasyuploadItem;
import org.cmdbuild.easyupload.EasyuploadService;
import org.cmdbuild.formtrigger.FormTrigger;
import org.cmdbuild.formtrigger.FormTriggerBinding;
import org.cmdbuild.formtrigger.FormTriggerImpl;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.ASCENDING;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.ATTRIBUTE;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.DESCENDING;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.DIRECTION;
import org.cmdbuild.translation.ObjectTranslationService;
import static org.cmdbuild.utils.lang.CmCollectionUtils.nullToEmpty;
import org.cmdbuild.utils.lang.CmMapUtils;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.widget.model.WidgetData;
import static org.cmdbuild.widget.utils.WidgetConst.WIDGET_BUTTON_LABEL_KEY;
import static org.cmdbuild.widget.utils.WidgetUtils.serializeWidgetDataToString;
import static org.cmdbuild.widget.utils.WidgetUtils.toWidgetData;
import org.springframework.stereotype.Component;
import org.cmdbuild.classe.access.UserClassService;
import static org.cmdbuild.common.beans.CardIdAndClassNameUtils.serializeCardIdAndClassName;
import org.cmdbuild.config.CoreConfiguration;
import static org.cmdbuild.contextmenu.ContextMenuType.COMPONENT;
import org.cmdbuild.dao.beans.ClassMetadataImpl.ClassMetadataImplBuilder;
import static org.cmdbuild.dao.entrytype.AttributeGroupData.ATTRIBUTE_GROUP_DEFAULT_DISPLAY_MODE;
import org.cmdbuild.dao.entrytype.AttributeGroupInfoImpl;
import org.cmdbuild.dao.entrytype.ClassMultitenantMode;
import static org.cmdbuild.dao.entrytype.ClassMultitenantModeUtils.serializeClassMultitenantMode;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_CLONE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_CREATE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_DELETE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_MODIFY;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_READ;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_UPDATE;
import static org.cmdbuild.dao.entrytype.ClassMultitenantModeUtils.parseClassMultitenantMode;
import org.cmdbuild.data.filter.SorterElementDirection;
import org.cmdbuild.formstructure.FormStructureImpl;
import org.cmdbuild.lookup.DmsAttachmentCountCheck;
import org.cmdbuild.uicomponents.UiComponentInfo;
import org.cmdbuild.uicomponents.contextmenu.ContextMenuComponentService;
import static org.cmdbuild.utils.date.CmDateUtils.isDate;
import static org.cmdbuild.utils.date.CmDateUtils.isDateTime;
import static org.cmdbuild.utils.date.CmDateUtils.isTime;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDate;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTimeUtc;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoTime;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmConvertUtils.isPrimitiveOrWrapper;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrNull;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrNull;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.widget.WidgetService;
import org.cmdbuild.widget.model.Widget;
import org.cmdbuild.widget.model.WidgetDbData;
import org.cmdbuild.workflow.WorkflowConfiguration;
import org.cmdbuild.workflow.model.TaskDefinition;
import org.cmdbuild.workflow.model.Process;

@Component
public class ClassSerializationHelper {

    private final ObjectTranslationService translationService;
    private final BimService bimService;
    private final EasyuploadService easyuploadService;
    private final UserClassService classService;
    private final MultitenantConfiguration multitenantConfiguration;
    private final WorkflowConfiguration workflowConfiguration;
    private final CoreConfiguration coreConfiguration;
    private final ContextMenuComponentService service;
    private final WidgetService widgetService;

    public ClassSerializationHelper(WidgetService widgetService, ObjectTranslationService translationService, BimService bimService, EasyuploadService easyuploadService, UserClassService classService, MultitenantConfiguration multitenantConfiguration, WorkflowConfiguration workflowConfiguration, CoreConfiguration coreConfiguration, ContextMenuComponentService service) {
        this.translationService = checkNotNull(translationService);
        this.bimService = checkNotNull(bimService);
        this.easyuploadService = checkNotNull(easyuploadService);
        this.classService = checkNotNull(classService);
        this.multitenantConfiguration = checkNotNull(multitenantConfiguration);
        this.workflowConfiguration = checkNotNull(workflowConfiguration);
        this.coreConfiguration = checkNotNull(coreConfiguration);
        this.service = checkNotNull(service);
        this.widgetService = checkNotNull(widgetService);
    }

    public CmMapUtils.FluentMap<String, Object> buildBasicResponse(Classe classe) {
        return CmMapUtils.<String, Object, Object>map(
                "_id", classe.getName(),
                "name", classe.getName(),
                "description", classe.getDescription(),
                "_description_translation", translationService.translateClassDescription(classe),
                "prototype", classe.isSuperclass(),
                "parent", classe.getParentOrNull(),
                "active", classe.isActive(),
                "type", serializeEnum(classe.getClassType()),
                "speciality", serializeEnum(classe.getClassSpeciality()),
                "_can_read", classe.hasUiPermission(CP_READ),
                "_can_create", classe.hasUiPermission(CP_CREATE),
                "_can_update", classe.hasUiPermission(CP_UPDATE),
                "_can_clone", classe.hasUiPermission(CP_CLONE),
                "_can_delete", classe.hasUiPermission(CP_DELETE),
                "_can_modify", classe.hasUiPermission(CP_MODIFY),
                "_can_print", toBooleanOrDefault(classe.getOtherPermissions().get(GDCP_PRINT), true)
        ).accept(m -> {
            Map<String, Object> customPermissions = (Map) map(GDCP_BULK_UPDATE, coreConfiguration.isBulkUpdateEnabledDefault(),
                    GDCP_BULK_DELETE, coreConfiguration.isBulkDeleteEnabledDefault(),
                    GDCP_BULK_ABORT, workflowConfiguration.isBulkAbortEnabledDefault(),
                    GDCP_FLOW_CLOSED_MODIFY_ATTACHMENT, workflowConfiguration.enableAddAttachmentOnClosedActivities()
            ).skipNullValues().with(classe.getOtherPermissions());
            if (classe.isProcess()) {
                m.put("_can_start", toBooleanOrNull(customPermissions.get(GDCP_FLOW_START)));
                list(GDCP_BULK_ABORT, GDCP_FLOW_CLOSED_MODIFY_ATTACHMENT).forEach(k -> m.put(format("_can_%s", k), toBooleanOrDefault(customPermissions.get(k), true)));
            } else {
                list(GDCP_BULK_UPDATE, GDCP_BULK_DELETE).forEach(k -> m.put(format("_can_%s", k), toBooleanOrDefault(customPermissions.get(k), true)));
            }
            list(GDCP_RELGRAPH, GDCP_ATTACHMENT, GDCP_DETAIL, GDCP_EMAIL, GDCP_HISTORY, GDCP_NOTE, GDCP_RELATION).accept(l -> {
                if (!classe.isProcess()) {
                    l.add(GDCP_SCHEDULE);
                }
            }).forEach(c -> {
                m.put(format("_%s_access", c), toBooleanOrNull(customPermissions.get(c)));
            });
        }).with(
                "defaultFilter", classe.getMetadata().getDefaultFilterOrNull(),
                "defaultImportTemplate", serializeCardIdAndClassName(classe.getMetadata().getDefaultImportTemplateOrNull()),
                "defaultExportTemplate", classe.getMetadata().getDefaultExportTemplateOrNull(),
                "description_attribute_name", ATTR_DESCRIPTION,
                "metadata", classe.getMetadata().getCustomMetadata(),
                "_icon", classe.getMetadata().hasIcon() ? Optional.ofNullable(easyuploadService.getByPathOrNull(classe.getMetadata().getIcon())).map(EasyuploadItem::getId).orElse(null) : null
        ).accept((m) -> {
            if (multitenantConfiguration.isMultitenantEnabled()) {
                m.put("multitenantMode", serializeClassMultitenantMode(classe.getMultitenantMode()));
            }
        });
    }

    public CmMapUtils.FluentMap<String, Object> buildFullDetailResponse(Classe classe) {
        return buildBasicResponse(classe).with(
                "dmsCategory", classe.hasDmsCategory() ? classe.getDmsCategory() : null,
                "noteInline", classe.getMetadata().getNoteInline(),
                "noteInlineClosed", classe.getMetadata().getNoteInlineClosed(),
                "attachmentsInline", classe.getMetadata().getAttachmentsInline(),
                "attachmentsInlineClosed", classe.getMetadata().getAttachmentsInlineClosed(),
                "validationRule", classe.getMetadata().getValidationRuleOrNull(),
                "stoppableByUser", classe.getMetadata().isWfUserStoppable(),
                "defaultOrder", classe.getDefaultOrder().getElements().stream().map((o) -> map(ATTRIBUTE, o.getProperty(), DIRECTION, o.getDirection().equals(SorterElementDirection.ASC) ? ASCENDING : DESCENDING)).collect(toList()),//TODO replace this with standard sorter serialization 
                "domainOrder", classe.getMetadata().getDomainOrder(),
                "help", classe.getMetadata().getHelpMessage()
        ).accept((m) -> {
            if (bimService.isEnabled()) {
                m.put("hasBimLayer", bimService.hasBim(classe));
            }
            if (classe.isDmsModel()) {
                m.put(
                        "allowedExtensions", Joiner.on(",").join(nullToEmpty(classe.getMetadata().getDmsAllowedExtensions())),
                        "checkCount", serializeEnum(classe.getMetadata().getDmsCheckCount()),
                        "checkCountNumber", classe.getMetadata().getDmsCheckCountNumber(),
                        "maxFileSize", classe.getMetadata().getMaxFileSize());
            }
        });
    }

    public CmMapUtils.FluentMap<String, Object> buildFullDetailExtendedResponse(ExtendedClass extendedClass) {
        Classe input = extendedClass.getClasse();
        List<FormTrigger> triggers = extendedClass.getFormTriggers();
        List<ContextMenuItem> contextMenuItems = extendedClass.getContextMenuItems();
        AtomicInteger attrGroupIndex = new AtomicInteger(0);
        return buildFullDetailResponse(input).with(
                "widgets", widgetsToResponse(extendedClass.getWidgets())
        ).skipNullValues().with("formTriggers", triggers == null ? null : triggers.stream().map((t) -> {
            Map map = map("script", t.getJsScript(), "active", t.isActive());
            for (FormTriggerBinding binding : FormTriggerBinding.values()) {
                map.put(binding.name(), t.getBindings().contains(binding));
            }
            return map;
        }).collect(toList())).with("contextMenuItems", contextMenuItems == null ? null : contextMenuItems.stream().map((item) -> {
            return map(
                    "label", item.getLabel(),
                    "type", item.getType().name().toLowerCase(),
                    "active", item.isActive(),
                    "visibility", item.getVisibility().name().toLowerCase())
                    .skipNullValues()
                    .with(
                            "componentId", item.getComponentId(),
                            "script", item.getJsScript(),
                            "config", item.getConfig()
                    ).accept((t) -> {
                        if (item.getType() == COMPONENT) {
                            t.put("alias", ((UiComponentInfo) service.getByCode(item.getComponentId())).getExtjsAlias());
                            t.put("jscomponent", ((UiComponentInfo) service.getByCode(item.getComponentId())).getExtjsComponentId());
                        }
                        switch (item.getType()) {
                            case COMPONENT:
                            case CUSTOM:
                                t.put("_label_translation", translationService.translateClassContextMenuLabel(extendedClass.getClasse().getName(), item.getLabel(), item.getLabel()));
                                break;
                        }
                    });
        }).collect(toList())).with("attributeGroups", input.getAttributeGroups().stream().map(g -> map(
                "_id", g.getName(),
                "name", g.getName(),
                "description", g.getDescription(),
                "_description_translation", input.isView() ? translationService.translateViewAttributeGroupDescription(g) : translationService.translateAttributeGroupDescription(input, g),
                "index", attrGroupIndex.incrementAndGet()
        ).accept(m -> {
            m.with(g.getConfig());//TODO improve this (??)
        })).collect(toList())).accept(m -> {
            if (extendedClass.hasForm()) {
                m.put("formStructure", fromJson(extendedClass.getFormStructure().getData(), JsonNode.class));
            }
        }).then();
    }

    private Object widgetsToResponse(Collection<WidgetData> widgets) {
        return widgets.stream().map((widgetData) -> {
            Map<String, Object> widgetDataAsMapWithoutLabel = filterKeys(widgetData.getData(), not(equalTo(WIDGET_BUTTON_LABEL_KEY)));
            Widget widget = widgetService.widgetDataToWidget(widgetData, emptyMap());//TODO check this
            return serializeWidget(widget).with("_config", serializeWidgetDataToString(widgetDataAsMapWithoutLabel));
        }).collect(toList());
    }

    public ExtendedClassDefinition extendedClassDefinitionForNewClass(WsClassData data) {
        return addExtendedClassData(classDefinitionForNewClass(data), data);
    }

    public ExtendedClassDefinition extendedClassDefinitionForExistingClass(String classId, WsClassData data) {
        return addExtendedClassData(classDefinitionForExistingClass(classId, data), data);
    }

    public CmMapUtils.FluentMap serializeWidget(WidgetData widgetData) {
        return map("_id", widgetData.getId(),
                "_label", widgetData.getLabel(),
                "_type", widgetData.getType(),
                "_active", widgetData.isActive(),
                "_required", widgetData.isRequired(),
                "_alwaysenabled", widgetData.isAlwaysEnabled(),
                "_output", widgetData.getOutputParameterOrNull()).accept(m -> {
            String descriptionTranslation;
            if (widgetData instanceof WidgetDbData) {//TODO improve this, translate wf widgets
                descriptionTranslation = translationService.translateClassWidgetDescription(((WidgetDbData) widgetData).getOwner(), widgetData.getId(), widgetData.getLabel());
            } else {
                descriptionTranslation = widgetData.getLabel();
            }
            m.put("_label_translation", descriptionTranslation);
        }).with(map(widgetData.getExtendedData()).mapValues(ClassSerializationHelper::serializeWidgetExtendedValue));
    }

    @Nullable
    public static Object serializeWidgetExtendedValue(@Nullable Object value) {
        if (value == null || isPrimitiveOrWrapper(value)) {
            return value;
        } else if (isDateTime(value)) {
            return toIsoDateTimeUtc(value);
        } else if (isDate(value)) {
            return toIsoDate(value);
        } else if (isTime(value)) {
            return toIsoTime(value);
        } else {
            return value;
        }
    }

    public CmMapUtils.FluentMap serializeWorkflowWidget(Process process, TaskDefinition task, WidgetData widgetData) {
        return serializeWidget(widgetData).with("_label_translation", translationService.translateWorkflowWidgetDescription(process.getName(), task.getId(), widgetData.getId(), widgetData.getLabel()));
    }

    private ClassDefinition classDefinitionForNewClass(WsClassData data) {
        Classe parent = Optional.ofNullable(trimToNull(data.parentId)).map(classService::getUserClass).orElse(null);
        return ClassDefinitionImpl.builder()
                .withParent(parent == null ? null : parent.getName())
                .withName(data.name)
                .withMetadata(ClassMetadataImpl.builder().accept(data.metadataFillerForClassDataCreate()).accept(addIcon(data)).build())
                .build();
    }

    private ClassDefinition classDefinitionForExistingClass(String classId, WsClassData data) {
        Classe currentClass = classService.getUserClass(classId);
        return ClassDefinitionImpl.copyOf(currentClass)
                .withMetadata(ClassMetadataImpl.copyOf(currentClass.getMetadata()).accept(data.metadataFillerForClassDataUpdate()).accept(addIcon(data)).build())
                .build();
    }

    private Consumer<ClassMetadataImplBuilder> addIcon(WsClassData data) {
        return b -> {
            if (isNotNullAndGtZero(data.iconId)) {
                b.withIconPath(easyuploadService.getById(data.iconId).getPath());
            } else {
                b.withIconPath(null);
            }
        };
    }

    private ExtendedClassDefinition addExtendedClassData(ClassDefinition classDefinition, WsClassData data) {
        return ExtendedClassDefinitionImpl.builder()
                .withClassDefinition(classDefinition)
                .withContextMenuItems(toContextMenuItems(data.contextMenuItems))
                .withFormTriggers(toFormTriggers(data.formTriggers))
                .withDefaultClassOrdering(data.defaultOrder == null ? emptyList() : data.defaultOrder.stream()
                        .map((o) -> Pair.of(o.attribute, parseDirection(o.direction)))
                        .collect(toList()))
                .withWidgets(data.widgets.stream().map((w) -> toWidgetData(w.type, w.active, w.config, w.label)).collect(toList()))
                .withAttributeGroups(data.attributeGroups.stream().map(g -> {
                    return new AttributeGroupInfoImpl(g.name, g.description, (Map) map(ATTRIBUTE_GROUP_DEFAULT_DISPLAY_MODE, g.defaultDisplayMode).withoutValues(Objects::isNull));//TODO improve this (??)
                }).collect(toList()))
                .withFormStructure(data.formStructure == null ? null : new FormStructureImpl(toJson(data.formStructure)))
                .build();
    }

    private ExtendedClassDefinition.Direction parseDirection(String direction) {
        switch (checkNotBlank(direction).toLowerCase()) {
            case ASCENDING:
                return ExtendedClassDefinition.Direction.ASC;
            case DESCENDING:
                return ExtendedClassDefinition.Direction.DESC;
            default:
                throw new UnsupportedOperationException("unsupported order direction = " + direction);
        }
    }

    private List<ContextMenuItem> toContextMenuItems(List<WsClassData.WsClassDataContextMenuItem> contextMenuItems) {
        return contextMenuItems.stream().map((i) -> ContextMenuItemImpl.builder()
                .withActive(i.active)
                .withComponentId(i.componentId)
                .withConfig(i.config)
                .withJsScript(i.script)
                .withLabel(i.label)
                .withType(ContextMenuType.valueOf(i.type.toUpperCase()))
                .withVisibility(ContextMenuVisibility.valueOf(i.visibility.toUpperCase()))
                .build()).collect(toList());
    }

    private List<FormTrigger> toFormTriggers(List<WsClassData.WsClassDataFormTrigger> formTriggers) {
        return formTriggers.stream().map((t) -> {
            List<FormTriggerBinding> bindings = list();
            if (t.beforeView) {
                bindings.add(FormTriggerBinding.beforeView);
            }
            if (t.beforeInsert) {
                bindings.add(FormTriggerBinding.beforeInsert);
            }
            if (t.beforeEdit) {
                bindings.add(FormTriggerBinding.beforeEdit);
            }
            if (t.beforeClone) {
                bindings.add(FormTriggerBinding.beforeClone);
            }
            if (t.afterInsert) {
                bindings.add(FormTriggerBinding.afterInsert);
            }
            if (t.afterEdit) {
                bindings.add(FormTriggerBinding.afterEdit);
            }
            if (t.afterClone) {
                bindings.add(FormTriggerBinding.afterClone);
            }
            if (t.afterDelete) {
                bindings.add(FormTriggerBinding.afterDelete);
            }
            if (t.afterInsertExecute) {
                bindings.add(FormTriggerBinding.afterInsertExecute);
            }
            if (t.afterEditExecute) {
                bindings.add(FormTriggerBinding.afterEditExecute);
            }
            return FormTriggerImpl.builder()
                    .withActive(t.active)
                    .withJsScript(t.script)
                    .withBindings(bindings)
                    .build();
        }).collect(toList());
    }

    public static class WsClassData {

        public final String name;
        public final String description;
        public final String help, validationRule, flowStatusAttr, messageAttr, flowProvider;
        public final ClassType type;
        public final String parentId;
        public final ClassMultitenantMode multitenantMode;
        public final boolean isActive;
        public final boolean isSuperclass;
        public final Boolean noteInline;
        public final Boolean noteInlineClosed, attachmentsInlineClosed, attachmentsInline;
        public final Boolean stoppableByUser;
        public final Boolean enableSaveButton;
        public final String defaultImportTemplate, dmsCategory;
        public final List<WsClassDataDefaultOrder> defaultOrder;
        public final List<WsClassDataFormTrigger> formTriggers;
        public final List<WsClassDataContextMenuItem> contextMenuItems;
        public final List<WsClassDataWidget> widgets;
        public final List<String> domainOrder;
        public final List<WsClassDataAttributeGroup> attributeGroups;
        public final Long defaultFilter, defaultExportTemplate, iconId;
        public final JsonNode formStructure;
        private final Collection<String> allowedExtensions;
        private final DmsAttachmentCountCheck checkCount;
        private final Integer checkCountNumber, maxFileSize;

        public WsClassData(@JsonProperty("name") String name,
                @JsonProperty("description") String description,
                @JsonProperty("defaultFilter") Long defaultFilter,
                @JsonProperty("defaultImportTemplate") String defaultImportTemplate,
                @JsonProperty("defaultExportTemplate") Long defaultExportTemplate,
                @JsonProperty("_icon") Long iconId,
                @JsonProperty("validationRule") String validationRule,
                @JsonProperty("type") String type,
                @JsonProperty("allowedExtensions") String allowedExtensions,
                @JsonProperty("checkCount") String checkCount,
                @JsonProperty("checkCountNumber") Integer checkCountNumber,
                @JsonProperty("maxFileSize") Integer maxFileSize,
                @JsonProperty("messageAttr") String messageAttr,
                @JsonProperty("flowStatusAttr") String flowStatusAttr,
                @JsonProperty("engine") String engine,
                @JsonProperty("parent") String parentId,
                @JsonProperty("active") Boolean isActive,
                @JsonProperty("prototype") Boolean isSuperclass,
                @JsonProperty("noteInline") Boolean noteInline,
                @JsonProperty("noteInlineClosed") Boolean noteInlineClosed,
                @JsonProperty("attachmentsInline") Boolean attachmentsInline,
                @JsonProperty("attachmentsInlineClosed") Boolean attachmentsInlineClosed,
                @JsonProperty("enableSaveButton") Boolean enableSaveButton,
                @JsonProperty("dmsCategory") String dmsCategory,
                @JsonProperty("multitenantMode") String multitenantMode,
                @JsonProperty("stoppableByUser") Boolean stoppableByUser,
                @JsonProperty("defaultOrder") List<WsClassDataDefaultOrder> defaultOrder,
                @JsonProperty("formTriggers") List<WsClassDataFormTrigger> formTriggers,
                @JsonProperty("contextMenuItems") List<WsClassDataContextMenuItem> contextMenuItems,
                @JsonProperty("widgets") List<WsClassDataWidget> widgets,
                @JsonProperty("attributeGroups") List<WsClassDataAttributeGroup> attributeGroups,
                @JsonProperty("domainOrder") List<String> domainOrder,
                @JsonProperty("help") String help,
                @JsonProperty("formStructure") JsonNode formStructure) {
            this.name = checkNotBlank(name, "class name cannot be blank");
            this.description = description;
            this.defaultFilter = defaultFilter;
            this.defaultImportTemplate = defaultImportTemplate;
            this.defaultExportTemplate = defaultExportTemplate;
            this.validationRule = validationRule;
            this.type = parseEnum(checkNotBlank(type, "missing 'type' param"), ClassType.class);
            this.allowedExtensions = Splitter.on(",").trimResults().omitEmptyStrings().splitToList(Strings.nullToEmpty(allowedExtensions));
            this.checkCount = parseEnumOrNull(checkCount, DmsAttachmentCountCheck.class);
            this.checkCountNumber = checkCountNumber;
            this.maxFileSize = maxFileSize;
            this.messageAttr = messageAttr;
            this.flowStatusAttr = flowStatusAttr;
            this.flowProvider = engine;
            this.parentId = parentId;
            this.isActive = firstNonNull(isActive, true);
            this.isSuperclass = firstNonNull(isSuperclass, false);
            this.noteInline = noteInline;
            this.enableSaveButton = enableSaveButton;
            this.stoppableByUser = stoppableByUser;
            this.noteInlineClosed = noteInlineClosed;
            this.attachmentsInline = attachmentsInline;
            this.attachmentsInlineClosed = attachmentsInlineClosed;
            this.dmsCategory = dmsCategory;
            this.defaultOrder = nullToEmpty(defaultOrder);
            this.formTriggers = nullToEmpty(formTriggers);
            this.contextMenuItems = nullToEmpty(contextMenuItems);
            this.widgets = nullToEmpty(widgets);
            this.multitenantMode = isBlank(multitenantMode) ? null : parseClassMultitenantMode(multitenantMode);
            this.attributeGroups = nullToEmpty(attributeGroups);
            this.domainOrder = nullToEmpty(domainOrder);
            this.iconId = iconId;
            this.formStructure = formStructure;
            this.help = help;
        }

        public Consumer<ClassMetadataImpl.ClassMetadataImplBuilder> metadataFillerForClassDataCreate() {
            return (b) -> b
                    .withSuperclass(isSuperclass)
                    .withClassType(type)
                    .accept(metadataFillerForClassDataUpdate());
        }

        public Consumer<ClassMetadataImpl.ClassMetadataImplBuilder> metadataFillerForClassDataUpdate() {
            return (b) -> b.withActive(isActive)
                    .withDescription(description)
                    .withIsUserStoppable(stoppableByUser)
                    .withIsFlowSaveButtonEnabled(enableSaveButton)
                    .withDmsCategory(dmsCategory)
                    .withDefaultFilter(defaultFilter)
                    .withDefaultImportTemplate(defaultImportTemplate)
                    .withDefaultExportTemplate(defaultExportTemplate)
                    .withNoteInline(noteInline)
                    .withNoteInlineClosed(noteInlineClosed)
                    .withAttachmentsInline(attachmentsInline)
                    .withAttachmentsInlineClosed(attachmentsInlineClosed)
                    .withValidationRule(validationRule)
                    .withMultitenantMode(multitenantMode)
                    .withFlowStatusAttr(flowStatusAttr)
                    .withFlowProvider(flowProvider)
                    .withMessageAttr(messageAttr)
                    .withDomainOrder(domainOrder)
                    .withDmsAllowedExtensions(allowedExtensions)
                    .withDmsCountCheck(checkCount)
                    .withDmsCountCheckNumber(checkCountNumber)
                    .withMaxFileSize(maxFileSize)
                    .withHelpMessage(help);
        }

        @Override
        public String toString() {
            return "WsClassData{" + "name=" + name + ", description=" + description + ", type=" + type + ", parentId=" + parentId + ", isActive=" + isActive + ", isSuperclass=" + isSuperclass + '}';
        }

        public static class WsClassDataDefaultOrder {

            public final String attribute;
            public final String direction;

            public WsClassDataDefaultOrder(@JsonProperty("attribute") String attribute, @JsonProperty("direction") String direction) {
                this.attribute = attribute;
                this.direction = direction;
            }

        }

        public static class WsClassDataFormTrigger {

            public final String script;
            public final boolean active;
            public final boolean beforeView;
            public final boolean beforeInsert;
            public final boolean beforeEdit;
            public final boolean beforeClone;
            public final boolean afterInsert;
            public final boolean afterEdit;
            public final boolean afterClone;
            public final boolean afterDelete;
            public final boolean afterInsertExecute;
            public final boolean afterEditExecute;

            public WsClassDataFormTrigger(
                    @JsonProperty("script") String script,
                    @JsonProperty("active") Boolean active,
                    @JsonProperty("beforeView") Boolean beforeView,
                    @JsonProperty("beforeInsert") Boolean beforeInsert,
                    @JsonProperty("beforeEdit") Boolean beforeEdit,
                    @JsonProperty("beforeClone") Boolean beforeClone,
                    @JsonProperty("afterInsert") Boolean afterInsert,
                    @JsonProperty("afterEdit") Boolean afterEdit,
                    @JsonProperty("afterClone") Boolean afterClone,
                    @JsonProperty("afterDelete") Boolean afterDelete,
                    @JsonProperty("afterInsertExecute") Boolean afterInsertExecute,
                    @JsonProperty("afterEditExecute") Boolean afterEditExecute) {
                this.script = script;
                this.active = active;
                this.beforeView = beforeView;
                this.beforeInsert = beforeInsert;
                this.beforeEdit = beforeEdit;
                this.beforeClone = beforeClone;
                this.afterInsert = afterInsert;
                this.afterEdit = afterEdit;
                this.afterClone = afterClone;
                this.afterDelete = afterDelete;
                this.afterInsertExecute = afterInsertExecute;
                this.afterEditExecute = afterEditExecute;
            }

        }

        public static class WsClassDataContextMenuItem {

            private final boolean active;
            private final String label, type, componentId, script, config, visibility;

            public WsClassDataContextMenuItem(
                    @JsonProperty("active") Boolean active,
                    @JsonProperty("label") String label,
                    @JsonProperty("type") String type,
                    @JsonProperty("componentId") String componentId,
                    @JsonProperty("script") String script,
                    @JsonProperty("config") String config,
                    @JsonProperty("visibility") String visibility) {
                this.active = active;
                this.label = label;
                this.type = type;
                this.componentId = componentId;
                this.script = script;
                this.config = config;
                this.visibility = visibility;
            }

        }

        public static class WsClassDataWidget {

            private final String label, type, config;
            private final boolean active;

            public WsClassDataWidget(
                    @JsonProperty("_label") String label,
                    @JsonProperty("_type") String type,
                    @JsonProperty("_config") String config,
                    @JsonProperty("_active") Boolean active) {
                this.label = label;
                this.type = type;
                this.config = config;
                this.active = active;
            }

        }

        public static class WsClassDataAttributeGroup {

            protected final String name, description, defaultDisplayMode;

            public WsClassDataAttributeGroup(
                    @JsonProperty("name") String name,
                    @JsonProperty("description") String description,
                    @JsonProperty(ATTRIBUTE_GROUP_DEFAULT_DISPLAY_MODE) String defaultDisplayMode) {//TODO improve this (??)
                this.name = name;
                this.description = description;
                this.defaultDisplayMode = defaultDisplayMode;
            }

        }
    }
}
