package org.cmdbuild.config;

import static java.util.Collections.emptyList;
import java.util.List;
import javax.annotation.Nullable;
import static org.cmdbuild.config.api.ConfigCategory.CC_ENV;
import org.cmdbuild.config.api.ConfigComponent;
import org.cmdbuild.config.api.ConfigValue;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.dms.cmis.CmisDmsConfiguration;
import org.cmdbuild.dms.sharepoint.SharepointDmsConfiguration;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@ConfigComponent("org.cmdbuild.dms")
public final class DmsConfigurationImpl implements CmisDmsConfiguration, SharepointDmsConfiguration {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private static final String ENABLED = "enabled";
    private static final String CATEGORY_LOOKUP = "category";

    private static final String CMIS_URL = "service.cmis.url";
    private static final String CMIS_USER = "service.cmis.user";
    private static final String CMIS_PASSWORD = "service.cmis.password";
    private static final String CMIS_PATH = "service.cmis.path";

    @ConfigValue(key = "service.type", description = "dms service (cmis, postgres, sharepoint_online); cmis is a standard protocol used, for example, by Alfresco dms; postgres is an embedded dms implementation that relies upon cmdbuild postgres db", defaultValue = "cmis")
    private String service;

    @ConfigValue(key = ENABLED, description = "", defaultValue = FALSE)
    private boolean isEnabled;

    @ConfigValue(key = "autolink.script", description = "autolink helper script")
    private String autolinkHelperScript;

    @ConfigValue(key = "autolink.path", description = "autolink base path (replaces dms provider base path, for links)")
    private String autolinkPath;

    @ConfigValue(key = CATEGORY_LOOKUP, description = "", defaultValue = "AlfrescoCategory", category = CC_ENV)
    private String dmsCategory;

    @ConfigValue(key = CMIS_URL, description = "", defaultValue = "http://localhost:10080/alfresco/api/-default-/public/cmis/versions/1.1/atom", category = CC_ENV)
    private String cmisUrl;

    @ConfigValue(key = CMIS_USER, description = "", defaultValue = "admin", category = CC_ENV)
    private String cmisUser;

    @ConfigValue(key = CMIS_PASSWORD, description = "", defaultValue = "admin", category = CC_ENV)
    private String cmisPassword;

    @ConfigValue(key = CMIS_PATH, description = "", defaultValue = "/User Homes/cmdbuild", category = CC_ENV)
    private String cmdisPath;

    @ConfigValue(key = "service.sharepoint.url", description = "", defaultValue = "", category = CC_ENV)
    private String sharepointUrl;

    @ConfigValue(key = "service.sharepoint.user", description = "", defaultValue = "admin", category = CC_ENV)
    private String sharepointUser;

    @ConfigValue(key = "service.sharepoint.password", description = "", defaultValue = "admin", category = CC_ENV)
    private String sharepointPassword;

    @ConfigValue(key = "service.sharepoint.path", description = "", defaultValue = "/", category = CC_ENV)
    private String sharepointPath;

    @ConfigValue(key = "service.sharepoint.graphApi.url", defaultValue = "https://graph.microsoft.com/v1.0/", category = CC_ENV)
    private String sharepointGraphApiUrl;

    @ConfigValue(key = "service.sharepoint.auth.protocol", description = "sharepoint auth protocol (es: `msazureoauth2`)", defaultValue = "msazureoauth2", category = CC_ENV)
    private String sharepointAuthProtocol;

    @ConfigValue(key = "service.sharepoint.auth.resourceId", description = "sharepoint auth resource id", category = CC_ENV)
    private String sharepointAuthResourceId;

    @ConfigValue(key = "service.sharepoint.auth.clientId", description = "sharepoint auth client id", category = CC_ENV)
    private String sharepointAuthClientId;

    @ConfigValue(key = "service.sharepoint.auth.tenantId", description = "sharepoint auth tenant id", category = CC_ENV)
    private String sharepointAuthTenantId;

    @ConfigValue(key = "service.sharepoint.auth.serviceUrl", description = "sharepoint auth service url", defaultValue = "https://login.microsoftonline.com", category = CC_ENV)
    private String sharepointAuthServiceUrl;

