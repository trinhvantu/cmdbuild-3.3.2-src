package org.cmdbuild.dms.sharepoint;

import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.dms.DmsConfiguration;

public interface SharepointDmsConfiguration extends DmsConfiguration {

    String getSharepointUrl();

    String getSharepointUser();

    String getSharepointPassword();

    String getSharepointPath();

    String getSharepointAuthProtocol();

    String getSharepointAuthResourceId();

    String getSharepointAuthClientId();

    String getSharepointAuthTenantId();

    String getSharepointAuthServiceUrl();

    String getSharepointAuthClientSecret();

    String getSharepointGraphApiBaseUrl();

    @Nullable
    String getSharepointCustomAuthorColumn();

    @Nullable
    String getSharepointCustomDescriptionColumn();

    @Nullable
    String getSharepointCustomCategoryColumn();

    default boolean hasSharepointCustomAuthorColumn() {
        return isNotBlank(getSharepointCustomAuthorColumn());
    }

    default boolean hasSharepointCustomDescriptionColumn() {
        return isNotBlank(getSharepointCustomDescriptionColumn());
    }

    default boolean hasSharepointCustomCategoryColumn() {
        return isNotBlank(getSharepointCustomCategoryColumn());
    }

}
