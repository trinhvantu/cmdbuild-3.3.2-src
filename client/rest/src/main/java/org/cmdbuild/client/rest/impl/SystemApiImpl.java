/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.cmdbuild.client.rest.model.LoggerInfoImpl;
import com.google.common.base.Joiner;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.emptyToNull;
import static com.google.common.base.Strings.nullToEmpty;
import static com.google.common.collect.ImmutableList.toImmutableList;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Ordering;
import com.google.common.collect.Streams;
import org.cmdbuild.client.rest.core.RestWsClient;
import org.cmdbuild.client.rest.core.AbstractServiceClientImpl;
import static com.google.common.collect.Streams.stream;
import com.google.common.net.UrlEscapers;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.InputStream;
import static java.lang.String.format;
import java.net.URI;
import java.time.ZonedDateTime;
import java.util.Collection;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import static java.util.Collections.singletonList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import javax.websocket.ClientEndpointConfig;
import javax.websocket.CloseReason;
import javax.websocket.Endpoint;
import javax.websocket.EndpointConfig;
import javax.websocket.MessageHandler;
import javax.websocket.Session;
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.apache.http.HttpEntity;
import org.apache.http.entity.ContentType;
import static org.apache.http.entity.ContentType.APPLICATION_FORM_URLENCODED;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.cmdbuild.audit.ErrorMessageDataImpl;
import org.cmdbuild.audit.ErrorMessagesData;
import org.cmdbuild.auth.multitenant.config.MultitenantMode;
import org.cmdbuild.client.rest.api.NodeStatus;
import org.cmdbuild.client.rest.model.ClusterStatus;
import org.cmdbuild.client.rest.model.LogMessage;
import org.cmdbuild.client.rest.model.LoggerInfo;
import org.cmdbuild.client.rest.model.PatchInfo;
import org.cmdbuild.client.rest.model.ServiceStatusInfo;
import org.cmdbuild.services.SystemStatus;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.client.rest.api.SystemApi;
import org.cmdbuild.cluster.ClusterNode;
import org.cmdbuild.cluster.ClusterNodeImpl;
import org.cmdbuild.fault.FaultEventLevel;
import static org.cmdbuild.common.http.HttpConst.CMDBUILD_AUTHORIZATION_HEADER;
import org.cmdbuild.dao.MyPooledDataSource;
import org.cmdbuild.dao.MyPooledDataSource.ConnectionInfo;
import org.cmdbuild.dao.MyPooledDataSource.ConnectionStatus;
import org.cmdbuild.dao.datasource.utils.ConnectionInfoImpl;
import org.cmdbuild.debuginfo.DebugInfoImpl;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.debuginfo.BugReportInfo;
import org.cmdbuild.etl.gate.inner.EtlGate;
import org.cmdbuild.etl.gate.inner.EtlGateHandler;
import org.cmdbuild.etl.gate.inner.EtlGateHandlerImpl;
import org.cmdbuild.etl.gate.inner.EtlGateImpl;
import org.cmdbuild.etl.gate.inner.EtlProcessingMode;
import org.cmdbuild.etl.loader.EtlProcessingResult;
import org.cmdbuild.etl.loader.inner.EtlProcessingResultErrorImpl;
import org.cmdbuild.etl.loader.inner.EtlProcessingResultImpl;
import org.cmdbuild.jobs.JobData;
import org.cmdbuild.jobs.JobRun;
import org.cmdbuild.jobs.JobRunStatus;
import org.cmdbuild.jobs.beans.JobDataImpl;
import org.cmdbuild.jobs.beans.JobRunImpl;
import org.cmdbuild.log.LogService.LogLevel;
import org.cmdbuild.scheduler.ScheduledJobInfo;
import org.cmdbuild.scheduler.ScheduledJobInfoImpl;
import org.cmdbuild.services.MinionStatus;
import org.cmdbuild.utils.date.CmDateUtils;
import static org.cmdbuild.utils.json.CmJsonUtils.MAP_OF_OBJECTS;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import static org.cmdbuild.utils.lang.CmConvertUtils.convert;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.glassfish.tyrus.client.ClientManager;
import static org.cmdbuild.services.SystemServiceStatusUtils.parseMinionStatus;
import org.cmdbuild.sysmon.SystemErrorInfo;
import org.cmdbuild.sysmon.SystemErrorInfoImpl;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;
import static org.cmdbuild.utils.encode.CmEncodeUtils.encodeHex;
import org.cmdbuild.utils.io.BigByteArray;
import static org.cmdbuild.utils.json.CmJsonUtils.MAP_OF_STRINGS;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmMapUtils.toMap;
import static org.cmdbuild.utils.lang.CmPreconditions.trimAndCheckNotBlank;
import static org.cmdbuild.auth.multitenant.config.MultitenantMode.MTM_CMDBUILD_CLASS;
import static org.cmdbuild.auth.multitenant.config.MultitenantMode.MTM_DB_FUNCTION;
import org.cmdbuild.config.api.ConfigCategory;
import org.cmdbuild.config.api.ConfigDefinition;
import org.cmdbuild.config.api.ConfigDefinitionImpl;
import org.cmdbuild.config.api.ConfigLocation;

