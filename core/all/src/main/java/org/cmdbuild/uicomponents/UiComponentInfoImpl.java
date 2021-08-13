/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.uicomponents;

import static com.google.common.base.Preconditions.checkNotNull;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import org.cmdbuild.uicomponents.data.UiComponentType;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;

public class UiComponentInfoImpl implements UiComponentInfo {

    private final long id;
    private final String name, description, extjsComponentId, extjsAlias;
    private final boolean isActive;
    private final UiComponentType type;
    private final TargetDevice targetDevice;

    private UiComponentInfoImpl(UiComponentInfoImplBuilder builder) {
        this.id = builder.id;
        this.isActive = builder.isActive;
        this.name = checkNotBlank(builder.name);
        this.description = firstNotBlank(builder.description, name);
        this.extjsComponentId = checkNotBlank(builder.extjsComponentId);
        this.extjsAlias = checkNotBlank(builder.extjsAlias);
        this.type = checkNotNull(builder.type);
        this.targetDevice = firstNotNull(builder.targetDevice, TD_DEFAULT);
    }

    @Override
    public long getId() {
        return id;
    }

    @Override
    public boolean getActive() {
        return isActive;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public String getExtjsComponentId() {
        return extjsComponentId;
    }

    @Override
    public String getExtjsAlias() {
        return extjsAlias;
    }

    @Override
    public UiComponentType getType() {
        return type;
    }

    @Override
    public TargetDevice getTargetDevice() {
        return targetDevice;
    }

    @Override
    public String toString() {
        return "ExtComponentInfo{" + "id=" + id + ", name=" + name + '}';
    }

    public static UiComponentInfoImplBuilder builder() {
        return new UiComponentInfoImplBuilder();
    }

    public static UiComponentInfoImplBuilder copyOf(UiComponentInfo source) {
        return new UiComponentInfoImplBuilder()
                .withId(source.getId())
                .withActive(source.getActive())
                .withName(source.getName())
                .withDescription(source.getDescription())
                .withExtjsComponentId(source.getExtjsComponentId())
                .withExtjsAlias(source.getExtjsAlias())
                .withType(source.getType())
                .withTargetDevice(source.getTargetDevice());
    }

    public static class UiComponentInfoImplBuilder implements Builder<UiComponentInfoImpl, UiComponentInfoImplBuilder> {

        private long id;
        private Boolean isActive;
        private String name;
        private String description;
        private String extjsComponentId;
        private String extjsAlias;
        private UiComponentType type;
        private TargetDevice targetDevice;

        public UiComponentInfoImplBuilder withId(long id) {
            this.id = id;
            return this;
        }

        public UiComponentInfoImplBuilder withTargetDevice(TargetDevice targetDevice) {
            this.targetDevice = targetDevice;
            return this;
        }

        public UiComponentInfoImplBuilder withActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public UiComponentInfoImplBuilder withName(String name) {
            this.name = name;
            return this;
        }

        public UiComponentInfoImplBuilder withDescription(String description) {
            this.description = description;
            return this;
        }

        public UiComponentInfoImplBuilder withExtjsComponentId(String extjsComponentId) {
            this.extjsComponentId = extjsComponentId;
            return this;
        }

        public UiComponentInfoImplBuilder withExtjsAlias(String extjsAlias) {
            this.extjsAlias = extjsAlias;
            return this;
        }

        public UiComponentInfoImplBuilder withType(UiComponentType type) {
            this.type = type;
            return this;
        }

        @Override
        public UiComponentInfoImpl build() {
            return new UiComponentInfoImpl(this);
        }

    }
}
