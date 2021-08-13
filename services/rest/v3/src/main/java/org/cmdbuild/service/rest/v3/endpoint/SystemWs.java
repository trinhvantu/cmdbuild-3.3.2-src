package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.databind.node.ObjectNode;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Splitter;
import static com.google.common.base.Strings.nullToEmpty;
import com.google.common.collect.ComparisonChain;
import static com.google.common.collect.ImmutableList.toImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import static com.google.common.collect.Maps.newLinkedHashMap;
import com.google.common.collect.Ordering;
import java.io.File;
import static java.lang.String.format;
import java.lang.management.ManagementFactory;
import java.time.ZonedDateTime;
import static java.util.Collections.emptyList;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import static javax.ws.rs.core.MediaType.APPLICATION_FORM_URLENCODED;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.APPLICATION_OCTET_STREAM;
import static javax.ws.rs.core.MediaType.MULTIPART_FORM_DATA;
import static javax.ws.rs.core.MediaType.TEXT_PLAIN;
import static javax.ws.rs.core.MediaType.WILDCARD;
import org.apache.commons.io.FileUtils;
import static org.apache.commons.io.FileUtils.deleteQuietly;
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.cmdbuild.auth.multitenant.api.MultitenantService;
import org.cmdbuild.cache.CacheService;
import org.cmdbuild.common.log.LoggerConfigImpl;
import org.cmdbuild.audit.RequestTrackingService;
import org.cmdbuild.cache.CmCacheStats;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.common.log.LoggerConfig;
import org.cmdbuild.dao.ConfigurableDataSource;
import org.cmdbuild.scheduler.SchedulerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.scheduler.ScheduledJobInfo;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.service.rest.common.utils.WsSerializationUtils.serializePatchInfo;
import org.cmdbuild.utils.date.CmDateUtils;
import static org.cmdbuild.utils.io.CmIoUtils.tempFile;
import javax.annotation.security.RolesAllowed;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.ADMIN_JOBS_VIEW_AUTHORITY;
import org.cmdbuild.debuginfo.BugReportService;
import org.cmdbuild.debuginfo.BugReportInfo;
import static org.cmdbuild.utils.date.CmDateUtils.systemDate;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;
import static org.cmdbuild.auth.role.RolePrivilegeAuthority.SYSTEM_ACCESS_AUTHORITY;
import org.cmdbuild.cluster.ClusterNode;
import org.cmdbuild.config.api.GlobalConfigService;
import static org.cmdbuild.dao.config.DatabaseConfiguration.DATABASE_CONFIG_NAMESPACE;
import org.cmdbuild.dao.config.inner.DatabaseCreator;
import org.cmdbuild.dao.config.inner.DatabaseCreatorConfig;
import org.cmdbuild.dao.config.inner.DatabaseCreatorConfigImpl;
import org.cmdbuild.event.EventService;
import org.cmdbuild.platform.PlatformService;
import org.cmdbuild.service.rest.v3.helpers.LogMessageStreamHelper;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILE;
import org.cmdbuild.sysmon.SysmonService;
import org.cmdbuild.utils.io.CmIoUtils;
import static org.cmdbuild.utils.io.CmNetUtils.getHostname;
import org.cmdbuild.services.SystemService;
import static org.cmdbuild.services.SystemStatusUtils.serializeSystemStatus;
import static org.cmdbuild.utils.io.CmIoUtils.copy;
import org.cmdbuild.cluster.ClusterService;
import org.cmdbuild.platform.UpgradeHelperService;
import org.cmdbuild.dao.config.inner.PatchService;
import org.cmdbuild.debuginfo.BuildInfoService;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import org.cmdbuild.sysmon.SystemStatusLog;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.config.api.DirectoryService;
import org.cmdbuild.dao.config.inner.ConfigImportStrategy;
import org.cmdbuild.dms.DmsService;
import static org.cmdbuild.utils.date.CmDateUtils.dateTimeFileSuffix;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDuration;
import org.cmdbuild.utils.io.BigByteArrayDataSource;
import static org.cmdbuild.utils.io.CmIoUtils.toBigByteArray;
import org.cmdbuild.common.log.LoggerConfigService;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.systemToSqlExpr;
import org.cmdbuild.diagram.DiagramService;
import static org.cmdbuild.etl.database.job.SqlDriverUtils.getInstalledJdbcDrivers;
import org.cmdbuild.sysmon.SystemErrorsAggregatorService;
import org.cmdbuild.utils.benchmark.BenchmarkResults;
import org.cmdbuild.utils.benchmark.BenchmarkUtils;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.date.CmDateUtils.systemZoneId;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import static org.cmdbuild.utils.encode.CmEncodeUtils.decodeIfHex;
import static org.cmdbuild.utils.encode.CmPackUtils.unpackIfPacked;
import static org.cmdbuild.utils.io.CmNetUtils.getIpAddr;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.cmdbuild.cluster.ClusterRpcService;
import static org.cmdbuild.common.log.LoggerConfigService.LOGGER_LEVEL_DEFAULT;
import org.cmdbuild.dao.MyPooledDataSource;
import org.cmdbuild.dao.postgres.services.DumpService;
import org.cmdbuild.dao.postgres.services.PostgresDateService;
import org.cmdbuild.requestcontext.RequestContextUtils;
import org.cmdbuild.system.ReloadService;
import org.cmdbuild.utils.ScriptService;
import static org.cmdbuild.utils.encode.CmPackUtils.pack;
import static org.cmdbuild.utils.exec.CmProcessUtils.getThreadDump;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;