public class SystemApiImpl extends AbstractServiceClientImpl implements SystemApi {

    public SystemApiImpl(RestWsClient restClient) {
        super(restClient);
    }

    private Boolean requireSession;

    @Override
    protected boolean isSessionTokenRequired() {
        return firstNonNull(requireSession, true);
    }

    @Override
    public EtlGate getGate(String gateId) {
        return parseEtlGate(get(format("etl/gates/%s", encodeUrlPath(gateId))).asJackson().get("data"));
    }

    @Override
    public DataSource downloadSystemDiagram(Collection<String> classes) {
        return getDataSource(format("system/database/diagram?classes=%s", encodeUrlQuery(Joiner.on(",").join(ImmutableSet.copyOf(classes)))));
    }

    @Override
    public EtlGate updateGate(EtlGate gate) {
        return parseEtlGate(put(format("etl/gates/%s", encodeUrlPath(gate.getCode())), map(
                "_id", gate.getId(),
                "code", gate.getCode(),
                "allowPublicAccess", gate.getAllowPublicAccess(),
                "processingMode", serializeEnum(gate.getProcessingMode()),
                "handlers", gate.getHandlers().stream().map(EtlGateHandler::getConfig).collect(toImmutableList()),
                "enabled", gate.isEnabled(),
                "config", map(gate.getConfig())
        )).asJackson().get("data"));
    }

