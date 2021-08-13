/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.api;

import java.util.Map;
import javax.annotation.Nullable;
import org.cmdbuild.auth.grant.GrantMode;
import org.cmdbuild.auth.role.RoleInfo;
import org.cmdbuild.auth.user.LoginUserInfo;
import org.cmdbuild.client.rest.model.ClassData;
import static org.cmdbuild.utils.lang.CmMapUtils.map;

public interface UserApi {

    LoginUserInfo createUser(String username, @Nullable String password, String... groups);

    RoleInfo createRole(String rolename);

    UserApi setUserPreferences(Map<String, String> preferences);

    UserApi setRolePrivilegesOnClass(String rolename, String classId, GrantMode mode);

    UserApi setRolePrivilegesOnProcess(String rolename, String processId, GrantMode mode);

    UserApi setRolePrivilegesOnView(String rolename, String viewId, GrantMode mode);

    default UserApi setRolePrivilegesOnClass(RoleInfo role, ClassData classe, GrantMode mode) {
        return setRolePrivilegesOnClass(role.getName(), classe.getName(), mode);
    }

    default UserApi setUserPreferences(String... preferences) {
        return setUserPreferences(map((Object[]) preferences));
    }
}
