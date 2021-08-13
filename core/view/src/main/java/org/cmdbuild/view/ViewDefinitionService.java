package org.cmdbuild.view;

import java.util.List;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;

public interface ViewDefinitionService {

    List<View> getAllSharedViews();

    View getSharedByName(String name);

    List<View> getViewsForCurrentUser();

    List<View> getActiveViewsForCurrentUser();

    List<View> getForCurrentUserByType(ViewType type);

    View getById(long id);

    View getForCurrentUserById(long id);

    View getSharedForCurrentUserByNameOrId(String nameOrId);

    View createForCurrentUser(View view);

    View updateForCurrentUser(View view);

    View create(View view);

    void delete(long id);

    boolean isActiveAndUserAccessibleByName(String name);

    default View getForCurrentUserByIdOrName(String viewId) {
        return isNumber(viewId) ? getForCurrentUserById(toLong(viewId)) : getSharedForCurrentUserByNameOrId(viewId);
    }

}
