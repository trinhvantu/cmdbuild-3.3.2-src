/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Strings.nullToEmpty;
import javax.annotation.Nullable;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfigImpl.EtlTemplateColumnConfigImplBuilder;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_DEFAULT;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_IGNORE;

@JsonDeserialize(builder = EtlTemplateColumnConfigImplBuilder.class)
@JsonInclude(Include.NON_NULL)
public class EtlTemplateColumnConfigImpl implements EtlTemplateColumnConfig {

    private final String attributeName, columnName, dateFormat, timeFormat, dateTimeFormat, decimalSeparator, thousandsSeparator;
    private final EtlTemplateColumnMode mode;
    private final String defaultValue;

    private EtlTemplateColumnConfigImpl(EtlTemplateColumnConfigImplBuilder builder) {
        this.mode = firstNotNull(builder.mode, ETCM_DEFAULT);
        this.columnName = nullToEmpty(builder.columnName).trim();
        if (equal(mode, ETCM_IGNORE)) {
            this.attributeName = "ignore";
            this.defaultValue = null;
        } else {
            this.attributeName = checkNotBlank(builder.attributeName);
            this.defaultValue = builder.defaultValue;
        }
        switch (mode) {
            case ETCM_DEFAULT://TODO validation (?)
                this.dateFormat = builder.dateFormat;
                this.timeFormat = builder.timeFormat;
                this.dateTimeFormat = builder.dateTimeFormat;
                this.decimalSeparator = builder.decimalSeparator;
                this.thousandsSeparator = builder.thousandsSeparator;
                break;
            default:
                this.dateFormat = null;
                this.timeFormat = null;
                this.dateTimeFormat = null;
                this.decimalSeparator = null;
                this.thousandsSeparator = null;
        }
    }

    @Override
    public String getAttributeName() {
        return attributeName;
    }

    @Override
    public String getColumnName() {
        return columnName;
    }

    @Override
    @JsonIgnore
    public EtlTemplateColumnMode getMode() {
        return mode;
    }

    @JsonProperty("mode")
    public String getModeAsString() {
        return serializeEnum(mode);
    }

    @Override
    @Nullable
    public String getDefault() {
        return defaultValue;
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
    public String toString() {
        return "ImportExportColumnConfig{" + "attributeName=" + attributeName + ", columnName=" + columnName + '}';
    }

    public static EtlTemplateColumnConfigImplBuilder builder() {
        return new EtlTemplateColumnConfigImplBuilder();
    }

    public static EtlTemplateColumnConfigImpl build(String attrName) {
        return builder().withAttributeName(attrName).build();
    }

    public static EtlTemplateColumnConfigImpl build(String attrName, String columnName) {
        return builder().withAttributeName(attrName).withColumnName(columnName).build();
    }

    public static EtlTemplateColumnConfigImplBuilder copyOf(EtlTemplateColumnConfig source) {
        return new EtlTemplateColumnConfigImplBuilder()
                .withAttributeName(source.getAttributeName())
                .withColumnName(source.getColumnName())
                .withMode(source.getMode())
                .withDefault(source.getDefault())
                .withDateFormat(source.getDateFormat())
                .withTimeFormat(source.getTimeFormat())
                .withDateTimeFormat(source.getDateTimeFormat())
                .withDecimalSeparator(source.getDecimalSeparator())
                .withThousandsSeparator(source.getThousandsSeparator());
    }

    public static class EtlTemplateColumnConfigImplBuilder implements Builder<EtlTemplateColumnConfigImpl, EtlTemplateColumnConfigImplBuilder> {

        private String attributeName, columnName, timeFormat, dateFormat, decimalSeparator, dateTimeFormat, thousandsSeparator;
        private EtlTemplateColumnMode mode;
        private String defaultValue;

        public EtlTemplateColumnConfigImplBuilder withAttributeName(String attributeName) {
            this.attributeName = attributeName;
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withColumnName(String columnName) {
            this.columnName = columnName;
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withMode(EtlTemplateColumnMode mode) {
            this.mode = mode;
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withMode(String mode) {
            this.mode = parseEnum(mode, EtlTemplateColumnMode.class);
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withDefault(String defaultValue) {
            this.defaultValue = defaultValue;
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withDateFormat(String dateFormat) {
            this.dateFormat = dateFormat;
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withTimeFormat(String timeFormat) {
            this.timeFormat = timeFormat;
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withDateTimeFormat(String dateTimeFormat) {
            this.dateTimeFormat = dateTimeFormat;
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withDecimalSeparator(String decimalSeparator) {
            this.decimalSeparator = decimalSeparator;
            return this;
        }

        public EtlTemplateColumnConfigImplBuilder withThousandsSeparator(String thousandsSeparator) {
            this.thousandsSeparator = thousandsSeparator;
            return this;
        }

        @Override
        public EtlTemplateColumnConfigImpl build() {
            return new EtlTemplateColumnConfigImpl(this);
        }

    }
}
