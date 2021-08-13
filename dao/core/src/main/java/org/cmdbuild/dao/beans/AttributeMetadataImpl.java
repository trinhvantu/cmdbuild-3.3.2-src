/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.beans;

import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Predicates.not;
import com.google.common.base.Splitter;
import static com.google.common.base.Strings.nullToEmpty;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import static com.google.common.collect.Maps.filterKeys;
import static java.util.Collections.emptyMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.defaultIfBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.cmdbuild.dao.beans.RelationDirectionUtils.serializeRelationDirection;
import org.cmdbuild.dao.entrytype.CascadeAction;
import static org.cmdbuild.dao.entrytype.CascadeAction.CA_RESTRICT;
import org.cmdbuild.dao.entrytype.AttrEditorType;
import static org.cmdbuild.dao.entrytype.AttrEditorType.ET_HTML;
import org.cmdbuild.dao.entrytype.AttributeMetadata;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.BASEDSP;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.CLASSORDER;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.DEFAULT;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.EDITOR_TYPE;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.FILTER;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.FK_TARGET_CLASS;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.GROUP;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.INDEX;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.INHERITED;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.LOOKUP_TYPE;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.MANDATORY;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.REFERENCE_DOMAIN;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.UNIQUE;
import org.cmdbuild.dao.entrytype.AttributePermission;
import org.cmdbuild.dao.entrytype.AttributePermissionMode;
import org.cmdbuild.dao.entrytype.PermissionScope;
import static org.cmdbuild.dao.entrytype.DaoPermissionUtils.getDefaultPermissions;
import org.cmdbuild.dao.entrytype.AttributePermissions;
import org.cmdbuild.dao.entrytype.AttributePermissionsImpl;
import static org.cmdbuild.dao.entrytype.EntryTypeMetadata.ENTRY_TYPE_MODE;
import static org.cmdbuild.dao.entrytype.EntryTypeMetadata.PERMISSIONS;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.toIntegerOrDefault;
import static org.cmdbuild.dao.entrytype.DaoPermissionUtils.parseAttributePermissions;
import static org.cmdbuild.dao.entrytype.AttributePermissionMode.APM_DEFAULT;
import static org.cmdbuild.dao.entrytype.DaoPermissionUtils.serializeAttributePermissionMode;
import org.cmdbuild.dao.entrytype.TextContentSecurity;
import static org.cmdbuild.dao.entrytype.TextContentSecurity.TCS_HTML_SAFE;
import static org.cmdbuild.dao.entrytype.TextContentSecurity.TCS_PLAINTEXT;
import org.cmdbuild.dao.entrytype.attributetype.CardAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.ForeignKeyAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.IpAddressAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.LookupAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.NullAttributeTypeVisitor;
import org.cmdbuild.dao.entrytype.attributetype.ReferenceAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.TextAttributeLanguage;
import static org.cmdbuild.dao.entrytype.attributetype.TextAttributeLanguage.TAL_HTML;
import static org.cmdbuild.dao.entrytype.attributetype.TextAttributeLanguage.TAL_MARKDOWN;
import static org.cmdbuild.dao.entrytype.attributetype.TextAttributeLanguage.TAL_PLAINTEXT;
import org.cmdbuild.dao.entrytype.attributetype.UnitOfMeasureLocation;
import static org.cmdbuild.dao.entrytype.attributetype.UnitOfMeasureLocation.UML_AFTER;
import static org.cmdbuild.dao.entrytype.attributetype.UnitOfMeasureLocationUtils.serializeUnitOfMeasureLocation;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmCollectionUtils.isNullOrEmpty;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrNull;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnumUpper;
import static org.cmdbuild.utils.lang.CmConvertUtils.toIntegerOrNull;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.ltZeroToNull;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;

public class AttributeMetadataImpl extends AbstractMetadataImpl implements AttributeMetadata {

