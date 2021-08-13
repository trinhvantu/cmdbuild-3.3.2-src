/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.auth.grant;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import java.util.Map;
import javax.annotation.Nullable;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_CLONE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_CREATE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_DELETE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_UPDATE;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public interface GrantData {

    static final String GDCP_CREATE = serializeEnum(CP_CREATE),
            GDCP_UPDATE = serializeEnum(CP_UPDATE),
            GDCP_DELETE = serializeEnum(CP_DELETE),
            GDCP_CLONE = serializeEnum(CP_CLONE);

    @Nullable
    Long getId();

    PrivilegedObjectType getType();

    GrantMode getMode();

    @Nullable
    String getClassName();

    @Nullable
    Long getObjectId();

    long getRoleId();

    @Nullable
    String getPrivilegeFilter();

    @Nullable
    Map<String, String> getAttributePrivileges();

    Map<String, Object> getCustomPrivileges();

    default Object getObjectIdOrClassName() {
        switch (getType()) {
            case POT_CLASS:
            case POT_PROCESS:
                return checkNotBlank(getClassName());
            case POT_VIEW:
            case POT_FILTER:
            case POT_CUSTOMPAGE:
            case POT_REPORT:
            case POT_ETLTEMPLATE:
            case POT_ETLGATE:
            case POT_DASHBOARD:
                return checkNotNull(getObjectId());
            default:
                throw unsupported("unsupported grant type = %s", getType());
        }
    }

    default boolean isMode(GrantMode grantMode) {
        return equal(getMode(), grantMode);
    }

}
