/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.entrytype;

import static com.google.common.base.Objects.equal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.dao.beans.RelationDirection;
import org.cmdbuild.dao.entrytype.attributetype.TextAttributeLanguage;
import org.cmdbuild.dao.entrytype.attributetype.UnitOfMeasureLocation;

public interface AttributeMetadata extends AbstractMetadata {

    static final String BASEDSP = "cm_basedsp",
            CLASSORDER = "cm_classorder",
            DEFAULT = "cm_default",
            EDITOR_TYPE = "cm_text_editor_type",
            TEXT_LANGUAGE = "cm_text_language",
            DOMAINKEY = "cm_domain_key",
            FILTER = "cm_filter",
            GROUP = "cm_group",
            INDEX = "cm_index",
            INHERITED = "cm_inherited",
            IP_TYPE = "cm_ip_type",
            LOOKUP_TYPE = "cm_lookup_type",
            MANDATORY = "cm_mandatory",
            REFERENCE_DIRECTION = "cm_reference_direction",
            REFERENCE_DOMAIN = "cm_reference_domain",
            UNIQUE = "cm_unique",
            FK_TARGET_CLASS = "cm_fk_target_class",
            CASCADE = "cm_cascade",
            SHOW_IN_REDUCED_GRID = "cm_show_in_reduced_grid",
            FORMAT_PATTERN = "cm_format_pattern",
            PRESELECT_IF_UNIQUE = "cm_preselect_if_unique",
            UNIT_OF_MEASURE = "cm_unit_of_measure",
            UNIT_OF_MEASURE_LOCATION = "cm_unit_of_measure_location",
            VISIBLE_DECIMALS = "cm_visible_decimals",
            SHOW_SEPARATORS = "cm_show_separators",
            HELP_MESSAGE = "cm_help",
            SHOW_IF_EXPR = "cm_showIf",
            VALIDATION_RULES_EXPR = "cm_validationRules",
            AUTO_VALUE_EXPR = "cm_autoValue",
            SHOW_THOUSANDS_SEPARATOR = "cm_show_thousands_separator",
            SHOW_SECONDS = "cm_show_seconds",
            IS_MASTER_DETAIL = "cm_is_master_detail",
            MASTER_DETAIL_DESCRIPTION = "cm_master_detail_description",
            UI_ALIAS = "cm_ui_alias",
            PASSWORD = "cm_password",
            TEXT_CONTENT_SECURITY = "cm_text_content_security",
            GISATTR = "cm_gis_attr",
            ITEMS = "cm_items";

    boolean showInGrid();

    boolean showInReducedGrid();

    boolean isMandatory();

    boolean isUnique();

    boolean isInherited();

    boolean isDomainKey();

    boolean showThousandsSeparator();

    boolean showSeconds();

    int getIndex();

    int getClassOrder();

    @Nullable
    String getHelpMessage();

    @Nullable
    String getShowIfExpr();

    @Nullable
    String getValidationRulesExpr();

    @Nullable
    String getAutoValueExpr();

    @Nullable
    String getDefaultValue();

    @Nullable
    String getGroup();

    @Nullable
    AttrEditorType getEditorType();

    @Nullable
    String getFilter();

    @Nullable
    String getLookupType();

    @Nullable
    String getDomain();

    @Nullable
    RelationDirection getDirection();

    @Nullable
    String getForeignKeyDestinationClassName();

    @Nullable
    String getUnitOfMeasure();

    @Nullable
    String getUiAlias();

    UnitOfMeasureLocation getUnitOfMeasureLocation();

    @Nullable
    Integer getVisibleDecimals();

    boolean preselectIfUnique();

    boolean showSeparators();

    @Nullable
    String getFormatPattern();

    @Nullable
    String getMasterDetailDescription();

    @Nullable
    String getGisAttr();

    boolean isMasterDetail();

    boolean isPassword();

    AttributePermissionMode getMode();

    Map<PermissionScope, Set<AttributePermission>> getPermissionMap();

    @Nullable
    TextAttributeLanguage getTextAttributeLanguage();

    CascadeAction getCascadeAction();

    TextContentSecurity getTextContentSecurity();

    List<String> getItemTypes();

    default boolean isItems() {
        return !getItemTypes().isEmpty();
    }

    default boolean isGeometry() {
        return isNotBlank(getGisAttr());
    }

    default boolean isLookup() {
        return isNotBlank(getLookupType());
    }

    default boolean isReference() {
        return isNotBlank(getDomain());
    }

    default boolean isForeignKey() {
        return isNotBlank(getForeignKeyDestinationClassName());
    }

    default boolean hasUiAlias() {
        return isNotBlank(getUiAlias());
    }

    default boolean hasTextAttributeLanguage() {
        return getTextAttributeLanguage() != null;
    }

    default boolean hasTextContentSecurity(TextContentSecurity value) {
        return equal(value, getTextContentSecurity());
    }

}