    private static final Set<String> ATTRIBUTE_METADATA_KEYS = ImmutableSet.of(
            ENTRY_TYPE_MODE, PERMISSIONS, LOOKUP_TYPE, REFERENCE_DOMAIN, REFERENCE_DIRECTION, BASEDSP, MANDATORY, UNIQUE, FK_TARGET_CLASS, CASCADE,
            INHERITED, INDEX, DEFAULT, GROUP, CLASSORDER, EDITOR_TYPE, FILTER, SHOW_IN_REDUCED_GRID, DOMAINKEY, GISATTR,
            FORMAT_PATTERN, PRESELECT_IF_UNIQUE, UNIT_OF_MEASURE, UNIT_OF_MEASURE_LOCATION, VISIBLE_DECIMALS, SHOW_SEPARATORS,
            HELP_MESSAGE, SHOW_IF_EXPR, VALIDATION_RULES_EXPR, AUTO_VALUE_EXPR, SHOW_THOUSANDS_SEPARATOR, SHOW_SECONDS, UI_ALIAS, TEXT_LANGUAGE,
            PASSWORD, TEXT_CONTENT_SECURITY, ITEMS);

    private static final AttributeMetadataImpl EMPTY_INSTANCE = new AttributeMetadataImpl();

    private final boolean showInGrid, showInReducedGrid, isMandatory, isUnique, isInherited, preselectIfUnique, showSeparators, domainKey, showThousandsSeparator, showSeconds, isMasterDetail, isPassword;
    private final String uiAlias, lookupType, domain, foreignKeyDestinationClassName, defaultValue, group, filter, unitOfMeasure, formatPattern, helpMessage, showIfExpr, validationRulesExpr, autoValueExpr, masterDetailDescription;
    private final int index, classOrder;
    private final Integer visibleDecimals;
    private final AttributePermissionMode mode;
    private final AttributePermissions permissions;
    private final RelationDirection direction;
    private final UnitOfMeasureLocation unitOfMeasureLocation;
    private final CascadeAction cascadeAction;
    private final TextContentSecurity textContentSecurity;
    private final AttrEditorType editorType;
    private final TextAttributeLanguage textAttributeLanguage;
    private final String gisAttr;
    private final List<String> items;

    public AttributeMetadataImpl(Map<String, String> map) {
        super(map, filterKeys(map, not(ATTRIBUTE_METADATA_KEYS::contains)));
        lookupType = defaultIfBlank(map.get(LOOKUP_TYPE), null);
        domain = defaultIfBlank(map.get(REFERENCE_DOMAIN), null);
        direction = parseEnumOrNull(map.get(REFERENCE_DIRECTION), RelationDirection.class);
        showInGrid = toBooleanOrDefault(map.get(BASEDSP), false);
        showInReducedGrid = toBooleanOrDefault(map.get(SHOW_IN_REDUCED_GRID), false);
        isMandatory = toBooleanOrDefault(map.get(MANDATORY), false);
        isUnique = toBooleanOrDefault(map.get(UNIQUE), false);
        foreignKeyDestinationClassName = map.get(FK_TARGET_CLASS);
        cascadeAction = parseEnumOrDefault(map.get(CASCADE), CA_RESTRICT);
        mode = parseEnumOrDefault(map.get(ENTRY_TYPE_MODE), APM_DEFAULT);
        isInherited = toBooleanOrDefault(map.get(INHERITED), false);
        domainKey = toBooleanOrDefault(map.get(DOMAINKEY), false);
        gisAttr = map.get(GISATTR);
        index = toIntegerOrDefault(map.get(INDEX), -1);
        defaultValue = map.get(DEFAULT);
        group = map.get(GROUP);
        classOrder = toIntegerOrDefault(map.get(CLASSORDER), 0);
        filter = map.get(FILTER);

        if (isNotBlank(map.get(PERMISSIONS))) {
            permissions = AttributePermissionsImpl
                    .copyOf(getDefaultPermissions(mode))
                    .addPermissions(parseAttributePermissions(map.get(PERMISSIONS)))
                    .build();
        } else {
            permissions = getDefaultPermissions(mode);
        }
        formatPattern = map.get(FORMAT_PATTERN);
        unitOfMeasure = map.get(UNIT_OF_MEASURE);
        checkArgument(nullToEmpty(unitOfMeasure).length() <= 10, "unit of measure param can be at most 10 chars long");
        preselectIfUnique = toBooleanOrDefault(map.get(PRESELECT_IF_UNIQUE), false);
        showSeparators = toBooleanOrDefault(map.get(SHOW_SEPARATORS), true);
        visibleDecimals = toIntegerOrNull(map.get(VISIBLE_DECIMALS));
        unitOfMeasureLocation = parseEnumOrDefault(map.get(UNIT_OF_MEASURE_LOCATION), UML_AFTER);
        helpMessage = map.get(HELP_MESSAGE);
        showIfExpr = map.get(SHOW_IF_EXPR);
        validationRulesExpr = map.get(VALIDATION_RULES_EXPR);
        autoValueExpr = map.get(AUTO_VALUE_EXPR);
        showThousandsSeparator = toBooleanOrDefault(map.get(SHOW_THOUSANDS_SEPARATOR), false);
        showSeconds = toBooleanOrDefault(map.get(SHOW_SECONDS), false);
        masterDetailDescription = map.get(MASTER_DETAIL_DESCRIPTION);
        isMasterDetail = toBooleanOrDefault(map.get(IS_MASTER_DETAIL), false);
        uiAlias = map.get(UI_ALIAS);
        editorType = parseEnumOrNull(map.get(EDITOR_TYPE), AttrEditorType.class);
        if (isNotBlank(map.get(TEXT_LANGUAGE))) {
            textAttributeLanguage = parseEnum(map.get(TEXT_LANGUAGE), TextAttributeLanguage.class);
        } else if (editorType != null) {
            switch (editorType) {
                case ET_HTML:
                    textAttributeLanguage = TAL_HTML;
                    break;
                case ET_MARKDOWN:
                    textAttributeLanguage = TAL_MARKDOWN;
                    break;
                case ET_PLAIN:
                    textAttributeLanguage = TAL_PLAINTEXT;
                    break;
                default:
                    textAttributeLanguage = null;
            }
        } else {
            textAttributeLanguage = null;
        }
        isPassword = toBooleanOrDefault(map.get(PASSWORD), false);
        textContentSecurity = parseEnumOrDefault(map.get(TEXT_CONTENT_SECURITY), equal(editorType, ET_HTML) ? TCS_HTML_SAFE : TCS_PLAINTEXT);
        items = ImmutableList.copyOf(Splitter.on(Pattern.compile("[ ,]")).omitEmptyStrings().trimResults().splitToList(nullToEmpty(map.get(ITEMS))));
    }

