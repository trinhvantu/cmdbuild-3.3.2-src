/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.uicomponents.widget;

import java.util.List;
import javax.activation.DataHandler;
import javax.annotation.Nullable;
import org.cmdbuild.uicomponents.UiComponentInfo;

public interface WidgetComponentService {

    List<UiComponentInfo> getAll();

    List<UiComponentInfo> getAllActive();
    
    List<UiComponentInfo> getActiveForCurrentUserAndDevice();

    UiComponentInfo get(Long id);

    void delete(Long id);

    UiComponentInfo createOrUpdate(byte[] toByteArray);

    UiComponentInfo create(byte[] toByteArray);

    UiComponentInfo update(Long id, byte[] toByteArray);

    UiComponentInfo update(UiComponentInfo widget);

    byte[] getWidgetFile(String name, String filePath);

    DataHandler getWidgetData(String code);

    @Nullable
    UiComponentInfo getOneByCodeOrNull(String type);

}
