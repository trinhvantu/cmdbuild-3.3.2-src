/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.uicomponents;

import static com.google.common.base.Objects.equal;
import org.cmdbuild.ui.TargetDevice;
import org.cmdbuild.uicomponents.data.UiComponentType;

public interface UiComponentInfo {

    long getId();

    String getName();

    boolean getActive();

    String getDescription();

    String getExtjsComponentId();

    String getExtjsAlias();

    UiComponentType getType();

    TargetDevice getTargetDevice();

    default boolean isOfType(UiComponentType type) {
        return equal(getType(), type);
    }

    default boolean allowsTargetDevice(TargetDevice targetDevice) {
        return equal(getTargetDevice(), targetDevice);
    }

}