    public AttributeMetadataImpl() {
        this(emptyMap());
    }

    @Override
    public List<String> getItemTypes() {
        return items;
    }

    @Override
    @Nullable
    public String getGisAttr() {
        return gisAttr;
    }

    @Override
    public TextContentSecurity getTextContentSecurity() {
        return textContentSecurity;
    }

    @Override
    public boolean isPassword() {
        return isPassword;
    }

    @Override
    public CascadeAction getCascadeAction() {
        return cascadeAction;
    }

    @Override
    @Nullable
    public TextAttributeLanguage getTextAttributeLanguage() {
        return textAttributeLanguage;
    }

    @Override
    @Nullable
    public String getUiAlias() {
        return uiAlias;
    }

    @Override
    public boolean showThousandsSeparator() {
        return showThousandsSeparator;
    }

    @Override
    public boolean showSeconds() {
        return showSeconds;
    }

    @Nullable
    @Override
    public String getHelpMessage() {
        return helpMessage;
    }

    @Nullable
    @Override
    public String getShowIfExpr() {
        return showIfExpr;
    }

    @Nullable
    @Override
    public String getValidationRulesExpr() {
        return validationRulesExpr;
    }

    @Nullable
    @Override
    public String getAutoValueExpr() {
        return autoValueExpr;
    }

    @Override
    public boolean preselectIfUnique() {
        return preselectIfUnique;
    }

    @Override
    public boolean showSeparators() {
        return showSeparators;
    }

    @Nullable
    @Override
    public String getUnitOfMeasure() {
        return unitOfMeasure;
    }

    @Nullable
    @Override
    public String getFormatPattern() {
        return formatPattern;
    }

    @Override
    @Nullable
    public String getMasterDetailDescription() {
        return masterDetailDescription;
    }

    @Override
    public boolean isMasterDetail() {
        return isMasterDetail;
    }

    @Nullable
    @Override
    public Integer getVisibleDecimals() {
        return visibleDecimals;
    }

    @Override
    public UnitOfMeasureLocation getUnitOfMeasureLocation() {
        return unitOfMeasureLocation;
    }

