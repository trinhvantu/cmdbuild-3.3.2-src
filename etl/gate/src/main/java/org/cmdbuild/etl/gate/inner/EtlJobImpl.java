/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import java.time.ZonedDateTime;
import java.util.Map;

import javax.annotation.Nullable;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmMapUtils.nullToEmpty;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;

public class EtlJobImpl implements EtlJob {

    private final Long id;
    private final String gate;
    private final Long dataId;
    private final Map<String, String> meta;
    private final ZonedDateTime timestamp;
    private final boolean enabled;

    private EtlJobImpl(EtlJobImplBuilder builder) {
        this.id = builder.id;
        this.gate = builder.gate;
        this.dataId = builder.dataId;
        this.meta = map(builder.meta).immutable();
        this.timestamp = builder.timestamp;
        this.enabled = firstNotNull(builder.enabled, true);
    }

    @Override
    @Nullable
    public Long getId() {
        return id;
    }

    @Override
    public String getGate() {
        return gate;
    }

    @Override
    @Nullable
    public Long getDataId() {
        return dataId;
    }

    @Override
    public Map<String, String> getMeta() {
        return meta;
    }

    @Override
    @Nullable
    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String toString() {
        return "EtlJob{" + "id=" + id + ", gateId=" + gate + '}';
    }

    public static EtlJobImplBuilder builder() {
        return new EtlJobImplBuilder();
    }

    public static EtlJobImplBuilder copyOf(EtlJob source) {
        return new EtlJobImplBuilder()
                .withId(source.getId())
                .withGate(source.getGate())
                .withDataId(source.getDataId())
                .withMeta(source.getMeta())
                .withTimestamp(source.getTimestamp())
                .withEnabled(source.isEnabled());
    }

    public static class EtlJobImplBuilder implements Builder<EtlJobImpl, EtlJobImplBuilder> {

        private Long id;
        private String gate;
        private Long dataId;
        private Map<String, String> meta;
        private ZonedDateTime timestamp;
        private Boolean enabled;

        public EtlJobImplBuilder withId(Long id) {
            this.id = id;
            return this;
        }

        public EtlJobImplBuilder withGate(String gateId) {
            this.gate = gateId;
            return this;
        }

        public EtlJobImplBuilder withDataId(@Nullable Long dataId) {
            this.dataId = dataId;
            return this;
        }

        public EtlJobImplBuilder withMeta(Map<String, String> meta) {
            this.meta = meta;
            return this;
        }

        public EtlJobImplBuilder withEnabled(Boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public EtlJobImplBuilder withMeta(String key, String value) {
            return this.withMeta(map(nullToEmpty(meta)).with(key, value));
        }

        public EtlJobImplBuilder withTimestamp(ZonedDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        @Override
        public EtlJobImpl build() {
            return new EtlJobImpl(this);
        }

    }
}
