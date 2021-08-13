/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader.data;

import org.cmdbuild.etl.loader.EtlFileFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import static com.google.common.base.Preconditions.checkArgument;
import java.util.List;
import org.cmdbuild.etl.loader.EtlMergeMode;
import org.cmdbuild.etl.loader.EtlTemplateTarget;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Predicates.equalTo;
import com.google.common.collect.ImmutableList;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Iterables.getOnlyElement;
import static com.google.common.collect.Maps.uniqueIndex;
import static java.util.Collections.emptyList;
import java.util.Set;
import javax.annotation.Nullable;
import org.apache.commons.lang3.StringUtils;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDOBJ1;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDOBJ2;
import org.cmdbuild.dao.entrytype.EntryType;
import org.cmdbuild.data.filter.CmdbFilter;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.noopFilter;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.parseFilter;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.serializeFilter;
import org.cmdbuild.etl.EtlException;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfigImpl;
import org.cmdbuild.etl.loader.EtlTemplateType;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.utils.lang.CmNullableUtils.ltEqZeroToNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.etl.loader.EtlTemplateConfig;
import static org.cmdbuild.etl.loader.EtlTemplateTarget.ET_DOMAIN;
import static org.cmdbuild.etl.loader.EtlMergeMode.EM_LEAVE_MISSING;
import static org.cmdbuild.etl.loader.EtlMergeMode.EM_NO_MERGE;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfig;
import static org.cmdbuild.etl.loader.EtlTemplateTarget.ET_CLASS;
import org.cmdbuild.etl.loader.data.EtlTemplateConfigImpl.EtlTemplateConfigImplBuilder;
import static org.cmdbuild.utils.lang.CmCollectionUtils.nullToEmpty;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;

@JsonDeserialize(builder = EtlTemplateConfigImplBuilder.class)
public class EtlTemplateConfigImpl implements EtlTemplateConfig {

    private final EtlTemplateTarget targetType;
    private final List<EtlTemplateColumnConfig> columns;
    private final List<String> importKeyAttributes;
    private final EtlMergeMode mergeMode;
    private final EtlTemplateType type;
    private final EtlFileFormat format;
    private final String targetName, source, attributeNameForUpdateAttrOnMissing, attributeValueForUpdateAttrOnMissing, csvSeparator, importKeyAttribute, charset;
    private final String dateFormat, timeFormat, dateTimeFormat, decimalSeparator, thousandsSeparator;
    private final boolean useHeader, ignoreColumnOrder, alwaysHandleMissingRecords;
    private final Integer headerRow, dataRow, firstCol;
    private final Long errorTemplate, errorAccount, notificationTemplate;
    private final CmdbFilter exportFilter, filter;