    @ConfigValue(key = "service.sharepoint.auth.clientSecret", description = "sharepoint auth client secret", category = CC_ENV)
    private String sharepointAuthClientSecret;

    @ConfigValue(key = "service.sharepoint.model.authorColumn", description = "sharepoint custom author column", category = CC_ENV)
    private String sharepointCustomAuthorColumn;

    @ConfigValue(key = "service.sharepoint.model.descriptionColumn", description = "sharepoint custom description column", defaultValue = "Label", category = CC_ENV)
    private String sharepointCustomDescriptionColumn;

    @ConfigValue(key = "service.sharepoint.model.categoryColumn", description = "sharepoint custom category column", category = CC_ENV)
    private String sharepointCustomCategoryColumn;

    @ConfigValue(key = "regularAttachments.allowedFileExtensions", description = "allowed file extensions, lowercase, for card/email attachments (via ui/attachment ws)")
    private List<String> regularAttachmentsAllowedFileExtensions;

    @ConfigValue(key = "incomingEmailAttachments.allowedFileExtensions", description = "allowed file extensions, lowercase, for incoming email (rejected attachments will be ignored and print a warning, without affecting email processing)")
    private List<String> incomingEmailAttachmentsAllowedFileExtensions;

    @ConfigValue(key = "regularAttachments.maxFileSize", description = "maximum allowed file size, expressed in MB")
    private Integer maxFileSize;

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }

    @Override
    public Integer getMaxFileSize() {
        return maxFileSize;
    }

    @Override
    @Nullable
    public String getAutolinkHelperScript() {
        return autolinkHelperScript;
    }

    @Override
    @Nullable
    public String getAutolinkBasePath() {
        return autolinkPath;
    }

    @Override
    public String getService() {
        return service;
    }

    @Override
    public String getDefaultDmsCategory() {
        return dmsCategory;
    }

    @Override
    public String getCmisUrl() {
        return cmisUrl;
    }

    @Override
    public String getCmisUser() {
        return cmisUser;
    }

    @Override
    public String getCmisPassword() {
        return cmisPassword;
    }

    @Override
    public String getCmisPath() {
        return cmdisPath;
    }

    @Override
    public String getSharepointUrl() {
        return sharepointUrl;
    }

    @Override
    public String getSharepointUser() {
        return sharepointUser;
    }

    @Override
    public String getSharepointPassword() {
        return sharepointPassword;
    }

    @Override
    public String getSharepointPath() {
        return sharepointPath;
    }

    @Override
    public String getSharepointAuthProtocol() {
        return sharepointAuthProtocol;
    }

    @Override
    public String getSharepointAuthResourceId() {
        return sharepointAuthResourceId;
    }

    @Override
    public String getSharepointAuthClientId() {
        return sharepointAuthClientId;
    }

    @Override
    public String getSharepointAuthTenantId() {
        return sharepointAuthTenantId;
    }

    @Override
    public String getSharepointAuthServiceUrl() {
        return sharepointAuthServiceUrl;
    }

    @Override
    public String getSharepointAuthClientSecret() {
        return sharepointAuthClientSecret;
    }

    @Override
    @Nullable
    public String getSharepointCustomAuthorColumn() {
        return sharepointCustomAuthorColumn;
    }

    @Override
    @Nullable
    public String getSharepointCustomDescriptionColumn() {
        return sharepointCustomDescriptionColumn;
    }

    @Override
    @Nullable
    public String getSharepointCustomCategoryColumn() {
        return sharepointCustomCategoryColumn;
    }

    @Override
    public String getSharepointGraphApiBaseUrl() {
        return sharepointGraphApiUrl;
    }

    @Override
    public List<String> getRegularAttachmentsAllowedFileExtensions() {
        return firstNotNull(regularAttachmentsAllowedFileExtensions, emptyList());
    }

    @Override
    public List<String> getIncomingEmailAttachmentsAllowedFileExtensions() {
        return firstNotNull(incomingEmailAttachmentsAllowedFileExtensions, emptyList());
    }

}
