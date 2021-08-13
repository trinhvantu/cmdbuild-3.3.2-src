package org.cmdbuild.config;

import java.util.List;
import java.util.Set;
import javax.annotation.Nullable;
import org.cmdbuild.fault.FaultEventLevel;
import org.cmdbuild.common.localization.LanguageConfiguration;

public interface CoreConfiguration extends LanguageConfiguration {

    public static final String CORE_NAMESPACE = "org.cmdbuild.core",
            CORE_LOGGER_CONFIG = "logger.config",
            CORE_LOGGER_CONFIG_PROPERTY = CORE_NAMESPACE + "." + CORE_LOGGER_CONFIG,
            CORE_LOGGER_AUTOCONFIGURE = "logger.autoconfigure",
            CORE_LOGGER_AUTOCONFIGURE_PROPERTY = CORE_NAMESPACE + "." + CORE_LOGGER_AUTOCONFIGURE,
            CORE_CONFIG_READY = "config.ready",
            CORE_CONFIG_READY_PROPERTY = CORE_NAMESPACE + "." + CORE_CONFIG_READY,
            CORE_LOGGER_STATIC_LOGBACK_CONFIG_LOCATION = CORE_NAMESPACE + "." + "logger.static.location";

    boolean runDatabaseHousekeepingFunctionAtStartup();

    boolean runDatabaseHousekeepingFunctionDaily();

    boolean isMaintenanceModeEnabled();

    String getMaintenanceModePasstoken();

    boolean allowConfigUpdateViaWs();

    int getSessionPersistDelay();

    boolean disableReplayAttackCheck();

    boolean useLanguagePrompt();

    String getStartingClassName();

    String getDemoModeAdmin();

    @Nullable
    String getInstanceName();

    String getTabsPosition();

    int getSessionTimeoutOrDefault();

    boolean getLockCard();

    boolean getLockCardUserVisible();

    boolean enableMultigrupByDefault();

    int getLockCardTimeOut();

    int getRelationLimit();

    Set<String> getEnabledLanguages();

    Set<String> getLoginLanguages();

    String getRedirectOnLogout();

    boolean isImportCsvOneByOne();

    int getSessionActivePeriodForStatistics();

    List<String> getTrustedKeys();

    FaultEventLevel getNotificationMessagesLevelThreshold();

    @Nullable
    Long getCompanyLogoUploadsId();

    boolean getCardlockEnabled();

    boolean sessionKeepaliveEnabled();

    boolean getCardlockShowUser();

    boolean triggerSystemWarningForTest();

    boolean triggerSystemCriticalForTest();

    String getAsciiArtBanner();

    String getLoggerConfig();

    boolean isLogbackAutoconfigurationEnabled();

    boolean isImportBatchInsertEnabled();

    boolean isChangePasswordRequiredForNewUser();

    boolean isBulkUpdateEnabledDefault();

    boolean isBulkDeleteEnabledDefault();

    int getImportBatchInsertMaxSize();

    boolean isCardCacheEnabled();

    int getCardCacheMaxRecordsPerClass();

    /**
     * persist only locks with last persist date older than this (unless lock
     * data has changed). This is to avoid multiple write on db for repeated
     * lock acquisitions within the same method or method sequence; only the
     * first write will be committed, others will be discarded for
     * {@link #getLockCardPersistDelay()} seconds.
     *
     * @return
     */
    default int getLockCardPersistDelay() {
        return 10; //seconds
    }

    boolean isChatEnabled();

    @Nullable
    String getTimezone();
}
