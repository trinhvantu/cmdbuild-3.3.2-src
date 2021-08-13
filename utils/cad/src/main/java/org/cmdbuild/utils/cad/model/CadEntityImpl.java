/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.model;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.ImmutableMap;
import static java.util.Collections.emptyMap;
import java.util.Map;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class CadEntityImpl implements CadEntity {

    private final String layer;
    private final Map<String, String> metadata;
    private final CadPoint position;
    private final CadPolyline perimeter;
    private final CadRectangle boundingBox;
    private final double surface;

    private CadEntityImpl(CadEntityBuilder builder) {
        this.layer = checkNotBlank(builder.layer);
        this.metadata = ImmutableMap.copyOf(firstNotNull(builder.metadata, emptyMap()));
        this.position = checkNotNull(builder.position);
        this.perimeter = checkNotNull(builder.perimeter);
        this.boundingBox = checkNotNull(builder.boundingBox);
        this.surface = builder.surface;
    }

    @Override
    public String getLayer() {
        return layer;
    }

    @Override
    public Map<String, String> getMetadata() {
        return metadata;
    }

    @Override
    public CadPoint getPosition() {
        return position;
    }

    @Override
    public CadPolyline getPerimeter() {
        return perimeter;
    }

    @Override
    public CadRectangle getBoundingBox() {
        return boundingBox;
    }

    @Override
    public double getSurface() {
        return surface;
    }

    @Override
    public String toString() {
        return "CadEntityImpl{" + "layer=" + layer + ", position=" + position + ", surface=" + surface + '}';
    }

    public static CadEntityBuilder builder() {
        return new CadEntityBuilder();
    }

    public static CadEntityBuilder copyOf(CadEntity source) {
        return new CadEntityBuilder()
                .withLayer(source.getLayer())
                .withMetadata(source.getMetadata())
                .withPosition(source.getPosition())
                .withPerimeter(source.getPerimeter())
                .withBoundingBox(source.getBoundingBox())
                .withSurface(source.getSurface());
    }

    public static class CadEntityBuilder implements Builder<CadEntityImpl, CadEntityBuilder> {

        private String layer;
        private Map<String, String> metadata;
        private CadPoint position;
        private CadPolyline perimeter;
        private CadRectangle boundingBox;
        private Double surface;

        public CadEntityBuilder withLayer(String layer) {
            this.layer = layer;
            return this;
        }

        public CadEntityBuilder withMetadata(Map<String, String> metadata) {
            this.metadata = metadata;
            return this;
        }

        public CadEntityBuilder withPosition(CadPoint position) {
            this.position = position;
            return this;
        }

        public CadEntityBuilder withPerimeter(CadPolyline perimeter) {
            this.perimeter = perimeter;
            return this;
        }

        public CadEntityBuilder withBoundingBox(CadRectangle boundingBox) {
            this.boundingBox = boundingBox;
            return this;
        }

        public CadEntityBuilder withSurface(Double surface) {
            this.surface = surface;
            return this;
        }

        @Override
        public CadEntityImpl build() {
            return new CadEntityImpl(this);
        }

    }
}