    private EtlTemplateConfigImpl(EtlTemplateConfigImplBuilder builder) {
        this.targetType = checkNotNull(builder.targetType, "target type is null");
        this.type = checkNotNull(builder.type, "template type is null");
        this.format = checkNotNull(builder.format, "file format is null");
        this.targetName = checkNotBlank(builder.targetName, "target name is null");
        this.columns = ImmutableList.copyOf(firstNotNull(builder.columns, emptyList()));
        Set<String> attrs = uniqueIndex(columns, EtlTemplateColumnConfig::getAttributeName).keySet();
        this.csvSeparator = builder.csvSeparator;
        if (isImportTemplate()) {
            this.mergeMode = firstNotNull(builder.mergeMode, EM_LEAVE_MISSING);
            switch (mergeMode) {
                case EM_UPDATE_ATTR_ON_MISSING:
                    attributeNameForUpdateAttrOnMissing = checkNotBlank(builder.attributeNameForUpdateAttrOnMissing);
                    attributeValueForUpdateAttrOnMissing = checkNotNull(builder.attributeValueForUpdateAttrOnMissing);
                    break;
                default:
                    attributeNameForUpdateAttrOnMissing = null;
                    attributeValueForUpdateAttrOnMissing = null;
            }
            switch (targetType) {
                case ET_DOMAIN:
                    checkArgument(attrs.contains(ATTR_IDOBJ1), "missing required attr = %s for domain template", ATTR_IDOBJ1);
                    checkArgument(attrs.contains(ATTR_IDOBJ2), "missing required attr = %s for domain template", ATTR_IDOBJ2);
                    this.importKeyAttributes = emptyList();
                    break;
                case ET_CLASS:
                    switch (mergeMode) {
                        case EM_NO_MERGE:
                            this.importKeyAttributes = emptyList();
                            break;
                        default:
                            this.importKeyAttributes = set(nullToEmpty(builder.importKeyAttributes)).with(builder.importKeyAttribute).stream().filter(StringUtils::isNotBlank).collect(toImmutableList());
                            checkArgument(!importKeyAttributes.isEmpty(), "import key attr[s] is null");
                            importKeyAttributes.forEach(a -> checkArgument(columns.stream().map(EtlTemplateColumnConfig::getAttributeName).anyMatch(equalTo(a)), "invalid key attr = %s", a));
                    }
                    break;
                default:
                    throw new EtlException("unsupported target type = %s", targetType);
            }
        } else {
            this.importKeyAttributes = emptyList();
            this.mergeMode = EM_NO_MERGE;
            attributeNameForUpdateAttrOnMissing = null;
            attributeValueForUpdateAttrOnMissing = null;
        }
        this.source = builder.source;
        this.charset = builder.charset;
        this.errorTemplate = ltEqZeroToNull(builder.errorTemplate);
        this.notificationTemplate = ltEqZeroToNull(builder.notificationTemplate);
        this.errorAccount = ltEqZeroToNull(builder.errorAccount);
        this.headerRow = ltEqZeroToNull(builder.headerRow);
        this.dataRow = ltEqZeroToNull(builder.dataRow);
        this.firstCol = ltEqZeroToNull(builder.firstCol);
        this.useHeader = firstNotNull(builder.useHeader, columns.isEmpty() || columns.stream().anyMatch(c -> isNotBlank(c.getColumnName())));
        this.ignoreColumnOrder = firstNotNull(builder.ignoreColumnOrder, false);
        checkArgument(ignoreColumnOrder == false || (useHeader == true && columns.stream().allMatch(c -> isNotBlank(c.getColumnName()))), "invalid param ignoreColumnOrder with incomplete/missing header config");
        this.exportFilter = firstNotNull(isExportTemplate() ? builder.exportFilter : null, noopFilter());
        this.filter = firstNotNull(builder.filter, noopFilter());
        this.importKeyAttribute = importKeyAttributes.size() == 1 ? getOnlyElement(importKeyAttributes) : null;
        this.dateFormat = builder.dateFormat;
        this.timeFormat = builder.timeFormat;
        this.dateTimeFormat = builder.dateTimeFormat;
        this.decimalSeparator = builder.decimalSeparator;
        this.thousandsSeparator = builder.thousandsSeparator;
        this.alwaysHandleMissingRecords = firstNotNull(builder.alwaysHandleMissingRecords, false);
    }

    @Override
    @Nullable
    public String getDateFormat() {
        return dateFormat;
    }

    @Override
    @Nullable
    public String getTimeFormat() {
        return timeFormat;
    }

    @Override
    @Nullable
    public String getDateTimeFormat() {
        return dateTimeFormat;
    }

    @Override
    @Nullable
    public String getDecimalSeparator() {
        return decimalSeparator;
    }

    @Override
    @Nullable
    public String getThousandsSeparator() {
        return thousandsSeparator;
    }

    @Override
    @Nullable
    public Long getErrorTemplate() {
        return errorTemplate;
    }

    @Override
    @Nullable
    public Long getNotificationTemplate() {
        return notificationTemplate;
    }

    @Override
    @Nullable
    public Long getErrorAccount() {
        return errorAccount;
    }

    @Override
    @Nullable
    public String getSource() {
        return source;
    }

    @Override
    public boolean getUseHeader() {
        return useHeader;
    }

    @Override
    public boolean getIgnoreColumnOrder() {
        return ignoreColumnOrder;
    }

    @Override
    @Nullable
    public Integer getHeaderRow() {
        return headerRow;
    }

    @Override
    @Nullable
    public Integer getDataRow() {
        return dataRow;
    }

