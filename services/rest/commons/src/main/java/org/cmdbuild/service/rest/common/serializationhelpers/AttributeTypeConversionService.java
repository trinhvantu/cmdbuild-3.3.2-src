/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.service.rest.common.serializationhelpers;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.BiMap;
import com.google.common.collect.ImmutableBiMap;
import java.util.List;
import static java.util.stream.Collectors.toList;
import org.cmdbuild.calendar.CalendarTriggerInfo;
import org.cmdbuild.classe.access.UserClassService;
import static org.cmdbuild.classe.access.UserClassService.ClassQueryFeatures.CQ_INCLUDE_INACTIVE_ELEMENTS;
import static org.cmdbuild.dao.beans.RelationDirectionUtils.serializeRelationDirection;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.attributetype.DecimalAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.ForeignKeyAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.LookupAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.NullAttributeTypeVisitor;
import org.cmdbuild.dao.entrytype.attributetype.ReferenceAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.StringAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.TextAttributeType;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_BOOLEAN;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_CHAR;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_DATE;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_DATE_TIME;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_DECIMAL;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_DOUBLE;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_ENTRY_TYPE;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_FOREIGN_KEY;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_INTEGER;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_IP_ADDRESS;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_LOOKUP;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_REFERENCE;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_STRING;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_STRING_ARRAY;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_TEXT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_TIME;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.springframework.stereotype.Component;
import org.cmdbuild.dao.entrytype.Attribute;
import static org.cmdbuild.dao.entrytype.AttributePermission.AP_CREATE;
import static org.cmdbuild.dao.entrytype.AttributePermission.AP_MODIFY;
import static org.cmdbuild.dao.entrytype.AttributePermission.AP_UPDATE;
import static org.cmdbuild.dao.entrytype.DaoPermissionUtils.serializeAttributePermissionMode;
import static org.cmdbuild.dao.entrytype.DaoPermissionUtils.serializePermissions;
import org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName;
import org.cmdbuild.ecql.EcqlBindingInfo;
import org.cmdbuild.ecql.utils.EcqlUtils;
import org.cmdbuild.translation.ObjectTranslationService;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.attributetype.IpAddressAttributeType;
import static org.cmdbuild.dao.entrytype.attributetype.UnitOfMeasureLocationUtils.serializeUnitOfMeasureLocation;
import static org.cmdbuild.ecql.utils.EcqlUtils.getEcqlExpressionFromClassAttributeFilter;
import org.cmdbuild.report.inner.ReportParameter;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_BYTEA_ARRAY;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_FLOAT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_GEOMETRY;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_JSON;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.TYPE_LONG;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnumUpper;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrLtEqZero;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class AttributeTypeConversionService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    public final static BiMap<AttributeTypeName, String> TYPE_NAME_MAP = ImmutableBiMap.copyOf(map(
            AttributeTypeName.BOOLEAN, TYPE_BOOLEAN,
            AttributeTypeName.CHAR, TYPE_CHAR,
            AttributeTypeName.DATE, TYPE_DATE,
            AttributeTypeName.TIMESTAMP, TYPE_DATE_TIME,
            AttributeTypeName.DECIMAL, TYPE_DECIMAL,
            AttributeTypeName.DOUBLE, TYPE_DOUBLE,
            AttributeTypeName.FLOAT, TYPE_FLOAT,
            AttributeTypeName.REGCLASS, TYPE_ENTRY_TYPE,
            AttributeTypeName.FOREIGNKEY, TYPE_FOREIGN_KEY,
            AttributeTypeName.INTEGER, TYPE_INTEGER,
            AttributeTypeName.LONG, TYPE_LONG,
            AttributeTypeName.INET, TYPE_IP_ADDRESS,
            AttributeTypeName.LOOKUP, TYPE_LOOKUP,
            AttributeTypeName.REFERENCE, TYPE_REFERENCE,
            AttributeTypeName.STRINGARRAY, TYPE_STRING_ARRAY,
            AttributeTypeName.BYTEAARRAY, TYPE_BYTEA_ARRAY,
            AttributeTypeName.STRING, TYPE_STRING,
            AttributeTypeName.GEOMETRY, TYPE_GEOMETRY,
            AttributeTypeName.JSON, TYPE_JSON,
            AttributeTypeName.TEXT, TYPE_TEXT,
            AttributeTypeName.TIME, TYPE_TIME));

    private final DaoService dao;
    private final ObjectTranslationService translationService;
    private final UserClassService classService;
    private final CalendarWsSerializationHelper calendarHelper;

    public AttributeTypeConversionService(DaoService dao, ObjectTranslationService translationService, UserClassService classService, CalendarWsSerializationHelper calendarHelper) {
        this.dao = checkNotNull(dao);
        this.translationService = checkNotNull(translationService);
        this.classService = checkNotNull(classService);
        this.calendarHelper = checkNotNull(calendarHelper);
    }

    public static String serializeAttributeType(AttributeTypeName name) {
        return checkNotNull(TYPE_NAME_MAP.get(name), "unsupported attr type = %s", name);
    }

    public FluentMap<String, Object> serializeAttributeType(Attribute attribute) {
        return serializeAttributeType(attribute, true);
    }

    public FluentMap<String, Object> serializeAttributeType(Attribute attribute, boolean showNoActive) {
        return new AttrSerializerHelper(attribute, showNoActive).serializeAttributeType();
    }

    private class AttrSerializerHelper {

        private final Attribute attribute;
        private final boolean showNoActive;

        public AttrSerializerHelper(Attribute attribute, boolean showNoActive) {
            this.attribute = attribute;
            this.showNoActive = showNoActive;
        }

        public FluentMap<String, Object> serializeAttributeType() {
            return (FluentMap) map(
                    "_id", attribute.getName(),
                    "type", AttributeTypeConversionService.serializeAttributeType(attribute.getType().getName()),
                    "name", attribute.getName(),
                    "description", attribute.getDescription(),
                    "_description_translation", translationService.translateAttributeDescription(attribute),
                    "showInGrid", attribute.showInGrid(),
                    "showInReducedGrid", attribute.showInReducedGrid(),
                    "unique", attribute.isUnique(),
                    "mandatory", attribute.isMandatory(),
                    "inherited", attribute.isInherited(),
                    "active", attribute.isActive(),
                    "index", attribute.getIndex(),
                    "defaultValue", attribute.getDefaultValue(),
                    "group", attribute.getGroupNameOrNull(),
                    "_group_description", attribute.getGroupDescriptionOrNull(),
                    "_group_description_translation", attribute.hasGroup() ? (attribute.getOwner().isView() ? translationService.translateViewAttributeGroupDescription(attribute.getOwner().getName(), attribute.getGroupName(), attribute.getGroupDescriptionOrNull()) : translationService.translateAttributeGroupDescription(attribute.getOwner(), attribute.getGroup())) : null,
                    "mode", serializeAttributePermissionMode(attribute.getMode()),
                    "writable", attribute.hasUiPermission(AP_CREATE) || attribute.hasUiPermission(AP_UPDATE),
                    "immutable", attribute.hasUiPermission(AP_CREATE) && !attribute.hasUiPermission(AP_UPDATE),
                    "hidden", !attribute.hasUiReadPermission(),
                    "_can_read", attribute.hasServiceReadPermission(),
                    "_can_create", attribute.hasServicePermission(AP_CREATE),
                    "_can_update", attribute.hasServicePermission(AP_UPDATE),
                    "_can_modify", attribute.hasServicePermission(AP_MODIFY),
                    "metadata", attribute.getMetadata().getCustomMetadata(),
                    "help", attribute.getMetadata().getHelpMessage(),
                    "showIf", attribute.getMetadata().getShowIfExpr(),
                    "validationRules", attribute.getMetadata().getValidationRulesExpr(),
                    "autoValue", attribute.getMetadata().getAutoValueExpr(),
                    "alias", attribute.getMetadata().getUiAlias())
                    .accept((m) -> {
                        if (attribute.hasServiceModifyPermission()) {
                            m.put("_permissions", serializePermissions(attribute));
                        }
                        if (attribute.getOwner().isDomain()) {
                            m.put("domainKey", attribute.isDomainKey());
                        }
                    })
                    .with(serializeAttributeSpecificValues(attribute));
        }

        private FluentMap<String, Object> serializeAttributeSpecificValues(Attribute attribute) {
            FluentMap<String, Object> map = map();
            attribute.getType().accept(new NullAttributeTypeVisitor() {
                @Override
                public void visit(DecimalAttributeType attributeType) {
                    map.put("precision", attributeType.getPrecision(), "scale", attributeType.getScale());
                }

                @Override
                public void visit(ForeignKeyAttributeType attributeType) {
                    Classe classe = dao.getClasse(attributeType.getForeignKeyDestinationClassName());
                    map.put("targetClass", classe.getName(),
                            "targetType", getType(classe),
                            "filter", attribute.getFilter(),
                            "isMasterDetail", attribute.getMetadata().isMasterDetail(),
                            "masterDetailDescription", attribute.getMetadata().getMasterDetailDescription());
                    attachEcqlFilterStuffIfApplicable();
                }

                @Override
                public void visit(LookupAttributeType attributeType) {
                    map.put("lookupType", attributeType.getLookupTypeName(),
                            "filter", attribute.getFilter());
                    attachEcqlFilterStuffIfApplicable();
                }

                @Override
                public void visit(ReferenceAttributeType attributeType) {
                    Domain domain = dao.getDomain(attributeType.getDomainName());
                    Classe target = domain.getReferencedClass(attributeType);
                    map.put("domain", domain.getName(),
                            "direction", serializeRelationDirection(attributeType.getDirection()),
                            "targetClass", target.getName(),
                            "targetType", getType(target),
                            "filter", attribute.getFilter());
                    attachEcqlFilterStuffIfApplicable();
                }

                @Override
                public void visit(StringAttributeType attributeType) {
                    map.put("maxLength", attributeType.getLength());
                }

                @Override
                public void visit(TextAttributeType attributeType) {
                    map.put("language", serializeEnum(attributeType.getLanguage()),
                            "editorType", serializeEnumUpper(attribute.getEditorType()));
                }

                @Override
                public void visit(IpAddressAttributeType attributeType) {
                    map.put("ipType", attributeType.getType().name().toLowerCase());
                }

                private void attachEcqlFilterStuffIfApplicable() {
                    if (attribute.hasFilter()) {
                        EcqlBindingInfo ecqlBindingInfo = EcqlUtils.getEcqlBindingInfoForExpr(getEcqlExpressionFromClassAttributeFilter(attribute));
                        String ecqlId;
                        if (isNullOrLtEqZero(attribute.getOwner().getId())) {
                            ecqlId = EcqlUtils.buildEmbeddedEcqlId(attribute.getFilter());
                        } else {
                            ecqlId = EcqlUtils.buildClassAttrEcqlId(attribute);
                        }
                        map.put("ecqlFilter", map(
                                "id", ecqlId,
                                "bindings", map("server", ecqlBindingInfo.getServerBindings(), "client", ecqlBindingInfo.getClientBindings())
                        ));
                    }
                }

            });
            switch (attribute.getType().getName()) {
                case REFERENCE:
                case FOREIGNKEY:
                case LOOKUP:
                    map.put("preselectIfUnique", attribute.getMetadata().preselectIfUnique());
                    break;
                case TIME:
                case TIMESTAMP:
                    map.put("showSeconds", attribute.getMetadata().showSeconds(),
                            "formatPattern", attribute.getMetadata().getFormatPattern());
                    break;
                case DATE:
                    map.put("formatPattern", attribute.getMetadata().getFormatPattern());
                    break;
                case DECIMAL:
                case DOUBLE:
                case FLOAT:
                    map.put(
                            "visibleDecimals", attribute.getMetadata().getVisibleDecimals(),
                            "unitOfMeasure", attribute.getMetadata().getUnitOfMeasure(),
                            "unitOfMeasureLocation", serializeUnitOfMeasureLocation(attribute.getMetadata().getUnitOfMeasureLocation()),
                            "showSeparators", attribute.getMetadata().showSeparators(),
                            "showThousandsSeparator", attribute.getMetadata().showThousandsSeparator(),
                            "formatPattern", attribute.getMetadata().getFormatPattern()
                    );
                    break;
                case INTEGER:
                    map.put(
                            "unitOfMeasure", attribute.getMetadata().getUnitOfMeasure(),
                            "unitOfMeasureLocation", serializeUnitOfMeasureLocation(attribute.getMetadata().getUnitOfMeasureLocation()),
                            "showSeparators", attribute.getMetadata().showSeparators(),
                            "showThousandsSeparator", attribute.getMetadata().showThousandsSeparator(),
                            "formatPattern", attribute.getMetadata().getFormatPattern()
                    );
                    break;
                case STRING:
                    map.put(
                            "password", attribute.getMetadata().isPassword()
                    );
            }
            switch (attribute.getType().getName()) {
                case STRING:
                case STRINGARRAY:
                case TEXT:
                    map.put(
                            "textContentSecurity", serializeEnum(attribute.getMetadata().getTextContentSecurity()),
                            "_html", attribute.isHtmlSafe());
                    break;
                case LOOKUP:
                    map.put("_html", true);
                    break;
                default:
                    map.put("_html", false);
            }
            switch (attribute.getType().getName()) {
                case TIMESTAMP:
                case DATE:
                    if (attribute.getOwner().isRegularClass()) {//TODO improve this
                        List<CalendarTriggerInfo> calendarTriggers = classService.getExtendedClass(attribute.getOwnerClass(), CQ_INCLUDE_INACTIVE_ELEMENTS).getCalendarTriggersForAttr(attribute.getName());
                        map.put("calendarTriggers", calendarTriggers.stream().filter((t) -> showNoActive || t.isActive()).map(calendarHelper::serializeDetailedTrigger).collect(toList()));
                    }
            }
            return map;
        }
    }

    private static String getType(Classe classe) {
        return classe.isProcess() ? "process" : "class";
    }

}
