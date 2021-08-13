package org.cmdbuild.email;

import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import org.cmdbuild.report.ReportConfig;

public interface EmailTemplate {

    @Nullable
    Long getId();

    String getName();

    @Nullable
    String getDescription();

    @Nullable
    String getFrom();

    @Nullable
    String getTo();

    @Nullable
    String getCc();

    @Nullable
    String getBcc();

    @Nullable
    String getSubject();

    @Nullable
    String getBody();

    String getContentType();

    Map<String, String> getData();

    @Nullable
    Long getAccount();

    boolean getKeepSynchronization();

    boolean getPromptSynchronization();

    @Nullable
    Long getDelay();

    @Nullable
    Long getTimeToLive();

    NotificationType getType();

    List<String> getParticipants();

    List<String> getReportCodes();
    
    List<ReportConfig> getReports();
    
    EmailTemplateTriggerConditions getTrigger();

    default boolean hasNegativeDelay() {
        return getDelay() != null && getDelay() < 0;
    }

    default boolean hasAccount() {
        return getAccount() != null;
    }

    default boolean hasReports() {
        return !getReportCodes().isEmpty();
    }

}
