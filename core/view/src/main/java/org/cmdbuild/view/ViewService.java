/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.view;

import java.util.Map;
import org.cmdbuild.dao.beans.Card;

public interface ViewService extends ViewAccessService, ViewDefinitionService {

    final String JOIN_VIEW_ATTR_JOIN_ID = "CmJoinId", ATTR_DESCR_INHERITED_FROM = "CM_JOIN_VIEW_ATTR_DESCR_INHERITED_FROM";

    default Card getCardForCurrentUser(String viewId, String cardId) {
        return getCardForCurrentUser(getForCurrentUserByIdOrName(viewId), cardId);
    }

    default Card createUserCard(String viewId, Map<String, Object> values) {
        return createUserCard(getForCurrentUserByIdOrName(viewId), values);
    }

    default Card updateUserCard(String viewId, long cardId, Map<String, Object> values) {
        return updateUserCard(getForCurrentUserByIdOrName(viewId), cardId, values);
    }

    default void deleteUserCard(String viewId, long cardId) {
        deleteUserCard(getForCurrentUserByIdOrName(viewId), cardId);
    }
}