    @Override
    public Map<PermissionScope, Set<AttributePermission>> getPermissionMap() {
        return permissions.getPermissionMap();
    }

    @Override
    public boolean showInGrid() {
        return showInGrid;
    }

    @Override
    public boolean showInReducedGrid() {
        return showInReducedGrid;
    }

    @Override
    public boolean isMandatory() {
        return isMandatory;
    }

    @Override
    public boolean isUnique() {
        return isUnique;
    }

    @Override
    public boolean isInherited() {
        return isInherited;
    }

    @Override
    public String getLookupType() {
        return lookupType;
    }

    @Override
    public String getDomain() {
        return domain;
    }

    @Override
    public RelationDirection getDirection() {
        return direction;
    }

    @Override
    public String getForeignKeyDestinationClassName() {
        return foreignKeyDestinationClassName;
    }

    @Override

    public String getDefaultValue() {
        return defaultValue;
    }

    @Override
    @Nullable
    public String getGroup() {
        return group;
    }

    @Override
    public AttrEditorType getEditorType() {
        return editorType;
    }

    @Override
    public boolean isDomainKey() {
        return domainKey;
    }

    @Override
    public String getFilter() {
        return filter;
    }

    @Override
    public int getIndex() {
        return index;
    }

    @Override
    public int getClassOrder() {
        return classOrder;
    }

    @Override
    public AttributePermissionMode getMode() {
        return mode;
    }

    public static AttributeMetadata emptyAttributeMetadata() {
        return EMPTY_INSTANCE;
    }

    public static AttributeMetadataImplBuilder builder() {
        return new AttributeMetadataImplBuilder();
    }

    public static AttributeMetadataImplBuilder copyOf(AttributeMetadata source) {
        return builder().withMetadata(source.getAll());
    }

    public static class AttributeMetadataImplBuilder implements Builder<AttributeMetadataImpl, AttributeMetadataImplBuilder> {

        private final FluentMap<String, String> map = map();

        public AttributeMetadataImplBuilder withMetadata(String... meta) {
            map.putAll(map(meta));
            return this;
        }

        public AttributeMetadataImplBuilder withMetadata(Map<String, String> metadata) {
            map.putAll(metadata);
            return this;
        }

        public AttributeMetadataImplBuilder withFormatPattern(String value) {
            map.put(FORMAT_PATTERN, value);
            return this;
        }

        public AttributeMetadataImplBuilder withPreselectIfUnique(Boolean value) {
            map.put(PRESELECT_IF_UNIQUE, toStringOrNull(value));
            return this;
        }

        public AttributeMetadataImplBuilder withUnitOfMeasure(String value) {
            map.put(UNIT_OF_MEASURE, value);
            return this;
        }

        public AttributeMetadataImplBuilder withUnitOfMeasureLocation(UnitOfMeasureLocation value) {
            map.put(UNIT_OF_MEASURE_LOCATION, value == null ? null : serializeUnitOfMeasureLocation(value));
            return this;
        }

        public AttributeMetadataImplBuilder withVisibleDecimal(Integer value) {
            map.put(VISIBLE_DECIMALS, toStringOrNull(value));
            return this;
        }

        public AttributeMetadataImplBuilder withShowSeparators(Boolean value) {
            map.put(SHOW_SEPARATORS, toStringOrNull(value));
            return this;
        }

        public AttributeMetadataImplBuilder withShowThousandsSeparators(Boolean value) {
            map.put(SHOW_THOUSANDS_SEPARATOR, toStringOrNull(value));
            return this;
        }

        public AttributeMetadataImplBuilder withShowSeconds(Boolean value) {
            map.put(SHOW_SECONDS, toStringOrNull(value));
            return this;
        }

        public AttributeMetadataImplBuilder withMasterDetail(Boolean value) {
            map.put(IS_MASTER_DETAIL, toStringOrNull(value));
            return this;
        }

        public AttributeMetadataImplBuilder withMasterDetailDescription(String value) {
            map.put(MASTER_DETAIL_DESCRIPTION, value);
            return this;
        }

        public AttributeMetadataImplBuilder withDescription(String description) {
            map.put(DESCRIPTION, description);
            return this;
        }

        public AttributeMetadataImplBuilder withDefaultValue(String defaultValue) {
            map.put(DEFAULT, defaultValue);
            return this;
        }

