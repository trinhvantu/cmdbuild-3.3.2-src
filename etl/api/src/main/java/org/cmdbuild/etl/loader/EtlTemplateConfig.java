/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import com.fasterxml.jackson.annotation.JsonIgnore;
import static com.google.common.base.Objects.equal;
import java.util.List;
import javax.annotation.Nullable;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.data.filter.CmdbFilter;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.etl.loader.EtlTemplateTarget.ET_CLASS;
import static org.cmdbuild.etl.loader.EtlTemplateTarget.ET_DOMAIN;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;

public interface EtlTemplateConfig extends EtlTemplateFieldFormatConfig {

    EtlTemplateTarget getTargetType();

    String getTargetName();

    List<EtlTemplateColumnConfig> getColumns();

    EtlMergeMode getMergeMode();

    EtlTemplateType getType();

    EtlFileFormat getFileFormat();

    @Nullable
    String getAttributeNameForUpdateAttrOnMissing();

    @Nullable
    String getAttributeValueForUpdateAttrOnMissing();

    CmdbFilter getFilter();

    CmdbFilter getExportFilter();

    @Nullable
    String getCsvSeparator();

    @Nullable
    String getImportKeyAttribute();

    List<String> getImportKeyAttributes();

    boolean getUseHeader();

    boolean getIgnoreColumnOrder();
    
    boolean getAlwaysHandleMissingRecords();

    @Nullable
    Integer getHeaderRow();

    @Nullable
    Integer getDataRow();

    @Nullable
    Integer getFirstCol();

    @Nullable
    String getSource();

    @Nullable
    Long getErrorTemplate();

    @Nullable
    Long getNotificationTemplate();

    @Nullable
    Long getErrorAccount();

    @Nullable
    String getCharset();

    default boolean hasErrorTemplate() {
        return isNotNullAndGtZero(getErrorTemplate());
    }

    default boolean hasNotificationTemplate() {
        return isNotNullAndGtZero(getNotificationTemplate());
    }

    default boolean hasErrorAccount() {
        return isNotNullAndGtZero(getErrorAccount());
    }

    default boolean hasFilter() {
        return !getFilter().isNoop();
    }

    default boolean hasFormat(EtlFileFormat format) {
        return equal(getFileFormat(), format);
    }

    @JsonIgnore
    default boolean isExportTemplate() {
        switch (getType()) {
            case ETT_EXPORT:
            case ETT_IMPORT_EXPORT:
                return true;
            default:
                return false;
        }
    }

    @JsonIgnore
    default boolean isImportTemplate() {
        switch (getType()) {
            case ETT_IMPORT:
            case ETT_IMPORT_EXPORT:
                return true;
            default:
                return false;
        }
    }

    @JsonIgnore
    default boolean getSkipUnknownColumns() {
        return getIgnoreColumnOrder();
    }

    default EtlTemplateColumnConfig getColumnByAttrName(String name) {
        return getColumns().stream().filter(c -> equal(c.getAttributeName(), name)).collect(onlyElement("column not found for attr name = %s", name));
    }

    default boolean hasColumnWithAttrName(String name) {
        return getColumns().stream().filter(c -> equal(c.getAttributeName(), name)).findAny().isPresent();
    }

    default boolean hasMergeMode(EtlMergeMode mode) {
        return equal(mode, getMergeMode());
    }

    default boolean hasMergeMode(EtlMergeMode... modes) {
        return set(modes).contains(getMergeMode());
    }

    default boolean hasTarget(Classe classe) {
        return equal(getTargetType(), ET_CLASS) && equal(getTargetName(), classe.getName());
    }

    @JsonIgnore
    default boolean isTargetDomain() {
        return equal(getTargetType(), ET_DOMAIN);
    }

}
