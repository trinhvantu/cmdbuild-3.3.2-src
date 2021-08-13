/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import static com.google.common.base.Objects.equal;
import javax.annotation.Nullable;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_IGNORE;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;

public interface EtlTemplateColumnConfig extends EtlTemplateFieldFormatConfig {

    String getAttributeName();

    String getColumnName();

    EtlTemplateColumnMode getMode();

    @Nullable
    String getDefault();

    default boolean ignoreColumn() {
        return equal(getMode(), ETCM_IGNORE);
    }

    default boolean doNotIgnoreColumn() {
        return !ignoreColumn();
    }

    default boolean hasDefault() {
        return isNotBlank(getDefault());
    }

}