        public AttributeMetadataImplBuilder withHelpMessage(String value) {
            map.put(HELP_MESSAGE, value);
            return this;
        }

        public AttributeMetadataImplBuilder withShowIfExpr(String value) {
            map.put(SHOW_IF_EXPR, value);
            return this;
        }

        public AttributeMetadataImplBuilder withValidationRulesExpr(String value) {
            map.put(VALIDATION_RULES_EXPR, value);
            return this;
        }

        public AttributeMetadataImplBuilder withAutoValueExpr(String value) {
            map.put(AUTO_VALUE_EXPR, value);
            return this;
        }

        public AttributeMetadataImplBuilder withGroup(String group) {
            map.put(GROUP, group);
            return this;
        }

        public AttributeMetadataImplBuilder withEditorType(AttrEditorType editorType) {
            map.put(EDITOR_TYPE, serializeEnumUpper(editorType));
            return this;
        }

        public AttributeMetadataImplBuilder withDomainKey(Boolean domainKey) {
            map.put(DOMAINKEY, toStringOrNull(domainKey));
            return this;
        }

        public AttributeMetadataImplBuilder withItems(List<String> items) {
            map.put(ITEMS, isNullOrEmpty(items) ? null : Joiner.on(" ").join(items));
            return this;
        }

        public AttributeMetadataImplBuilder withFilter(String filter) {
            map.put(FILTER, filter);
            return this;
        }

        public AttributeMetadataImplBuilder withTargetClass(String targetClass) {
            map.put(FK_TARGET_CLASS, targetClass);
            return this;
        }

        public AttributeMetadataImplBuilder withShowInGrid(Boolean showInGrid) {
            map.put(BASEDSP, toStringOrNull(showInGrid));
            return this;
        }

        public AttributeMetadataImplBuilder withShowInReducedGrid(Boolean showInReducedGrid) {
            map.put(SHOW_IN_REDUCED_GRID, toStringOrNull(showInReducedGrid));
            return this;
        }

        public AttributeMetadataImplBuilder withRequired(Boolean required) {
            map.put(MANDATORY, toStringOrNull(required));
            return this;
        }

        public AttributeMetadataImplBuilder withUnique(Boolean unique) {
            map.put(UNIQUE, toStringOrNull(unique));
            return this;
        }

        public AttributeMetadataImplBuilder withActive(Boolean active) {
            map.put(ACTIVE, toStringOrNull(active));
            return this;
        }

        public AttributeMetadataImplBuilder withMode(AttributePermissionMode mode) {
            map.put(ENTRY_TYPE_MODE, serializeAttributePermissionMode(mode));
            return this;
        }

        public AttributeMetadataImplBuilder withIndex(Integer index) {
            map.put(INDEX, toStringOrNull(ltZeroToNull(index)));
            return this;
        }

        public AttributeMetadataImplBuilder withClassOrder(Integer classOrder) {
            map.put(CLASSORDER, toStringOrNull(classOrder));
            return this;
        }

        public AttributeMetadataImplBuilder withType(CardAttributeType type) {
            type.accept(new NullAttributeTypeVisitor() {
                @Override
                public void visit(ReferenceAttributeType attributeType) {
                    map.put(
                            REFERENCE_DOMAIN, attributeType.getDomainName(),
                            REFERENCE_DIRECTION, serializeRelationDirection(attributeType.getDirection())
                    );
                }

                @Override
                public void visit(LookupAttributeType attributeType) {
                    map.put(LOOKUP_TYPE, attributeType.getLookupTypeName());
                }

                @Override
                public void visit(IpAddressAttributeType attributeType) {
                    map.put(IP_TYPE, attributeType.getType().name().toLowerCase());//TODO check this
                }

                @Override
                public void visit(ForeignKeyAttributeType attributeType) {
                    map.put(FK_TARGET_CLASS, attributeType.getForeignKeyDestinationClassName());
                }

            });
            return this;
        }

        public AttributeMetadataImplBuilder withTextContentSecurity(TextContentSecurity textContentSecurity) {
            map.put(TEXT_CONTENT_SECURITY, serializeEnum(textContentSecurity));
            return this;
        }

        @Override
        public AttributeMetadataImpl build() {
            return new AttributeMetadataImpl(map);
        }

    }
}
