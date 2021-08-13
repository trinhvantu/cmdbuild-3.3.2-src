/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import javax.annotation.Nullable;
import static org.cmdbuild.auth.grant.PrivilegeSubject.privilegeId;
import org.cmdbuild.auth.grant.PrivilegeSubjectWithInfo;

public interface EtlTemplate extends EtlTemplateConfig, PrivilegeSubjectWithInfo {

    @Nullable
    @Override
    Long getId();

    String getCode();

    @Override
    String getDescription();

    boolean isActive();

    @Override
    public default String getName() {
        return getCode();
    }

    @Override
    public default String getPrivilegeId() {
        return privilegeId(PS_ETLTEMPLATE, getId());
    }

}
