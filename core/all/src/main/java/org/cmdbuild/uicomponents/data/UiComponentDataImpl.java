package org.cmdbuild.uicomponents.data;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.nullToEmpty;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_CODE;
import org.cmdbuild.dao.orm.annotations.CardAttr;
import org.cmdbuild.dao.orm.annotations.CardMapping;
import org.cmdbuild.ui.TargetDevice;
import static org.cmdbuild.ui.TargetDevice.TD_DEFAULT;
import static org.cmdbuild.uicomponents.data.UiComponentData.UI_COMPONENT_TABLE_NAME;
import static org.cmdbuild.uicomponents.utils.UiComponentUtils.normalizeComponentData;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

@CardMapping(UI_COMPONENT_TABLE_NAME)
public class UiComponentDataImpl implements UiComponentData {

    private final Long id;
    private final String name, description;
    private final byte[] data;
    private final boolean isActive;
    private final UiComponentType type;
    private final TargetDevice targetDevice;

    private UiComponentDataImpl(UiComponentDataImplBuilder builder) {
        this.id = (builder.id);
        this.name = checkNotBlank(builder.name);
        this.description = nullToEmpty(builder.description);
        this.data = normalizeComponentData(checkNotNull(builder.data));
        this.isActive = firstNotNull(builder.isActive, true);
        this.type = checkNotNull(builder.type);
        this.targetDevice = firstNotNull(builder.targetDevice, TD_DEFAULT);
    }

    @Override
    @CardAttr
    public Long getId() {
        return id;
    }

    @Override
    @CardAttr("Active")
    public boolean getActive() {
        return isActive;
    }

    @Override
    @CardAttr(ATTR_CODE)
    public String getName() {
        return name;
    }

    @Override
    @CardAttr
    public String getDescription() {
        return description;
    }

    @Override
    @CardAttr
    public byte[] getData() {
        return data;
    }

    @Override
    @CardAttr
    public UiComponentType getType() {
        return type;
    }

    @Override
    @CardAttr
    public TargetDevice getTargetDevice() {
        return targetDevice;
    }

    @Override
    public String toString() {
        return "UiComponentData{" + "id=" + id + ", name=" + name + '}';
    }

    public static UiComponentDataImplBuilder builder() {
        return new UiComponentDataImplBuilder();
    }

    public static UiComponentDataImplBuilder copyOf(UiComponentData source) {
        return new UiComponentDataImplBuilder()
                .withId(source.getId())
                .withName(source.getName())
                .withDescription(source.getDescription())
                .withActive(source.getActive())
                .withData(source.getData())
                .withTargetDevice(source.getTargetDevice())
                .withType(source.getType());
    }

    public static class UiComponentDataImplBuilder implements Builder<UiComponentDataImpl, UiComponentDataImplBuilder> {

        private Long id;
        private String name;
        private String description;
        private byte[] data;
        private Boolean isActive;
        private UiComponentType type;
        private TargetDevice targetDevice;

        public UiComponentDataImplBuilder withId(Long id) {
            this.id = id;
            return this;
        }

        public UiComponentDataImplBuilder withTargetDevice(TargetDevice targetDevice) {
            this.targetDevice = targetDevice;
            return this;
        }

        public UiComponentDataImplBuilder withActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public UiComponentDataImplBuilder withName(String name) {
            this.name = name;
            return this;
        }

        public UiComponentDataImplBuilder withDescription(String description) {
            this.description = description;
            return this;
        }

        public UiComponentDataImplBuilder withData(byte[] data) {
            this.data = data;
            return this;
        }

        public UiComponentDataImplBuilder withType(UiComponentType type) {
            this.type = type;
            return this;
        }

        @Override
        public UiComponentDataImpl build() {
            return new UiComponentDataImpl(this);
        }

    }
}
