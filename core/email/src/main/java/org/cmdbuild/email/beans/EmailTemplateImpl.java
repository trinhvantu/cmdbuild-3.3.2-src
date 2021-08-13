/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.beans;

import com.google.common.collect.ImmutableList;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import java.util.List;
import java.util.Map;
import org.cmdbuild.email.EmailTemplate;

import javax.annotation.Nullable;
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_CODE;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import org.cmdbuild.dao.orm.annotations.CardAttr;
import org.cmdbuild.dao.orm.annotations.CardMapping;
import org.cmdbuild.email.EmailTemplateTriggerConditions;
import org.cmdbuild.email.NotificationType;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.utils.json.JsonBean;
import static org.cmdbuild.email.NotificationType.NT_EMAIL;
import org.cmdbuild.report.ReportConfig;
import org.cmdbuild.report.ReportConfigImpl;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;

@CardMapping("_EmailTemplate")
public class EmailTemplateImpl implements EmailTemplate {

    private final Long id, account, delay, timeToLive;
    private final String name, description, from, to, cc, bcc, subject, body, contentType;
    private final boolean keepSynchronization, promptSynchronization;
    private final Map<String, String> data;
    private final NotificationType type;
    private final List<String> participants;
    private final List<ReportConfig> reports;
    private final EmailTemplateTriggerConditions trigger;

    private EmailTemplateImpl(EmailTemplateImplBuilder builder) {
        this.id = builder.id;
        this.type = firstNotNull(builder.type, NT_EMAIL);
        this.name = checkNotBlank(builder.name, "template name is null");
        this.delay = builder.delay;
        this.account = builder.account;
        this.description = builder.description;
        this.from = builder.from;
        this.to = builder.to;
        this.cc = builder.cc;
        this.bcc = builder.bcc;
        this.subject = builder.subject;
        this.body = builder.body;
        this.contentType = checkNotBlank(builder.contentType, "content type is null");
        this.keepSynchronization = firstNotNull(builder.keepSynchronization, true);
        this.promptSynchronization = firstNotNull(builder.promptSynchronization, false);
        this.data = map(firstNonNull(builder.data, emptyMap())).immutable();
        this.participants = ImmutableList.copyOf(firstNotNull(builder.participants, emptyList()));
        this.reports = ImmutableList.copyOf(firstNotNull(builder.reports, emptyList()));
        this.timeToLive = builder.timeToLive;
        this.trigger = new EmailTemplateTriggerConditionsImpl(firstNotNull(builder.trigger, emptyMap()));
    }

    @Override
    @Nullable
    @CardAttr(ATTR_ID)
    public Long getId() {
        return id;
    }

    @Override
    @CardAttr("ContentType")
    public String getContentType() {
        return contentType;
    }

    @Override
    @Nullable
    @CardAttr
    public Long getDelay() {
        return delay;
    }

    @Override
    @Nullable
    @CardAttr
    public Long getTimeToLive() {
        return timeToLive;
    }

    @Override
    @Nullable
    @CardAttr
    public Long getAccount() {
        return account;
    }

    @Override
    @Nullable
    @CardAttr(ATTR_CODE)
    public String getName() {
        return name;
    }

    @Override
    @Nullable
    @CardAttr
    public String getDescription() {
        return description;
    }

    @Override
    @Nullable
    @CardAttr
    public String getFrom() {
        return from;
    }

    @Override
    @Nullable
    @CardAttr
    public String getTo() {
        return to;
    }

    @Override
    @Nullable
    @CardAttr("CC")
    public String getCc() {
        return cc;
    }

    @Override
    @Nullable
    @CardAttr("BCC")
    public String getBcc() {
        return bcc;
    }

    @Override
    @Nullable
    @CardAttr
    public String getSubject() {
        return subject;
    }

    @Override
    @Nullable
    @CardAttr
    public String getBody() {
        return body;
    }

    @Override
    @CardAttr
    @JsonBean
    public Map<String, String> getData() {
        return data;
    }

    @Override
    @CardAttr
    public boolean getKeepSynchronization() {
        return keepSynchronization;
    }

    @Override
    @CardAttr
    public boolean getPromptSynchronization() {
        return promptSynchronization;
    }

    @Override
    @CardAttr("NotificationType")
    public NotificationType getType() {
        return type;
    }

    @Override
    @CardAttr
    public List<String> getParticipants() {
        return participants;
    }

    @Override
    @CardAttr("Reports")
    public List<String> getReportCodes() {
        return list(reports).map(ReportConfig::getCode);
    }

    @Override
    public List<ReportConfig> getReports() {
        return reports;
    }

    @Override
    public EmailTemplateTriggerConditions getTrigger() {
        return trigger;
    }

    @JsonBean
    @CardAttr("Trigger")
    public Map<String, String> getTriggerConfig() {
        return trigger.getConfig();
    }

