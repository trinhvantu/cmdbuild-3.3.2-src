package org.cmdbuild.workflow;

import java.util.List;

public interface WorkflowConfiguration extends SharkRemoteServiceConfiguration {

    boolean returnNullPlanOnPlanError();

    boolean isEnabled();

    boolean enableCardCacheForReferenceMigration();

    boolean hideSaveButton();

    boolean isSynchronizationOfMissingVariablesDisabled();

    List<String> getEnabledWorkflowProviders();

    boolean isUserTaskParametersValidationEnabled();

    String getDefaultUserForWfJobs();

    boolean enableAddAttachmentOnClosedActivities();

    boolean isBulkAbortEnabledDefault();

    WorkflowApiErrorManagementMode getApiErrorManagementMode();

    default boolean enableSaveButton() {
        return !hideSaveButton();
    }

    default String getDefaultWorkflowProvider() {
        return getEnabledWorkflowProviders().get(0);
    }

    default boolean isWorkflowProviderEnabled(String name) {
        return getEnabledWorkflowProviders().contains(name);
    }

}
