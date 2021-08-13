package org.cmdbuild.view;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import javax.annotation.Nullable;
import org.cmdbuild.auth.grant.PrivilegeSubjectWithInfo;
import org.cmdbuild.view.join.JoinViewConfig;

public interface View extends PrivilegeSubjectWithInfo {

    final String ATTR_SHARED = "Shared", ATTR_USER_ID = "UserId";

    @Override
    @Nullable
    Long getId();

    @Override
    String getName();

    @Override
    String getDescription();

    @Nullable
    String getSourceClass();

    @Nullable
    String getSourceFunction();

    @Nullable
    String getFilter();

    @Nullable
    JoinViewConfig getJoinConfig();

    ViewType getType();

    boolean isActive();

    boolean isShared();

    @Nullable
    Long getUserId();

    @Override
    String getPrivilegeId();

    default boolean isOfType(ViewType type) {
        return equal(getType(), type);
    }

    default JoinViewConfig getJoinConfigNotNull() {
        return checkNotNull(getJoinConfig());
    }

}