    @Override
    @Nullable
    public Integer getFirstCol() {
        return firstCol;
    }

    @Override
    @JsonIgnore
    public EtlTemplateTarget getTargetType() {
        return targetType;
    }

    @JsonProperty("targetType")
    public String getTargetTypeAsString() {
        return serializeEnum(targetType);
    }

    @Override
    @JsonIgnore
    public EtlFileFormat getFileFormat() {
        return format;
    }

    @JsonProperty("format")
    public String getFileFormatAsString() {
        return serializeEnum(format);
    }

    @Override
    public String getTargetName() {
        return targetName;
    }

    @Override
    public List<EtlTemplateColumnConfig> getColumns() {
        return columns;
    }

    @Override
    @JsonIgnore
    public EtlMergeMode getMergeMode() {
        return mergeMode;
    }

    @JsonProperty("mergeMode")
    public String getMergeModeAsString() {
        return serializeEnum(mergeMode);
    }

    @Override
    @Nullable
    public String getAttributeNameForUpdateAttrOnMissing() {
        return attributeNameForUpdateAttrOnMissing;
    }

    @Override
    @Nullable
    public String getAttributeValueForUpdateAttrOnMissing() {
        return attributeValueForUpdateAttrOnMissing;
    }

    @Override
    @JsonIgnore
    public EtlTemplateType getType() {
        return type;
    }

    @JsonProperty("type")
    public String getTypeAsString() {
        return serializeEnum(type);
    }

    @Override
    @Nullable
    public String getCharset() {
        return charset;
    }

    @Override
    @Nullable
    public String getCsvSeparator() {
        return csvSeparator;
    }

    @Override
    @Nullable
    public String getImportKeyAttribute() {
        return importKeyAttribute;
    }

    @Override
    public List<String> getImportKeyAttributes() {
        return importKeyAttributes;
    }

    @Override
    public boolean getAlwaysHandleMissingRecords() {
        return alwaysHandleMissingRecords;
    }

    @JsonIgnore
    @Override
    public CmdbFilter getFilter() {
        return filter;
    }

    @JsonProperty("filter")
    public String getFilterAsString() {
        return serializeFilter(filter);
    }

    @JsonIgnore
    @Override
    public CmdbFilter getExportFilter() {
        return exportFilter;
    }

    @JsonProperty("exportFilter")
    public String getExportFilterAsString() {
        return serializeFilter(exportFilter);
    }

    public static EtlTemplateConfigImplBuilder builder() {
        return new EtlTemplateConfigImplBuilder();
    }

    public static EtlTemplateConfigImplBuilder copyOf(EtlTemplateConfig source) {
        return new EtlTemplateConfigImplBuilder()
                .withAlwaysHandleMissingRecords(source.getAlwaysHandleMissingRecords())
                .withTargetType(source.getTargetType())
                .withTargetName(source.getTargetName())
                .withColumns(source.getColumns())
                .withMergeMode(source.getMergeMode())
                .withAttributeNameForUpdateAttrOnMissing(source.getAttributeNameForUpdateAttrOnMissing())
                .withAttributeValueForUpdateAttrOnMissing(source.getAttributeValueForUpdateAttrOnMissing())
                .withExportFilter(source.getExportFilter())
                .withFileFormat(source.getFileFormat())
                .withType(source.getType())
                .withCsvSeparator(source.getCsvSeparator())
                .withImportKeyAttribute(source.getImportKeyAttribute())
                .withImportKeyAttributes(source.getImportKeyAttributes())
                .withUseHeader(source.getUseHeader())
                .withIgnoreColumnOrder(source.getIgnoreColumnOrder())
                .withHeaderRow(source.getHeaderRow())
                .withDataRow(source.getDataRow())
                .withFirstCol(source.getFirstCol())
                .withErrorTemplate(source.getErrorTemplate())
                .withNotificationTemplate(source.getNotificationTemplate())
                .withErrorAccount(source.getErrorAccount())
                .withSource(source.getSource())
                .withFilter(source.getFilter())
                .withCharset(source.getCharset())
                .withDateFormat(source.getDateFormat())
                .withTimeFormat(source.getTimeFormat())
                .withDateTimeFormat(source.getDateTimeFormat())
                .withDecimalSeparator(source.getDecimalSeparator())
                .withThousandsSeparator(source.getThousandsSeparator());
    }

