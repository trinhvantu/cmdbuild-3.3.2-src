package org.cmdbuild.uicomponents.custompage;

import java.util.List;
import javax.activation.DataHandler;
import org.cmdbuild.auth.grant.PrivilegeSubjectWithInfo;
import org.cmdbuild.uicomponents.UiComponentInfo;

public interface CustomPageService {

    List<UiComponentInfo> getAll();

    List<UiComponentInfo> getAllForCurrentUser();

    List<UiComponentInfo> getActiveForCurrentUserAndDevice();

    UiComponentInfo get(long id);

    PrivilegeSubjectWithInfo getCustomPageAsPrivilegeSubjectById(long id);

    UiComponentInfo create(byte[] data);

    UiComponentInfo createOrUpdate(byte[] data);

    UiComponentInfo update(long id, byte[] data);

    UiComponentInfo update(UiComponentInfo customPage);

    byte[] getCustomPageFile(String code, String path);

    DataHandler getCustomPageData(String code);

    void delete(long id);

    UiComponentInfo getByName(String code);

    boolean isAccessibleByName(String code);

}
