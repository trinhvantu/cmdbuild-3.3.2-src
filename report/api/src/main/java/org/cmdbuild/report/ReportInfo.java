/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.report;

import javax.annotation.Nullable;
import static org.cmdbuild.auth.grant.PrivilegeSubject.privilegeId;
import org.cmdbuild.auth.grant.PrivilegeSubjectWithInfo;

public interface ReportInfo extends PrivilegeSubjectWithInfo {

    @Nullable
    @Override
    Long getId();

    String getCode();

    @Override
    default String getName() {
        return getCode();
    }

    @Override
    String getDescription();

    boolean isActive();

    @Override
    public default String getPrivilegeId() {
        return privilegeId(PS_REPORT, getId());
    }

}
