/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.uicomponents.contextmenu;

import java.util.List;
import javax.activation.DataHandler;
import org.cmdbuild.uicomponents.UiComponentInfo;

public interface ContextMenuComponentService {

    List<UiComponentInfo> getAll();

    List<UiComponentInfo> getAllActive();

    UiComponentInfo get(Long id);

    UiComponentInfo getByCode(String componentId);

    void delete(Long id);

    UiComponentInfo createOrUpdate(byte[] toByteArray);

    UiComponentInfo create(byte[] toByteArray);

    UiComponentInfo update(Long id, byte[] toByteArray);

    UiComponentInfo update(UiComponentInfo customPage);

    byte[] getContextMenuFile(String contextMenuName, String filePath);

    DataHandler getContextMenuData(String code);

}
