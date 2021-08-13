package org.cmdbuild.dms;

import static com.google.common.base.Objects.equal;
import java.util.List;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

public interface DmsConfiguration {

    boolean isEnabled();

    String getService();

    String getDefaultDmsCategory();

    List<String> getRegularAttachmentsAllowedFileExtensions();

    List<String> getIncomingEmailAttachmentsAllowedFileExtensions();

    Integer getMaxFileSize();

    @Nullable
    String getAutolinkHelperScript();

    @Nullable
    String getAutolinkBasePath();

    default boolean hasAutolinkHelperScript() {
        return isNotBlank(getAutolinkHelperScript());
    }

    default boolean isRegularAttachmentsFileExtensionCheckEnabled() {
        return !getRegularAttachmentsAllowedFileExtensions().isEmpty();
    }

    default boolean isMaxFileSizeCheckEnabled() {
        return getMaxFileSize() != null;
    }

    default boolean isIncomingEmailFileExtensionCheckEnabled() {
        return !getIncomingEmailAttachmentsAllowedFileExtensions().isEmpty();
    }

    default boolean isEnabled(String dmsProviderServiceName) {
        return isEnabled() && equal(getService(), dmsProviderServiceName);
    }
}