    public static class EtlTemplateConfigImplBuilder implements Builder<EtlTemplateConfigImpl, EtlTemplateConfigImplBuilder> {

        private EtlTemplateTarget targetType;
        private String targetName, source, charset;
        private List<? extends EtlTemplateColumnConfig> columns;
        private List<String> importKeyAttributes;
        private EtlMergeMode mergeMode;
        private String attributeNameForUpdateAttrOnMissing;
        private String attributeValueForUpdateAttrOnMissing;
        private String csvSeparator, importKeyAttribute;
        private Long errorTemplate, errorAccount, notificationTemplate;
        private EtlTemplateType type;
        private EtlFileFormat format;
        private Boolean useHeader, ignoreColumnOrder, alwaysHandleMissingRecords;
        private Integer headerRow, dataRow, firstCol;
        private CmdbFilter exportFilter, filter;
        private String timeFormat, dateFormat, decimalSeparator, dateTimeFormat, thousandsSeparator;

        public EtlTemplateConfigImplBuilder withDateFormat(String dateFormat) {
            this.dateFormat = dateFormat;
            return this;
        }

        public EtlTemplateConfigImplBuilder withAlwaysHandleMissingRecords(Boolean alwaysHandleMissingRecords) {
            this.alwaysHandleMissingRecords = alwaysHandleMissingRecords;
            return this;
        }

        public EtlTemplateConfigImplBuilder withTimeFormat(String timeFormat) {
            this.timeFormat = timeFormat;
            return this;
        }

        public EtlTemplateConfigImplBuilder withDateTimeFormat(String dateTimeFormat) {
            this.dateTimeFormat = dateTimeFormat;
            return this;
        }

        public EtlTemplateConfigImplBuilder withDecimalSeparator(String decimalSeparator) {
            this.decimalSeparator = decimalSeparator;
            return this;
        }

        public EtlTemplateConfigImplBuilder withThousandsSeparator(String thousandsSeparator) {
            this.thousandsSeparator = thousandsSeparator;
            return this;
        }

        public List<? extends EtlTemplateColumnConfig> getColumns() {
            return columns;
        }

        public EtlTemplateConfigImplBuilder withCharset(String charset) {
            this.charset = charset;
            return this;
        }

        public EtlTemplateConfigImplBuilder withTargetType(EtlTemplateTarget targetType) {
            this.targetType = targetType;
            return this;
        }

        public EtlTemplateConfigImplBuilder withUseHeader(Boolean useHeader) {
            this.useHeader = useHeader;
            return this;
        }

        public EtlTemplateConfigImplBuilder withIgnoreColumnOrder(Boolean ignoreColumnOrder) {
            this.ignoreColumnOrder = ignoreColumnOrder;
            return this;
        }

        public EtlTemplateConfigImplBuilder withHeaderRow(Integer headerRow) {
            this.headerRow = headerRow;
            return this;
        }

        public EtlTemplateConfigImplBuilder withErrorTemplate(Long errorTemplate) {
            this.errorTemplate = errorTemplate;
            return this;
        }

        public EtlTemplateConfigImplBuilder withNotificationTemplate(Long notificationTemplate) {
            this.notificationTemplate = notificationTemplate;
            return this;
        }

        public EtlTemplateConfigImplBuilder withErrorAccount(Long errorAccount) {
            this.errorAccount = errorAccount;
            return this;
        }

        public EtlTemplateConfigImplBuilder withDataRow(Integer dataRow) {
            this.dataRow = dataRow;
            return this;
        }

        public EtlTemplateConfigImplBuilder withFirstCol(Integer firstCol) {
            this.firstCol = firstCol;
            return this;
        }

        public EtlTemplateConfigImplBuilder withType(EtlTemplateType type) {
            this.type = type;
            return this;
        }

        public EtlTemplateConfigImplBuilder withFileFormat(EtlFileFormat format) {
            this.format = format;
            return this;
        }

