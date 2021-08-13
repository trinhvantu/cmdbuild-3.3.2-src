/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import static java.util.Collections.emptyMap;
import java.util.Map;
import org.cmdbuild.dao.orm.annotations.CardMapping;
import javax.annotation.Nullable;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import org.cmdbuild.dao.orm.annotations.CardAttr;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import org.cmdbuild.utils.json.JsonBean;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

@CardMapping("_EtlData")
public class EtlDataImpl implements EtlData {

    private final Long id;
    private final String gate, contentType;
    private final byte[] data;
    private final Map<String, String> meta;

    private EtlDataImpl(EtlDataImplBuilder builder) {
        this.id = builder.id;
        this.gate = checkNotBlank(builder.gate);
        this.contentType = checkNotBlank(builder.contentType);
        this.data = firstNotNull(builder.data, new byte[]{});
        this.meta = map(firstNotNull(builder.meta, emptyMap())).immutable();
    }

    @CardAttr(ATTR_ID)
    @Nullable
    @Override
    public Long getId() {
        return id;
    }

    @CardAttr
    @Override
    public String getGate() {
        return gate;
    }

    @CardAttr
    @Override
    public String getContentType() {
        return contentType;
    }

    @CardAttr
    @Override
    public byte[] getData() {
        return data;
    }

    @CardAttr
    @JsonBean
    @Override
    public Map<String, String> getMeta() {
        return meta;
    }

    @Override
    public String toString() {
        return "EtlDataImpl{" + "id=" + id + ", gate=" + gate + '}';
    }

    public static EtlDataImplBuilder builder() {
        return new EtlDataImplBuilder();
    }

    public static EtlDataImplBuilder copyOf(EtlData source) {
        return new EtlDataImplBuilder()
                .withId(source.getId())
                .withGate(source.getGate())
                .withContentType(source.getContentType())
                .withData(source.getData())
                .withMeta(source.getMeta());
    }

    public static class EtlDataImplBuilder implements Builder<EtlDataImpl, EtlDataImplBuilder> {

        private Long id;
        private String gate;
        private String contentType;
        private byte[] data;
        private Map<String, String> meta;

        public EtlDataImplBuilder withId(Long id) {
            this.id = id;
            return this;
        }

        public EtlDataImplBuilder withGate(String gate) {
            this.gate = gate;
            return this;
        }

        public EtlDataImplBuilder withContentType(String contentType) {
            this.contentType = contentType;
            return this;
        }

        public EtlDataImplBuilder withData(byte[] data) {
            this.data = data;
            return this;
        }

        public EtlDataImplBuilder withMeta(Map<String, String> meta) {
            this.meta = meta;
            return this;
        }

        @Override
        public EtlDataImpl build() {
            return new EtlDataImpl(this);
        }

    }
}
