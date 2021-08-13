/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.sql.utils;

import org.apache.maven.artifact.versioning.ComparableVersion;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import org.springframework.lang.Nullable;

public interface SqlFunction {

    String getSignature();

    String getRequiredPatchVersion();

    String getFunctionDefinition();

    String getHash();

    @Nullable
    String getComment();

    default boolean hasComment() {
        return isNotBlank(getComment());
    }

    default ComparableVersion getRequiredPatchVersionAsComparableVersion() {
        return new ComparableVersion(getRequiredPatchVersion());
    }

}