        public EtlTemplateConfigImplBuilder withTarget(EntryType entryType) {
            switch (entryType.getEtType()) {
                case ET_CLASS:
                    return this.withTargetType(ET_CLASS).withTargetName(entryType.getName());
                case ET_DOMAIN:
                    return this.withTargetType(ET_DOMAIN).withTargetName(entryType.getName());
                default:
                    throw new EtlException("invalid target = %s", entryType);
            }
        }

        public EtlTemplateConfigImplBuilder withTargetName(String targetName) {
            this.targetName = targetName;
            return this;
        }

        public EtlTemplateConfigImplBuilder withSource(String source) {
            this.source = source;
            return this;
        }

        public EtlTemplateConfigImplBuilder withCsvSeparator(String csvSeparator) {
            this.csvSeparator = csvSeparator;
            return this;
        }

        public EtlTemplateConfigImplBuilder withImportKeyAttribute(String importKeyAttribute) {
            this.importKeyAttribute = importKeyAttribute;
            return this;
        }

        public EtlTemplateConfigImplBuilder withImportKeyAttributes(List<String> importKeyAttributes) {
            this.importKeyAttributes = importKeyAttributes;
            return this;
        }

        public EtlTemplateConfigImplBuilder withColumns(EtlTemplateColumnConfig... columns) {
            return this.withColumns(ImmutableList.copyOf(columns));
        }

        public EtlTemplateConfigImplBuilder withColumnNameFromAttributeName() {
            return this.withColumns(columns.stream().map(c -> EtlTemplateColumnConfigImpl.copyOf(c).withColumnName(c.getAttributeName()).build()).collect(toImmutableList()));
        }

        @JsonDeserialize(contentAs = EtlTemplateColumnConfigImpl.class)
        public EtlTemplateConfigImplBuilder withColumns(List<? extends EtlTemplateColumnConfig> columns) {
            this.columns = columns;
            return this;
        }

        public EtlTemplateConfigImplBuilder withMergeMode(EtlMergeMode mergeMode) {
            this.mergeMode = mergeMode;
            return this;
        }

        @JsonSetter("mergeMode")
        public EtlTemplateConfigImplBuilder withMergeModeAsString(String mergeMode) {
            return this.withMergeMode(parseEnum(mergeMode, EtlMergeMode.class));
        }

        @JsonSetter("type")
        public EtlTemplateConfigImplBuilder withTypeAsString(String type) {
            return this.withType(parseEnum(type, EtlTemplateType.class));
        }

        @JsonSetter("targetType")
        public EtlTemplateConfigImplBuilder withTargetTypeAsString(String targetType) {
            return this.withTargetType(parseEnum(targetType, EtlTemplateTarget.class));
        }

        @JsonSetter("format")
        public EtlTemplateConfigImplBuilder withFileFormatAsString(String format) {
            return this.withFileFormat(parseEnum(format, EtlFileFormat.class));
        }

        public EtlTemplateConfigImplBuilder withAttributeNameForUpdateAttrOnMissing(String attributeNameForUpdateAttrOnMissing) {
            this.attributeNameForUpdateAttrOnMissing = attributeNameForUpdateAttrOnMissing;
            return this;
        }

        public EtlTemplateConfigImplBuilder withAttributeValueForUpdateAttrOnMissing(String attributeValueForUpdateAttrOnMissing) {
            this.attributeValueForUpdateAttrOnMissing = attributeValueForUpdateAttrOnMissing;
            return this;
        }

        @JsonSetter("exportFilter")
        public EtlTemplateConfigImplBuilder withExportFilterAsString(String exportFilter) {
            this.exportFilter = parseFilter(exportFilter);
            return this;
        }

        public EtlTemplateConfigImplBuilder withExportFilter(CmdbFilter exportFilter) {
            this.exportFilter = exportFilter;
            return this;
        }

        public EtlTemplateConfigImplBuilder withFilter(CmdbFilter filter) {
            this.filter = filter;
            return this;
        }

        @JsonSetter("filter")
        public EtlTemplateConfigImplBuilder withFilterAsString(String filter) {
            this.filter = parseFilter(filter);
            return this;
        }

        @Override
        public EtlTemplateConfigImpl build() {
            return new EtlTemplateConfigImpl(this);
        }

    }
}
