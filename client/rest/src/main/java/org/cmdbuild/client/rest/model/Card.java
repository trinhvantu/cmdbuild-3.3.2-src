/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.model;

import static com.google.common.base.Strings.nullToEmpty;
import java.util.Map;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.common.beans.CardIdAndClassName;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;

public interface Card extends CardIdAndClassName {

    @Override
    Long getId();

    Map<String, Object> getAttributes();

    default boolean hasCardId() {
        return !isNotNullAndGtZero(getId());
    }

    default boolean hasClassId() {
        return !isBlank(getClassName());
    }

    default String getDescription() {
        return nullToEmpty((String) getAttributes().get("Description"));
    }
}
