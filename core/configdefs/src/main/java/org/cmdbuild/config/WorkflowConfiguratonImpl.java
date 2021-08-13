package org.cmdbuild.config;

import java.util.List;
import static org.cmdbuild.config.api.ConfigCategory.CC_ENV;
import org.cmdbuild.workflow.WorkflowConfiguration;
import org.cmdbuild.config.api.ConfigComponent;
import org.cmdbuild.config.api.ConfigValue;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import static org.cmdbuild.config.api.ConfigValue.TRUE;
import org.cmdbuild.workflow.WorkflowApiErrorManagementMode;
import org.springframework.stereotype.Component;

@Component
@ConfigComponent("org.cmdbuild.workflow")
public final class WorkflowConfiguratonImpl implements WorkflowConfiguration {

    @ConfigValue(key = "enabled", defaultValue = FALSE)
    private boolean isEnabled;

    @ConfigValue(key = "disableSynchronizationOfMissingVariables", defaultValue = FALSE)
    private boolean disableSynchronizationOfMissingVariables;

    @ConfigValue(key = "enableAddAttachmentOnClosedActivities", defaultValue = FALSE)
    private boolean enableAddAttachmentOnClosedActivities;

    @ConfigValue(key = "providers", defaultValue = "river", description = "workflow service providers (comma separated list, default first); valid values include 'shark' and 'river'")
    private List<String> workflowProviders;

    @ConfigValue(key = "taskParamValidation.enabled", defaultValue = FALSE, description = "enforce validation of user task parameters, on submit")
    private boolean validateUserTaskParameters;

    @ConfigValue(key = "userCanDisable", defaultValue = FALSE)
    private boolean userCanDisable;//TODO use this

    @ConfigValue(key = "hideSaveButton", defaultValue = FALSE)
    private boolean hideSaveButton;

    @ConfigValue(key = "shark.endpoint", defaultValue = "http://localhost:8080/shark", category = CC_ENV)
    private String sharkEndpoint;

    @ConfigValue(key = "shark.user", defaultValue = "admin", category = CC_ENV)
    private String sharkAdminUsername;

    @ConfigValue(key = "shark.password", defaultValue = "enhydra", category = CC_ENV)
    private String sharkAdminPassword;

    @ConfigValue(key = "returnNullProcessOnProcessError", description = "enable lenient processing of plan definitions (return null plan instead of throwing an error)", defaultValue = TRUE)
    private boolean returnNullPlanOnPlanError;

    @ConfigValue(key = "jobs.defaultUser", description = "default user for flows started by jobs", defaultValue = "workflow")
    private String defaultUserForWfJobs;

    @ConfigValue(key = "enableCardCacheForReferenceMigration", defaultValue = FALSE)
    private boolean enableCardCacheForReferenceMigration;//TODO use this

    @ConfigValue(key = "bulk.abort.enabled.default", description = "bulk process abort default enabled", defaultValue = FALSE)
    private Boolean bulkAbortEnabledDefault;

    @ConfigValue(key = "apiErrorManagementMode", description = "actions for errors in wf api calls, one of rethrow, log_and_rethrow, log_mark_and_rethrow", defaultValue = "log_and_rethrow")
    private WorkflowApiErrorManagementMode apiErrorManagementMode;

    @Override
    public boolean isBulkAbortEnabledDefault() {
        return bulkAbortEnabledDefault;
    }

    @Override
    public boolean enableAddAttachmentOnClosedActivities() {
        return enableAddAttachmentOnClosedActivities;
    }

    @Override
    public boolean hideSaveButton() {
        return hideSaveButton;
    }

    @Override
    public String getDefaultUserForWfJobs() {
        return defaultUserForWfJobs;
    }

    @Override
    public boolean returnNullPlanOnPlanError() {
        return returnNullPlanOnPlanError;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled && !getEnabledWorkflowProviders().isEmpty();
    }

    @Override
    public String getSharkServerUrl() {
        return sharkEndpoint;
    }

    @Override
    public String getSharkUsername() {
        return sharkAdminUsername;
    }

    @Override
    public String getSharkPassword() {
        return sharkAdminPassword;
    }

    @Override
    public boolean isUserTaskParametersValidationEnabled() {
        return validateUserTaskParameters;
    }

    @Override
    public boolean isSynchronizationOfMissingVariablesDisabled() {
        return disableSynchronizationOfMissingVariables;
    }

    @Override
    public List<String> getEnabledWorkflowProviders() {
        return workflowProviders;
    }

    @Override
    public boolean enableCardCacheForReferenceMigration() {
        return enableCardCacheForReferenceMigration;
    }

    @Override
    public WorkflowApiErrorManagementMode getApiErrorManagementMode() {
        return apiErrorManagementMode;
    }

}
