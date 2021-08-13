/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.api;

import static com.google.common.collect.Iterables.getOnlyElement;
import com.google.gson.JsonObject;
import org.cmdbuild.client.rest.model.LoggerInfo;
import org.cmdbuild.client.rest.model.ServiceStatusInfo;
import org.cmdbuild.client.rest.model.PatchInfo;
import org.cmdbuild.client.rest.model.LogMessage;
import org.cmdbuild.client.rest.model.LoggerInfoImpl;
import org.cmdbuild.client.rest.model.ClusterStatus;
import java.io.InputStream;
import static java.lang.String.format;
import java.time.ZonedDateTime;
import java.util.Collection;
import static java.util.Collections.emptyMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;
import java.util.function.Consumer;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import org.apache.commons.lang3.StringEscapeUtils;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.auth.multitenant.config.MultitenantMode;
import org.cmdbuild.client.rest.core.RestServiceClient;
import org.cmdbuild.config.api.ConfigDefinition;
import org.cmdbuild.dao.MyPooledDataSource.ConnectionInfo;
import org.cmdbuild.services.SystemStatus;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.debuginfo.BugReportInfo;
import org.cmdbuild.etl.gate.inner.EtlGate;
import org.cmdbuild.etl.loader.EtlProcessingResult;
import org.cmdbuild.jobs.JobData;
import org.cmdbuild.jobs.JobRun;
import org.cmdbuild.scheduler.ScheduledJobInfo;
import org.cmdbuild.sysmon.SystemErrorInfo;
import org.cmdbuild.utils.io.BigByteArray;
import static org.cmdbuild.utils.json.CmJsonUtils.LIST_OF_MAP_OF_OBJECTS;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;

public interface SystemApi extends RestServiceClient {

    List<SystemErrorInfo> getEvents();

    List<JobData> getJobs();

    List<ScheduledJobInfo> getSysJobs();

    void runSysJob(String key);

    JobData getJob(String jobId);

    JobData updateJob(JobData jobData);

    JobRun runJob(String jobId, Map<String, String> configOverride);

    JobRun getJobRun(String jobId, long runId);

    List<JobRun> getLastJobRuns(String jobId, long limit);

    List<JobRun> getLastJobErrors(String jobId, long limit);

    List<JobRun> getLastJobRuns(long limit);

    List<JobRun> getLastJobErrors(long limit);

    SystemStatus getStatus();

    List<ConnectionInfo> getPoolStatus();

    Map<String, String> getSystemInfo();

    List<ServiceStatusInfo> getServicesStatus();

    ClusterStatus getClusterStatus();

    List<NodeStatus> getAllNodeStatus();

    void sendBroadcast(String message);

    EtlGate getGate(String gateId);

    EtlGate updateGate(EtlGate gate);

    @Nullable
    EtlProcessingResult postToGate(String gateId, DataSource newDataSource);

    DataSource downloadSystemDiagram(Collection<String> classes);

    List<LoggerInfo> getLoggers();

    List<PatchInfo> getPatches();

    void upgradeWebapp(InputStream warFileData);

    void recreateDatabase(InputStream dumpFileData, boolean freezesessions);

    void stop();

    void restart();

    void rollback(ZonedDateTime timestamp);

    void applyPatches();

    void importFromDms();

    void setLogger(LoggerInfo logger);

    void deleteLogger(String category);

    Future<Void> streamLogMessages(Consumer<LogMessage> listener);

    void reloadConfig();

    void dropAllCaches();

    void reload();

    void dropCache(String cacheId);

    BigByteArray dumpDatabase();

    void reconfigureDatabase(Map<String, String> config);

    BigByteArray downloadDebugInfo();

    BugReportInfo sendBugReport(@Nullable String message);

    @Nullable
    String eval(String script, @Nullable String language);

    Map<String, String> getConfig();

    String getConfig(String key);

    Map<String, ConfigDefinition> getConfigDefinitions();

    SystemApi setConfig(String key, String value);

    SystemApi setConfigs(Map<String, String> data);

    SystemApi deleteConfig(String key);

    JsonObject configureMultitenant(MultitenantMode multitenantMode, @Nullable String classCode);

    String dumpThreads();

    void interrupt(String requestId);

    default JobRun runJob(String jobId) {
        return runJob(jobId, emptyMap());
    }

    default SystemApi deleteConfigs(String... keys) {
        list(keys).forEach(this::deleteConfig);
        return this;
    }

    default JobRun getJobRun(long runId) {
        return getJobRun("_ANY", runId);
    }

    default void recreateDatabase(InputStream dumpFileData) {
        recreateDatabase(dumpFileData, false);
    }

    default void setLogger(String category, String level) {
        setLogger(new LoggerInfoImpl(category, level));
    }

    default BugReportInfo sendBugReport() {
        return sendBugReport(null);
    }

    @Nullable
    default String eval(String script) {
        return eval(script, null);
    }

    default void executeSql(String script) {
        eval(format("cmdb.system().sql().execute(\"%s\")", StringEscapeUtils.escapeJava(script)));
    }

    @Nullable
    default List<Map<String, Object>> querySql(String script) {
        String output = eval(format("output = cmdb.system().sql().query(\"%s\")", StringEscapeUtils.escapeJava(script)));
        return isBlank(output) ? null : fromJson(output, LIST_OF_MAP_OF_OBJECTS);
    }

    @Nullable
    default List<Map<String, Object>> querySql(String script, Object... params) {
        return querySql(format(script, params));
    }

    @Nullable
    default Object querySqlSingleValue(String script, Object... params) {
        return getOnlyElement(getOnlyElement(querySql(format(script, params)), emptyMap()).values(), null);
    }

    default SystemApi setConfigs(Object... items) {
        return setConfigs(map(items));
    }

}