    @Override
    @Nullable
    public EtlProcessingResult postToGate(String gateId, DataSource newDataSource) {
        Response response = post(format("/services/etl/gate/private/%s", encodeUrlPath(gateId)), newDataSource);
        if (response.hasContent()) {
            ObjectNode data = (ObjectNode) response.asJackson().get("data");
            if (data != null && data.has("created")) {
                return new EtlProcessingResultImpl(data.get("created").asLong(), data.get("modified").asLong(), data.get("unmodified").asLong(), data.get("deleted").asLong(), data.get("processed").asLong(),
                        stream((ArrayNode) data.get("errors")).map(e -> new EtlProcessingResultErrorImpl(
                        e.get("recordNumber").asLong(),
                        e.get("lineNumber").asLong(),
                        emptyMap(), //TODO record data
                        e.get("message").asText(),
                        e.get("techMessage").asText())).collect(toList())
                );//TODO retailed report
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    private EtlGate parseEtlGate(JsonNode data) {
        return EtlGateImpl.builder()
                .withId(data.get("_id").asLong())
                .withCode(data.get("code").asText())
                .withAllowPublicAccess(data.get("allowPublicAccess").asBoolean())
                .withProcessingMode(parseEnum(data.get("processingMode").asText(), EtlProcessingMode.class))
                .withHandlers(stream(data.get("handlers").elements()).map(e -> new EtlGateHandlerImpl((Map) fromJson(e, MAP_OF_STRINGS))).collect(toImmutableList()))
                .withEnabled(data.get("enabled").asBoolean())
                .withConfig(fromJson(data.get("config"), MAP_OF_STRINGS))
                .build();
    }

    @Override
    public List<JobData> getJobs() {
        return Streams.stream(get("jobs?detailed=true").asJson().getAsJsonObject().getAsJsonArray("data")).map(JsonElement::getAsJsonObject)
                .map(this::parseJobData).collect(toList());
    }

    @Override
    public List<SystemErrorInfo> getEvents() {
        return Streams.stream(get("system/events").asJson().getAsJsonObject().getAsJsonArray("data")).map(JsonElement::getAsJsonObject)
                .map(data -> SystemErrorInfoImpl.builder()
                .withTimestamp(toDateTime(data.get("timestamp")))
                .withCategory(toString(data.get("category")))
                .withSource(toString(data.get("source")))
                .withLevel(parseEnum(toString(data.get("level")), FaultEventLevel.class))
                .withMessage(toString(data.get("message")))
                .build()).collect(toList());
    }

    @Override
    public List<ScheduledJobInfo> getSysJobs() {
        return Streams.stream(get("system/scheduler/jobs").asJson().getAsJsonObject().getAsJsonArray("data")).map(JsonElement::getAsJsonObject).map(data -> ScheduledJobInfoImpl.builder()
                .withCode(toString(data.get("_id")))
                .withTrigger(toString(data.get("trigger")))
                .withRunning(toBoolean(data.get("isRunning")))
                .withLastRun(toDateTime(data.get("lastRun"))).build()).collect(toList());
    }

    @Override
    public JobData getJob(String jobId) {
        return parseJobData(get(format("jobs/%s", encodeUrlPath(jobId))).asJson().getAsJsonObject().getAsJsonObject("data"));
    }

    @Override
    public void runSysJob(String key) {
        post(format("system/scheduler/jobs/%s/trigger", encodeHex(checkNotBlank(key))), "");
    }

    @Override
    public JobData updateJob(JobData jobData) {
        return parseJobData(put(format("jobs/%s", encodeUrlPath(jobData.getCode())), map(
                "_id", jobData.getId(),
                "code", jobData.getCode(),
                "description", jobData.getDescription(),
                "type", jobData.getType(),
                "enabled", jobData.isEnabled(),
                "config", map(jobData.getConfig())
        )).asJson().getAsJsonObject().getAsJsonObject("data"));
    }

    private JobData parseJobData(JsonObject data) {
        return JobDataImpl.builder()
                .withId(toLong(data.get("_id")))
                .withCode(toString(data.get("code")))
                .withDescription(toString(data.get("description")))
                .withType(toString(data.get("type")))
                .withEnabled(toBoolean(data.get("enabled")))
                .withConfig(data.get("config").getAsJsonObject().entrySet().stream().collect(toMap(Entry::getKey, e -> toString(e.getValue()))))
                .build();
    }

    @Override
    public JobRun runJob(String jobId, Map<String, String> configOverride) {
        return parseJobRun(post(format("jobs/%s/run", encodeUrlPath(jobId)), map("config", configOverride)).asJson().getAsJsonObject().getAsJsonObject("data"));
    }

    @Override
    public JsonObject configureMultitenant(MultitenantMode multitenantMode, @Nullable String classCode) {
        return post("tenants/configure", map().accept((t) -> {
            if (multitenantMode.equals(MTM_CMDBUILD_CLASS)) {
                t.with("org.cmdbuild.multitenant.mode", "CMDBUILD_CLASS");
                t.with("org.cmdbuild.multitenant.tenantClass", classCode);
            } else if (multitenantMode.equals(MTM_DB_FUNCTION)) {
                t.with("org.cmdbuild.multitenant.mode", "DB_FUNCTION");
            }
        })).asJson().getAsJsonObject().getAsJsonObject("data");
    }

    @Override
    public void interrupt(String requestId) {
        delete(format("system/requests/%s", encodeUrlPath(checkNotBlank(requestId))));
    }

    @Override
    public JobRun getJobRun(String jobId, long runId) {
        return parseJobRun(get(format("jobs/%s/runs/%s", encodeUrlPath(jobId), runId)).asJson().getAsJsonObject().getAsJsonObject("data"));
    }

    private JobRun parseJobRun(JsonObject data) {
        return JobRunImpl.builder()
                .withId(toLong(data.get("_id")))
                .withJobCode(toString(data.get("jobCode")))
                .withJobStatus(parseEnum(toString(data.get("status")), JobRunStatus.class))
                .withCompleted(toBoolean(data.get("completed")))
                .withTimestamp(toDateTime(data.get("timestamp")))
                .withElapsedTime(toLong(data.get("elapsedMillis")))
                .withErrorMessageData(new ErrorMessagesData(stream(data.get("errors").getAsJsonArray()).map(JsonElement::getAsJsonObject) //TODO duplicate code, fix
                        .map((e) -> new ErrorMessageDataImpl(parseEnum(toString(e.get("level")), FaultEventLevel.class), toString(e.get("message")), toString(e.get("exception")))).collect(toList())))
                .withLogs(toString(data.get("logs")))
                .build();
    }

    @Override
    public List<JobRun> getLastJobRuns(String jobId, long limit) {
        return parseJobRuns(get(format("jobs/%s/runs?limit=%s", encodeUrlPath(jobId), limit)).asJson());
    }

    @Override
    public List<JobRun> getLastJobErrors(String jobId, long limit) {
        return parseJobRuns(get(format("jobs/%s/errors?limit=%s", encodeUrlPath(jobId), limit)).asJson());
    }

    @Override
    public List<JobRun> getLastJobRuns(long limit) {
        return parseJobRuns(get(format("jobs/_ANY/runs?limit=%s", limit)).asJson());
    }

    @Override
    public List<JobRun> getLastJobErrors(long limit) {
        return parseJobRuns(get(format("jobs/_ANY/errors?limit=%s", limit)).asJson());
    }

    private List<JobRun> parseJobRuns(JsonElement reqResponse) {
        JsonArray requests = reqResponse.getAsJsonObject().getAsJsonArray("data");
        return Streams.stream(requests).map((JsonElement::getAsJsonObject)).map((data) -> {
            return JobRunImpl.builder()
                    .withId(toLong(data.get("_id")))
                    .withJobCode(toString(data.get("jobCode")))
                    .withJobStatus(parseEnum(toString(data.get("status")), JobRunStatus.class))
                    .withCompleted(toBoolean(data.get("completed")))
                    .withTimestamp(toDateTime(data.get("timestamp")))
                    .withElapsedTime(toLong(data.get("elapsedMillis")))
                    .withErrorMessages(emptyList())
                    .build();

        }).collect(toList());
    }

    @Override
    public List<LoggerInfo> getLoggers() {
        logger.debug("getLoggers");
        return stream(get("system/loggers").asJson().getAsJsonObject().getAsJsonArray("data"))
                .map(JsonElement::getAsJsonObject)
                .map((record) -> new LoggerInfoImpl(record.getAsJsonPrimitive("category").getAsString(), record.getAsJsonPrimitive("level").getAsString()))
                .collect(toList());
    }

    @Override
    public void setLogger(LoggerInfo loggerToUpdate) {
        logger.debug("updateLogger = {}", loggerToUpdate);
        post("system/loggers/" + trimAndCheckNotBlank(loggerToUpdate.getCategory()), trimAndCheckNotBlank(loggerToUpdate.getLevel()));
    }

    @Override
    public void deleteLogger(String category) {
        logger.debug("deleteLogger = {}", category);
        delete("system/loggers/" + trimAndCheckNotBlank(category));
    }

    @Override
    public Future<Void> streamLogMessages(Consumer<LogMessage> listener) {
        try {
            String sessionId = restClient().getSessionToken();
            ClientEndpointConfig cec = ClientEndpointConfig.Builder.create().configurator(new ClientEndpointConfig.Configurator() {
                @Override
                public void beforeRequest(Map<String, List<String>> headers) {
                    headers.put(CMDBUILD_AUTHORIZATION_HEADER, singletonList(sessionId));
                }

            }).build();
            ClientManager client = ClientManager.createClient();
            CompletableFuture connectionReadyFuture = new CompletableFuture(), connectionClosedFuture = new CompletableFuture();
            client.connectToServer(new Endpoint() {

                @Override
                public void onOpen(Session session, EndpointConfig config) {
                    try {
                        logger.debug("bimserver session opened = {}", session.getId());
                    } catch (Exception ex) {
                        logger.error("error processing bimserver open session event", ex);
                    }

                    session.addMessageHandler(new MessageHandler.Whole<String>() {

                        @Override
                        public void onMessage(String msg) {
                            Map<String, Object> payload = fromJson(msg, MAP_OF_OBJECTS);
                            switch (nullToEmpty(toStringOrNull(payload.get("_event")))) {
                                case "socket.session.ok":
                                    connectionReadyFuture.complete(true);
                                    break;
                                case "log.message":
                                    LogMessage logMessage = new LogMessageImpl(payload);
                                    listener.accept(logMessage);
                                    break;
                                case "socket.error":
                                    ((CompletableFuture) connectionReadyFuture).completeExceptionally(runtime("error opening socket connection: %s", msg));
                                    //TODO close connection (?)
                                    break;
                            }
                        }

                    });
                    try {
                        session.getBasicRemote().sendText(toJson(map("_action", "socket.session.login", "token", sessionId)));
                    } catch (IOException ex) {
                        throw runtime(ex);
                    }
                }

                @Override
                public void onClose(Session session, CloseReason closeReason) {
                    logger.debug("websocket session closed, session = {}, reason = {}", session.getId(), closeReason);
                    connectionClosedFuture.complete(true);
                }

            }, cec, new URI(restClient().getServerUrl().replaceFirst("http", "ws") + "/services/websocket/v1/main"));
            connectionReadyFuture.get(5, TimeUnit.SECONDS);
            post("system/loggers/stream", "");
            return connectionClosedFuture;
        } catch (Exception ex) {
            throw runtime(ex);
        }
    }

    @Override
    public Map<String, String> getConfig() {
        logger.debug("getConfig");
        Map<String, String> map = map();
        get("system/config").asJson().getAsJsonObject().getAsJsonObject("data").entrySet().forEach((entry) -> {
            map.put(entry.getKey(), toString(entry.getValue()));
        });
        return map;
    }

    @Override
    public Map<String, ConfigDefinition> getConfigDefinitions() {
        logger.debug("getConfigDefinitions");
        Map<String, ConfigDefinition> map = map();
        get("system/config?detailed=true").asJson().getAsJsonObject().getAsJsonObject("data").entrySet().stream()
                .filter(e -> toBoolean(e.getValue().getAsJsonObject().get("hasDefinition")))
                .forEach((entry) -> map.put(entry.getKey(), ConfigDefinitionImpl.builder()
                .withKey(entry.getKey())
                .withDefaultValue(toString(entry.getValue().getAsJsonObject().get("default")))
                .withDescription(toString(entry.getValue().getAsJsonObject().get("description")))
                .withCategory(parseEnum(toString(entry.getValue().getAsJsonObject().get("category")), ConfigCategory.class))
                .withLocation(parseEnum(toString(entry.getValue().getAsJsonObject().get("location")), ConfigLocation.class))
                .build()));
        return map;
    }

    @Override
    public void upgradeWebapp(InputStream warFileData) {
        checkNotNull(warFileData, "data param cannot be null");
        HttpEntity multipart = MultipartEntityBuilder.create().addBinaryBody("file", listenUpload("war file upload", warFileData), ContentType.APPLICATION_OCTET_STREAM, "file.war").build();
        post("system/upgrade", multipart);
    }

    @Override
    public void recreateDatabase(InputStream dumpFileData, boolean freezesessions) {
        checkNotNull(dumpFileData, "data param cannot be null");
        HttpEntity multipart = MultipartEntityBuilder.create().addBinaryBody("file", listenUpload("dump file upload", dumpFileData), ContentType.APPLICATION_OCTET_STREAM, "file.dump").build();
        post("system/database/import?freezesessions=" + freezesessions, multipart);
    }

    @Override
    public String getConfig(String key) {
        logger.debug("getConfig for key = {}", key);
        return toString(get("system/config/" + trimAndCheckNotBlank(key)).asJson().getAsJsonObject().getAsJsonPrimitive("data"));
    }

    @Override
    @Nullable
    public String eval(String script, @Nullable String language) {
        return toString(post("system/eval" + (isBlank(language) ? "" : format("?language=%s", UrlEscapers.urlFormParameterEscaper().escape(language))), new StringEntity(format("script=%s", UrlEscapers.urlFormParameterEscaper().escape(script)), APPLICATION_FORM_URLENCODED))
                .asJson().getAsJsonObject().getAsJsonObject("data").get("output"));
    }

    @Override
    public SystemApi setConfig(String key, String value) {
        logger.debug("setConfig for key = {} to value = {}", key, value);
        put("system/config/" + trimAndCheckNotBlank(key), value);
        return this;
    }

    @Override
    public SystemApi setConfigs(Map<String, String> data) {
        logger.debug("setConfig with data = {}", data);
        put("system/config/_MANY", data);
        return this;
    }

    @Override
    public SystemApi deleteConfig(String key) {
        logger.debug("deleteConfig for key = {}", key);
        delete("system/config/" + trimAndCheckNotBlank(key));
        return this;
    }

    @Override
    public void sendBroadcast(String message) {
        checkNotBlank(message);
        post("system/messages/broadcast?message=" + encodeUrlQuery(message), "");
    }

    @Override
    public List<PatchInfo> getPatches() {
        try {
            requireSession = false; //this is not great. TODO: refactor this with aspectj or something
            logger.debug("get patches");
            return stream(get("boot/patches").asJson().getAsJsonObject().getAsJsonArray("data")).map(JsonElement::getAsJsonObject).map((patch) -> {
                return new PatchInfoImpl(toString(patch.get("name")), toString(patch.get("description")), toString(patch.get("category")));
            }).collect(toList());
        } finally {
            requireSession = null;
        }
    }

    @Override
    public List<ServiceStatusInfo> getServicesStatus() {
        return stream(get("system_services").asJson().getAsJsonObject().getAsJsonArray("data")).map(JsonElement::getAsJsonObject).map((patch) -> {
            String name = checkNotBlank(toString(patch.get("name")));
            MinionStatus status = parseMinionStatus(toString(patch.get("status")));
            return new ServiceStatusInfoImpl(name, status);
        }).collect(toList());
    }

    private final class ServiceStatusInfoImpl implements ServiceStatusInfo {

        private final String name;
        private final MinionStatus status;

        public ServiceStatusInfoImpl(String name, MinionStatus status) {
            this.name = checkNotBlank(name);
            this.status = checkNotNull(status);
        }

        @Override
        public String getServiceName() {
            return name;
        }

        @Override
        public MinionStatus getServiceStatus() {
            return status;
        }

    }

    @Override
    public SystemStatus getStatus() {
        try {
            requireSession = false; //this is not great. TODO: refactor this with aspectj or something
            logger.debug("getStatus");
            JsonElement response = get("boot/status").asJson();
            String systemStatusValue = trimAndCheckNotBlank(response.getAsJsonObject().get("status").getAsString(), "cannot find status code in response");
            return parseEnum(systemStatusValue, SystemStatus.class);
        } finally {
            requireSession = null;
        }
    }

    @Override
    public Map<String, String> getSystemInfo() {
        return fromJson(get("system/status").asJackson().get("data"), MAP_OF_STRINGS);
    }

    @Override
    public List<ConnectionInfo> getPoolStatus() {
        return stream(get("system/database/pool/debug").asJackson().get("data").get("connections").elements())
                .map(e -> new ConnectionInfoImpl(parseEnum(e.get("status").asText(), ConnectionStatus.class), e.get("trace").asText())).collect(toImmutableList());
    }

    @Override
    public ClusterStatus getClusterStatus() {
        JsonObject data = get("system/cluster/status").asJson().getAsJsonObject().getAsJsonObject("data");
        boolean isRunning = data.getAsJsonPrimitive("running").getAsBoolean();
        List<ClusterNode> nodes;
        if (isRunning) {
            nodes = stream(data.getAsJsonArray("nodes")).map(n -> new ClusterNodeImpl(n.getAsJsonObject().get("nodeId").getAsString(),
                    n.getAsJsonObject().get("address").getAsString(),
                    n.getAsJsonObject().get("thisNode").getAsBoolean())).collect(toImmutableList());
        } else {
            nodes = emptyList();
        }
        return new ClusterStatus() {
            @Override
            public boolean isRunning() {
                return isRunning;
            }

            @Override
            public List<ClusterNode> getNodes() {
                return nodes;
            }
        };
    }

    @Override
    public List<NodeStatus> getAllNodeStatus() {//TODO improve this
        Map<String, Object[]> map = map();
        stream(post("system/cluster/nodes/_ALL/invoke", map("service", "system", "method", "status")).asJackson().get("data").elements()).forEach(n -> {
            map.put(n.get("cluster_node").get("nodeId").asText(), new Object[]{fromJson(n.get("data"), MAP_OF_STRINGS), new ClusterNodeImpl(n.get("cluster_node").get("nodeId").asText(),
                n.get("cluster_node").get("address").asText(),
                n.get("cluster_node").get("thisNode").asBoolean()), null});
        });
        stream(post("system/cluster/nodes/_ALL/invoke", map("service", "minions", "method", "getAll")).asJackson().get("data").elements()).forEach(n -> {
            map.get(n.get("cluster_node").get("nodeId").asText())[2] = stream(n.get("data").elements()).map(s -> new ServiceStatusInfoImpl(s.get("name").asText(), parseMinionStatus(s.get("status").asText()))).collect(toImmutableList());
        });
        return map.values().stream().map(v -> new NodeStatus() {
            @Override
            public Map<String, String> getSystemInfo() {
                return (Map<String, String>) v[0];
            }

            @Override
            public List<ServiceStatusInfo> getServicesStatus() {
                return (List<ServiceStatusInfo>) v[2];
            }

            @Override
            public ClusterNode getNodeInfo() {
                return (ClusterNode) v[1];
            }
        }).sorted(Ordering.natural().onResultOf(n -> n.getNodeInfo().getNodeId())).collect(toImmutableList());
    }

    @Override
    public void applyPatches() {
        try {
            requireSession = false; //this is not great. TODO: refactor this with aspectj or something
            logger.debug("apply patches");
            post("boot/patches/apply", "");
        } finally {
            requireSession = null;
        }
    }

    @Override
    public void importFromDms() {
        logger.debug("importFromDms");
        post("system/dms/import", "");
    }

    @Override
    public void reloadConfig() {
        logger.debug("reloadConfig");
        post("system/config/reload", "");
    }

    @Override
    public void dropAllCaches() {
        logger.debug("drop all caches");
        post("system/cache/drop", "");
    }

    @Override
    public void reload() {
        logger.debug("reload system");
        post("system/reload", "");
    }

    @Override
    public void stop() {
        post("system/stop", "");
    }

    @Override
    public void restart() {
        post("system/restart", "");
    }

    @Override
    public void rollback(ZonedDateTime timestamp) {
        post("system/rollback?timestamp=" + encodeUrlQuery(toIsoDateTime(checkNotNull(timestamp))), "");
    }

    @Override
    public void dropCache(String cacheId) {
        checkNotBlank(cacheId);
        logger.debug("drop cache = %s", cacheId);
        post(format("system/cache/%s/drop", encodeUrlPath(cacheId)), "");
    }

    @Override
    public void reconfigureDatabase(Map<String, String> config) {
        //TODO validate config
        post("system/database/reconfigure", map(config));
    }

    @Override
    public BigByteArray dumpDatabase() {
        return getBigBytes("system/database/dump");
    }

    @Override
    public String dumpThreads() {
        return checkNotBlank(get("system/threads").asJackson().get("data").get("dump").asText());
    }

    @Override
    public BigByteArray downloadDebugInfo() {
        return getBigBytes("system/debuginfo/download");
    }

    @Override
    public BugReportInfo sendBugReport(@Nullable String message) {
        String url = "system/debuginfo/send";
        if (isNotBlank(message)) {
            url += "?message=" + encodeUrlQuery(message);
        }
        JsonObject data = post(url, "").asJson().getAsJsonObject().getAsJsonObject("data");
        return new DebugInfoImpl(toString(data.get("fileName")));
    }

    private static class LogMessageImpl implements LogMessage {

        private final LogLevel level;
        private final String message, stacktrace, line;
        private final ZonedDateTime timestamp;

        public LogMessageImpl(Map<String, Object> payload) {
            level = checkNotNull(convert(payload.get("level"), LogLevel.class));
            message = checkNotBlank(toStringOrNull(payload.get("message")));
            line = checkNotBlank(toStringOrNull(payload.get("line")));
            stacktrace = emptyToNull(toStringOrNull(payload.get("stacktrace")));
            timestamp = checkNotNull(CmDateUtils.toDateTime(payload.get("timestamp")));
        }

        @Override
        public LogLevel getLevel() {
            return level;
        }

        @Override
        public String getMessage() {
            return message;
        }

        @Override
        @Nullable
        public String getStacktrace() {
            return stacktrace;
        }

        @Override
        public ZonedDateTime getTimestamp() {
            return timestamp;
        }

        @Override
        public String getLine() {
            return line;
        }

    }

    private static class PatchInfoImpl implements PatchInfo {

        private final String name, description, category;

        public PatchInfoImpl(String name, String description, String category) {
            this.name = trimAndCheckNotBlank(name);
            this.description = checkNotNull(description);
            this.category = trimAndCheckNotBlank(category);
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getDescription() {
            return description;
        }

        @Override
        public String getCategory() {
            return category;
        }

        @Override
        public String toString() {
            return "SimplePatchInfo{" + "name=" + name + ", description=" + description + ", category=" + category + '}';
        }

    }
}