@Path("system/")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@RolesAllowed(SYSTEM_ACCESS_AUTHORITY)
public class SystemWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final GlobalConfigService configService;
    private final LogMessageStreamHelper logMessageStreamHelper;
    private final ConfigurableDataSource dataSource;
    private final CacheService cacheService;
    private final RequestTrackingService requestTrackingService;
    private final PatchService patchManager;
    private final SchedulerService schedulerService;
    private final MultitenantService multitenantService;
    private final LoggerConfigService loggerConfigurationService;
    private final BugReportService bugreportService;
    private final DumpService dumpService;
    private final ClusterService clusteringService;
    private final ClusterRpcService clusterRpcService;
    private final PlatformService platformService;
    private final SysmonService sysmonService;
    private final EventService eventService;
    private final SystemService bootService;
    private final UpgradeHelperService upgradeService;
    private final BuildInfoService buildInfoService;
    private final PostgresDateService postgresDateService;
    private final DirectoryService directoryService;
    private final DmsService documentService;
    private final ScriptService scriptService;
    private final DiagramService diagramService;
    private final SystemErrorsAggregatorService systemEventsService;
    private final ReloadService reloadService;

    public SystemWs(GlobalConfigService configService, LogMessageStreamHelper logMessageStreamHelper, ConfigurableDataSource dataSource, CacheService cacheService, RequestTrackingService requestTrackingService, PatchService patchManager, SchedulerService schedulerService, MultitenantService multitenantService, LoggerConfigService loggerConfigurationService, BugReportService bugreportService, DumpService dumpService, ClusterService clusteringService, ClusterRpcService clusterRpcService, PlatformService platformService, SysmonService sysmonService, EventService eventService, SystemService bootService, UpgradeHelperService upgradeService, BuildInfoService buildInfoService, PostgresDateService postgresDateService, DirectoryService directoryService, DmsService documentService, ScriptService scriptService, DiagramService diagramService, SystemErrorsAggregatorService systemEventsService, ReloadService reloadService) {
        this.configService = checkNotNull(configService);
        this.logMessageStreamHelper = checkNotNull(logMessageStreamHelper);
        this.dataSource = checkNotNull(dataSource);
        this.cacheService = checkNotNull(cacheService);
        this.requestTrackingService = checkNotNull(requestTrackingService);
        this.patchManager = checkNotNull(patchManager);
        this.schedulerService = checkNotNull(schedulerService);
        this.multitenantService = checkNotNull(multitenantService);
        this.loggerConfigurationService = checkNotNull(loggerConfigurationService);
        this.bugreportService = checkNotNull(bugreportService);
        this.dumpService = checkNotNull(dumpService);
        this.clusteringService = checkNotNull(clusteringService);
        this.clusterRpcService = checkNotNull(clusterRpcService);
        this.platformService = checkNotNull(platformService);
        this.sysmonService = checkNotNull(sysmonService);
        this.eventService = checkNotNull(eventService);
        this.bootService = checkNotNull(bootService);
        this.upgradeService = checkNotNull(upgradeService);
        this.buildInfoService = checkNotNull(buildInfoService);
        this.postgresDateService = checkNotNull(postgresDateService);
        this.directoryService = checkNotNull(directoryService);
        this.documentService = checkNotNull(documentService);
        this.scriptService = checkNotNull(scriptService);
        this.diagramService = checkNotNull(diagramService);
        this.systemEventsService = checkNotNull(systemEventsService);
        this.reloadService = checkNotNull(reloadService);
    }

    @GET
    @Path("status")
    public Object status() {
        SystemStatusLog runtimeStatus = sysmonService.getSystemRuntimeStatus();
        return response(map(
                "hostname", getHostname(),
                "hostaddress", getIpAddr(),
                "build_info", buildInfoService.getCommitInfoOrUnknownIfNotAvailable(),
                "version", buildInfoService.getVersionNumberOrUnknownIfNotAvailable(),
                "version_full", buildInfoService.getVersionNumberWithModuleOrUnknownIfNotAvailable(),
                "runtime", sysmonService.getJavaRuntimeInfo(),
                "uptime", toIsoDuration(ManagementFactory.getRuntimeMXBean().getUptime()),
                "server_time", toIsoDateTime(systemDate()),
                "server_timezone", systemZoneId().toString(),
                "db_timezone", postgresDateService.getTimezone(),
                "db_timezone_offset", postgresDateService.getOffset(),
                "disk_used", runtimeStatus.getFilesystemMemoryUsed(),
                "disk_free", runtimeStatus.getFilesystemMemoryFree(),
                "disk_total", runtimeStatus.getFilesystemMemoryTotal(),
                "java_memory_used", runtimeStatus.getJavaMemoryUsed(),
                "process_memory_used", runtimeStatus.getProcessMemoryUsed(),
                "java_memory_free", runtimeStatus.getJavaMemoryFree(),
                "java_memory_total", runtimeStatus.getJavaMemoryTotal(),
                "java_memory_max", runtimeStatus.getJavaMemoryMax(),
                "java_pid", runtimeStatus.getJavaPid(),
                "system_memory_used", runtimeStatus.getSystemMemoryUsed(),
                "system_memory_free", runtimeStatus.getSystemMemoryFree(),
                "system_memory_total", runtimeStatus.getSystemMemoryTotal(),
                "system_load", runtimeStatus.getLoadAvg())
                .accept((m) -> {
                    if (runtimeStatus.hasWarnings()) {
                        m.put("warning", runtimeStatus.getWarnings());
                    }
                    try {
                        MyPooledDataSource basicDataSource = dataSource.getInner();
                        m.put("datasource_active_connections", String.valueOf(basicDataSource.getNumActive()));
                        m.put("datasource_idle_connections", String.valueOf(basicDataSource.getNumIdle()));
                        m.put("datasource_max_active_connections", String.valueOf(basicDataSource.getMaxTotal()));
                        m.put("datasource_max_idle_connections", String.valueOf(basicDataSource.getMaxIdle()));
                    } catch (Exception ex) {
                        logger.warn(marker(), "error retrieving datasource info", ex);
                    }
                })
        );
    }

    @GET
    @Path("threads")
    public Object threadDump() {
        return response(map("dump", getThreadDump()));
    }

    @GET
    @Path("benchmark")
    public synchronized Object executeSystemBenchmark() {
        BenchmarkResults results = BenchmarkUtils.executeBenchmark();
        return response(map("score", results.getAverageScore(), "results", results.getResults().stream().map(r -> map(
                "category", r.getCategory(),
                "result", r.getResult(),
                "score", r.getScore(),
                "_has_error", r.hasError(),
                "error", r.hasError() ? r.getError().toString() : null
        )).collect(toList())));
    }

    @GET
    @Path("events")
    public Object events() {
        return response(systemEventsService.getEventsSince(now().minusHours(1)).stream().map(e -> map(//TODO configurable time window
                "timestamp", toIsoDateTime(e.getTimestamp()),
                "category", e.getCategory(),
                "source", e.getSource(),
                "level", e.getLevel().name(),
                "message", e.getMessage()
        )).collect(toList()));
    }

    @GET
    @Path("cluster/status")
    public Object getClusterStatus() {
        return response(map("running", clusteringService.isRunning(), "nodes", serializeClusterNodes()));
    }

    @GET
    @Path("cluster/nodes")
    public Object getClusterNodes() {
        return response(serializeClusterNodes());
    }

    @POST
    @Path("cluster/nodes/{nodeId}/invoke")
    public Object invokeClusterNodeMethod(@PathParam("nodeId") String nodeId, String payload) {
        if (nodeId.matches("(?i)_?all")) {
            return response(clusterRpcService.invokeMethodOnAllNodes(payload).stream().map(r -> {
                ObjectNode json = fromJson(r.getOutput(), ObjectNode.class);
                json.putPOJO("cluster_node", serializeClusterNode(r.getNode()));
                return json;
            }).collect(toImmutableList()));
        } else {
            return clusterRpcService.invokeMethodOnNode(decodeIfHex(nodeId), payload);
        }
    }

    private Object serializeClusterNodes() {
        return clusteringService.isRunning() ? clusteringService.getClusterNodes().stream().map(SystemWs::serializeClusterNode).collect(toList()) : emptyList();
    }

    private static Object serializeClusterNode(ClusterNode n) {
        return map("address", n.getAddress(), "nodeId", n.getNodeId(), "thisNode", n.isThisNode());
    }

    @POST
    @Path("cache/drop")
    @Consumes(WILDCARD)
    public Object dropCacheAll() {
        logger.info("drop system cache");
        cacheService.invalidateAll();
        return success();
    }

    @POST
    @Path("cache/{cacheId}/drop")
    @Consumes(WILDCARD)
    public Object dropCacheById(@PathParam("cacheId") String cacheId) {
        logger.info("drop cache = {}", cacheId);
        cacheService.invalidate(cacheId);
        return success();
    }

    @GET
    @Path("cache/stats")
    public Object getCacheStats() {
        Map<String, CmCacheStats> stats = cacheService.getStats();
        return success().with("data", list().accept((l) -> {
            stats.forEach((key, value) -> {
                l.add(map("name", key, "objectsCount", value.getSize(), "objectsSize", value.getEstimateMemSize(), "_objectsSize_description", FileUtils.byteCountToDisplaySize(value.getEstimateMemSize())));
            });
        }));
    }

    @DELETE
    @Path("requests/{requestId}")
    public Object interruptRequest(@PathParam("requestId") String requestId) {
        logger.info("interrupting request =< {} >", requestId);
        RequestContextUtils.interruptRequest(requestId);
        return success();
    }

    @POST
    @Path("stop")
    @Consumes(WILDCARD)
    public Object stopSystem() {
        logger.info("stop cmdbuild");
        platformService.stopContainer();
        return success();
    }

    @POST
    @Path("reload")
    @Consumes(WILDCARD)
    public Object reloadSystem() {
        logger.info("reload cmdbuild");
        reloadService.refreshAndReload();
        return success();
    }

    @POST
    @Path("rollback")
    @Consumes(WILDCARD)
    public Object rollbackSystemData(@QueryParam("timestamp") String timestampStr) {
        ZonedDateTime timestamp = toDateTime(checkNotBlank(timestampStr));
        logger.info("rollback all system data to timestamp = {}", toIsoDateTime(timestamp));
        dataSource.withAdminJdbcTemplate(j -> j.queryForObject(format("SELECT _cm3_system_rollback(%s)", systemToSqlExpr(timestamp)), Object.class));//TODO improve this, make it work without superuser privileges
        reloadService.reload();
        return success();
    }

    @POST
    @Path("restart")
    @Consumes(WILDCARD)
    public Object restartSystem() {
        logger.info("restart cmdbuild");
        platformService.restartContainer();
        return success();
    }

    @POST
    @Path("upgrade")
    @Consumes(MULTIPART_FORM_DATA)
    public Object upgradeSystem(@Multipart(FILE) DataHandler dataHandler) {
        logger.info("upgrade cmdbuild");
        upgradeService.upgradeWebapp(CmIoUtils.toByteArray(dataHandler));
        return success();
    }

    /**
     * drop all data collected by audit process (request tracking)
     *
     * this is mostly useful for debug/devel, or to clear data after we've
     * disabled tracking
     *
     */
    @POST
    @Path("audit/drop")
    @Consumes(WILDCARD)
    public void dropAudit() {
        logger.info("drop audit data");
        requestTrackingService.dropAllData();
    }

    @GET
    @Path("patches")
    public Object getAllPatches() {
        return ImmutableMap.of("patches", patchManager.getAllPatches().stream()
                .sorted((a, b) -> ComparisonChain.start().compareFalseFirst(a.isApplied(), b.isApplied()).compare(firstNonNull(a.getApplyDate(), 0), firstNonNull(b.getApplyDate(), 0)).compare(b.getComparableVersion(), a.getComparableVersion()).result())
                .map((patch) -> serializePatchInfo(patch).accept((map) -> {
            map.put("applied", patch.isApplied());
            if (patch.isApplied()) {
                map.put("appliedOnDate", CmDateUtils.toIsoDateTime(patch.getApplyDate()));
            }
            if (!isBlank(patch.getHash())) {
                map.put("hash", patch.getHash());
            }
            List<String> warnings = Lists.newArrayList();
            if (patch.hashMismatch()) {
                warnings.add("hash mismatch: the hash on db does not match the hash on file");
            }
            if (patch.isApplied() && !patch.hasPatchOnFile()) {
                warnings.add("orphan patch: this patch does not exisit on file");
            }
            if (!warnings.isEmpty()) {
                map.put("warning", warnings);
            }
        })).collect(toList()));
    }

    @GET
    @Path("tenants")
    public List<Object> getAllTenants() {
        return multitenantService.getAllActiveTenants().stream().map((tenant) -> {
            Map map = newLinkedHashMap();
            map.put("id", tenant.getId());
            map.put("description", tenant.getDescription());
            return map;
        }).collect(toList());
    }

    @GET
    @Path("scheduler/jobs")
    public Object getSchedulerJobs() {
        return map("success", true, "data", schedulerService.getConfiguredJobs().stream()
                .sorted(Ordering.natural().onResultOf(ScheduledJobInfo::getCode))
                .map((job) -> map(
                "_id", job.getCode(),
                "trigger", job.getTrigger(),
                "isRunning", job.isRunning(),
                "lastRun", toIsoDateTime(job.getLastRun())))
                .collect(toList()));
    }

    @POST
    @Path("scheduler/jobs/{jobCode}/trigger")
    public Object triggerJobNow(@PathParam("jobCode") String jobCode) {
        schedulerService.runJob(decodeIfHex(jobCode));
        return success();
    }

    @GET
    @Path("loggers")
    public Object getAllLoggers(@QueryParam("includeLoggersWithoutLevel") @DefaultValue(FALSE) Boolean includeLoggersWithoutLevel) {
        List<LoggerConfig> loggers = includeLoggersWithoutLevel ? loggerConfigurationService.getAllLoggerConfigIncludeUnconfigured() : loggerConfigurationService.getAllLoggerConfig();
        return response(loggers.stream()
                .sorted(Ordering.natural().onResultOf(LoggerConfig::getCategory))
                .map((item) -> map("_id", item.getCategory(), "category", item.getCategory(), "description", item.getDescription(), "level", item.getLevel())).collect(toList()));
    }

    @POST
    @Path("loggers/{key}")
    @Consumes(TEXT_PLAIN)
    public void updateLoggerLevel(@PathParam("key") String loggerCategory, String loggerLevel) {
        if (LOGGER_LEVEL_DEFAULT.equalsIgnoreCase(loggerLevel)) {
            loggerConfigurationService.removeLoggerConfig(loggerCategory);
        } else {
            loggerConfigurationService.setLoggerConfig(new LoggerConfigImpl(loggerCategory, loggerLevel));
        }
    }

    @PUT
    @Path("loggers/{key}")
    @Consumes(TEXT_PLAIN)
    public void addLoggerLevel(@PathParam("key") String loggerCategory, String loggerLevel) {
        updateLoggerLevel(loggerCategory, loggerLevel);
    }

    @DELETE
    @Path("loggers/{key}")
    public void deleteLoggerLevel(@PathParam("key") String loggerCategory) {
        loggerConfigurationService.removeLoggerConfig(loggerCategory);
    }

    @POST
    @Consumes(WILDCARD)
    @Path("loggers/stream")
    public Object receiveLogMessages() {
        logMessageStreamHelper.startReceivingLogMessages();
        return success();
    }

    @DELETE
    @Consumes(WILDCARD)
    @Path("loggers/stream")
    public Object stopReceivingLogMessages() {
        logMessageStreamHelper.stopReceivingLogMessages();
        return success();
    }

    @GET
    @Path("log/files")
    public Object getAllLogFiles(@QueryParam("includeArchives") @DefaultValue(FALSE) boolean includeArchives) {
        return response((includeArchives ? loggerConfigurationService.getAllLogFiles() : loggerConfigurationService.getActiveLogFiles()).stream()
                .sorted(Ordering.natural())
                .map((file) -> map("_id", pack(file.getAbsolutePath()), "file", file.getName(), "path", file.getAbsolutePath()))
                .collect(toList()));
    }

    @GET
    @Path("log/files/{fileName}/download")
    public DataHandler downloadLogFile(@PathParam("fileName") String fileName) {
        return loggerConfigurationService.downloadLogFile(unpackIfPacked(fileName));
    }

    @GET
    @Path("log/files/_ALL/download")
    public DataHandler downloadAllLogFiles(@QueryParam("includeArchives") @DefaultValue(FALSE) boolean includeArchives) {
        return includeArchives ? loggerConfigurationService.downloadAllLogFiles() : loggerConfigurationService.downloadActiveLogFiles();
    }

    @POST
    @Path("eval")
    @Consumes(APPLICATION_FORM_URLENCODED)
    public Object eval(@FormParam("script") String script, @QueryParam("language") @DefaultValue("beanshell") String language) {
        Object output = scriptService.helper(getClass()).withScript(script, language).executeForOutput();
        return response(map("output", output));
    }

    @GET
    @Path("database/dump")
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler dumpDatabase() {
        File tempFile = tempFile();
        dumpService.dumpDatabaseToFile(tempFile);
        DataSource dumpFileDataSource;
        if (tempFile.length() < 1024 * 1024 * 1024 * 2) {
            dumpFileDataSource = new BigByteArrayDataSource(toBigByteArray(tempFile), APPLICATION_OCTET_STREAM, format("cmdbuild_%s.dump", dateTimeFileSuffix()));
            deleteQuietly(tempFile);
        } else {
            dumpFileDataSource = new FileDataSource(tempFile);
        }
        return new DataHandler(dumpFileDataSource);
    }

    @POST
    @Path("database/reconfigure")
    public Object reconfigureDatabase(Map<String, String> dbConfig) {
        Map<String, String> currentConfig = configService.getConfig(DATABASE_CONFIG_NAMESPACE).getAsMap(), newConfig = map(currentConfig).with(dbConfig);
        if (equal(currentConfig, newConfig)) {
            logger.info(marker(), "database config already up to date, skip reconfigure");
        } else {
            DatabaseCreatorConfig config = DatabaseCreatorConfigImpl.builder().withConfig(newConfig).build();
            bootService.stopSystem();
            configService.putStrings(DATABASE_CONFIG_NAMESPACE, config.getCmdbuildDbConfig());
            cacheService.invalidateAll();
            bootService.startSystem();
        }
        return success().with("status", serializeSystemStatus(bootService.getSystemStatus()));
    }

    @POST
    @Path("database/import")
    @Consumes(MULTIPART_FORM_DATA)
    public Object importDatabaseFromDump(@Multipart(FILE) DataHandler dataHandler, @QueryParam("freezesessions") @DefaultValue(FALSE) Boolean freezesessions) {//TODO optional backup-before and restore-on-failure options; optional dump and restore config table
        logger.info("recreate cmdbuild database");
        File tempFile = tempFile(null, "dump");
        copy(dataHandler, tempFile);
        DatabaseCreator databaseCreator = new DatabaseCreator(DatabaseCreatorConfigImpl.builder()
                .withConfig(configService.getConfig(DATABASE_CONFIG_NAMESPACE).getAsMap())
                .withUseSharkSchema(true)//TODO auto check from dump 
                .withSqlPath(new File(directoryService.getWebappDirectory(), "WEB-INF/sql").getAbsolutePath())
                .withConfigImportStrategy(ConfigImportStrategy.CIS_DATA_ONLY)
                .withKeepLocalConfig(true)
                .withSource(tempFile.getAbsolutePath()).build());
        try {
            bootService.stopSystem();
            dataSource.closeInner();
            databaseCreator.dropDatabase();
        } catch (Exception ex) {
            logger.error("error dropping database; restarting system");
            dataSource.reloadInner();
            bootService.startSystem();
            throw ex;
        }
        try {
            databaseCreator.configureDatabase();
            try {
                databaseCreator.applyPatchesOrSkip();
            } finally {
                databaseCreator.adjustConfigs();
            }
            if (freezesessions) {
                databaseCreator.freezeSessions();
            }
        } finally {
            cacheService.invalidateAll();
            dataSource.reloadInner();
//            configService.reload(); TODO check this
            bootService.startSystem();
            deleteQuietly(tempFile);
        }
        return success();
    }

    @GET
    @Path("database/diagram")
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler getDatabaseDiagram(@QueryParam("classes") String classesParam) {
        List<String> classes = Splitter.on(",").splitToList(checkNotBlank(classesParam));
        return new DataHandler(diagramService.renderDatabaseDiagram(classes));
    }

    @GET
    @Path("database/pool/debug")
    public Object getDatabasePoolInfo() {
        return response(map("connections", dataSource.getInner().getStackTraceForBorrowedConnections().stream().map(t -> map("status", serializeEnum(t.getStatus()), "trace", nullToEmpty(t.getTrace()))).collect(toImmutableList())));
    }

    @GET
    @Path("debuginfo/download")
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler generateDebugInfo() {
        return new DataHandler(bugreportService.generateBugReport());
    }

    @POST
    @Consumes(WILDCARD)
    @Path("debuginfo/send")
    public Object sendBugReport(@QueryParam("message") String message) {
        BugReportInfo debugInfo = bugreportService.sendBugReport(message);
        return response(map("fileName", debugInfo.getFileName()));
    }

    @POST
    @Consumes(WILDCARD)
    @Path("messages/broadcast")
    public Object sendBroadcastMessage(@QueryParam("message") String message) {
        eventService.sendBroadcastAlert(message);
        return success();
    }

    @GET
    @Path("dms/export")
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler exportAllDocuments() {
        return documentService.exportAllDocuments();
    }

    @GET
    @Path("libs/jdbc")
    @RolesAllowed({SYSTEM_ACCESS_AUTHORITY, ADMIN_JOBS_VIEW_AUTHORITY})
    public Object getAvailableJdbcDrivers() {
        return response(list(getInstalledJdbcDrivers()).map(c -> map(
                "className", c.getName()
        )));
    }
}