    @Override
    public String toString() {
        return "EmailTemplate{" + "id=" + id + ", name=" + name + '}';
    }

    public static EmailTemplateImplBuilder builder() {
        return new EmailTemplateImplBuilder();
    }

    public static EmailTemplateImplBuilder copyOf(EmailTemplate source) {
        return new EmailTemplateImplBuilder()
                .withId(source.getId())
                .withDelay(source.getDelay())
                .withAccount(source.getAccount())
                .withName(source.getName())
                .withDescription(source.getDescription())
                .withFrom(source.getFrom())
                .withTo(source.getTo())
                .withCc(source.getCc())
                .withBcc(source.getBcc())
                .withSubject(source.getSubject())
                .withBody(source.getBody())
                .withData(source.getData())
                .withContentType(source.getContentType())
                .withKeepSynchronization(source.getKeepSynchronization())
                .withPromptSynchronization(source.getPromptSynchronization())
                .withType(source.getType())
                .withParticipants(source.getParticipants())
                .withReports(source.getReports())
                .withTimeToLive(source.getTimeToLive())
                .withTrigger(source.getTrigger());
    }

    public static class EmailTemplateImplBuilder implements Builder<EmailTemplateImpl, EmailTemplateImplBuilder> {

        private Long id;
        private Long delay, timeToLive;
        private Long account;
        private String name;
        private String description;
        private String from;
        private String to;
        private String cc;
        private String bcc;
        private String subject;
        private String body, contentType;
        private Boolean keepSynchronization;
        private Boolean promptSynchronization;
        private Map<String, String> data, trigger;
        private NotificationType type;
        private List<String> participants;
        private List<ReportConfig> reports;

        public EmailTemplateImplBuilder withId(Long id) {
            this.id = id;
            return this;
        }

        public EmailTemplateImplBuilder withType(NotificationType type) {
            this.type = type;
            return this;
        }

        public EmailTemplateImplBuilder withParticipants(List<String> participants) {
            this.participants = participants;
            return this;
        }

        public EmailTemplateImplBuilder withReportCodes(List<String> reports) {
            this.reports = list(firstNotNull(reports, emptyList())).map(r -> ReportConfigImpl.builder().withCode(r).build());
            return this;
        }

        public EmailTemplateImplBuilder withReports(List<ReportConfig> reports) {
            this.reports = reports;
            return this;
        }

        public EmailTemplateImplBuilder withDelay(Long delay) {
            this.delay = delay;
            return this;
        }

        public EmailTemplateImplBuilder withTimeToLive(Long timeToLive) {
            this.timeToLive = timeToLive;
            return this;
        }

        public EmailTemplateImplBuilder withAccount(Long account) {
            this.account = account;
            return this;
        }

        public EmailTemplateImplBuilder withName(String name) {
            this.name = name;
            return this;
        }

        public EmailTemplateImplBuilder withContentType(String contentType) {
            this.contentType = contentType;
            return this;
        }

        public EmailTemplateImplBuilder withTextPlainContentType() {
            return this.withContentType("text/plain");
        }

        public EmailTemplateImplBuilder withTextHtmlContentType() {
            return this.withContentType("text/html");
        }

        public EmailTemplateImplBuilder withDescription(String description) {
            this.description = description;
            return this;
        }

        public EmailTemplateImplBuilder withFrom(String from) {
            this.from = from;
            return this;
        }

        public EmailTemplateImplBuilder withTo(String to) {
            this.to = to;
            return this;
        }

        public EmailTemplateImplBuilder withCc(String cc) {
            this.cc = cc;
            return this;
        }

        public EmailTemplateImplBuilder withBcc(String bcc) {
            this.bcc = bcc;
            return this;
        }

        public EmailTemplateImplBuilder withSubject(String subject) {
            this.subject = subject;
            return this;
        }

        public EmailTemplateImplBuilder withBody(String body) {
            this.body = body;
            return this;
        }

        public EmailTemplateImplBuilder withData(Map<String, String> data) {
            this.data = data;
            return this;
        }

        public EmailTemplateImplBuilder withKeepSynchronization(Boolean keepSynchronization) {
            this.keepSynchronization = keepSynchronization;
            return this;
        }

        public EmailTemplateImplBuilder withPromptSynchronization(Boolean promptSynchronization) {
            this.promptSynchronization = promptSynchronization;
            return this;
        }

        public EmailTemplateImplBuilder withTrigger(EmailTemplateTriggerConditions trigger) {
            this.trigger = trigger.getConfig();
            return this;
        }

        public EmailTemplateImplBuilder withTriggerConfig(Map<String, String> trigger) {
            this.trigger = trigger;
            return this;
        }

        @Override
        public EmailTemplateImpl build() {
            return new EmailTemplateImpl(this);
        }

    }
}
