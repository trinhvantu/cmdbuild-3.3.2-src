package org.cmdbuild.uicomponents.data;

import static com.google.common.base.Objects.equal;
import javax.annotation.Nullable;
import org.cmdbuild.ui.TargetDevice;

public interface UiComponentData {

    static final String UI_COMPONENT_TABLE_NAME = "_UiComponent";

    @Nullable
    Long getId();

    boolean getActive();

    String getName();

    String getDescription();

    byte[] getData();

    UiComponentType getType();

    TargetDevice getTargetDevice();

    default boolean isOfType(UiComponentType type) {
        return equal(getType(), type);
    }
}
