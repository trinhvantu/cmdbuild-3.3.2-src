package org.cmdbuild.service.rest.v3.endpoint;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import java.io.File;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;
import javax.activation.DataHandler;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.WILDCARD;
import static org.apache.commons.io.FileUtils.deleteQuietly;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.cmdbuild.config.api.DirectoryService;
import org.cmdbuild.config.api.GlobalConfigService;
import static org.cmdbuild.dao.config.DatabaseConfiguration.DATABASE_CONFIG_NAMESPACE;
import org.cmdbuild.dao.config.inner.DatabaseCreator;
import org.cmdbuild.dao.config.inner.DatabaseCreatorConfig;
import org.cmdbuild.dao.config.inner.DatabaseCreatorConfigImpl;
import org.cmdbuild.dao.config.inner.Patch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import org.cmdbuild.service.rest.common.utils.WsSerializationUtils;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.services.SystemService;
import static org.cmdbuild.services.SystemStatusUtils.serializeSystemStatus;
import org.cmdbuild.dao.config.inner.PatchService;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILE;
import static org.cmdbuild.services.SystemStatus.SYST_WAITING_FOR_DATABASE_CONFIGURATION;
import static org.cmdbuild.services.SystemStatus.SYST_WAITING_FOR_PATCH_MANAGER;
import static org.cmdbuild.utils.io.CmIoUtils.copy;
import static org.cmdbuild.utils.io.CmIoUtils.tempFile;

@Path("boot/")
@Produces(APPLICATION_JSON)
public class BootWs {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final SystemService systemService;
    private final PatchService patchManager;
    private final GlobalConfigService configService;
    private final DirectoryService directoryService;

    public BootWs(SystemService systemService, PatchService patchManager, GlobalConfigService configService, DirectoryService directoryService) {
        this.systemService = checkNotNull(systemService);
        this.patchManager = checkNotNull(patchManager);
        this.configService = checkNotNull(configService);
        this.directoryService = checkNotNull(directoryService);
    }

    @GET
    @Path("status")
    public Object status() {
        Map map = map(success());
        map.put("status", serializeSystemStatus(systemService.getSystemStatus()));
        switch (systemService.getSystemStatus()) {
            case SYST_WAITING_FOR_PATCH_MANAGER:
                map.put("operationRequired", "applyPatch");
                break;
            case SYST_WAITING_FOR_DATABASE_CONFIGURATION:
                map.put("operationRequired", "databaseConfiguration");
                break;
        }
        return map;
    }

    @POST
    @Path("database/check")
    public Object checkDatabaseConfig(Map<String, String> dbConfig) {
        DatabaseCreatorConfig config = DatabaseCreatorConfigImpl.builder().withConfig(dbConfig).build();
        new DatabaseCreator(config).checkConfig();
        return success();
    }

    @POST
    @Path("database/configure")
    public Object reconfigureDatabase(@Multipart(value = FILE, required = false) DataHandler dataHandler, Map<String, String> dbConfig) {
        checkArgument(systemService.hasStatus(SYST_WAITING_FOR_DATABASE_CONFIGURATION), "cannot configure database, system status is = %s", systemService.getSystemStatus());

        DatabaseCreatorConfig config = DatabaseCreatorConfigImpl.builder()
                .withConfig(dbConfig)
                .withSqlPath(new File(directoryService.getWebappDirectory(), "WEB-INF/sql").getAbsolutePath())
                .build();

        File file;
        if (dataHandler != null) {
            file = tempFile(null, "dump");//TODO improve this, use data handler directly
            copy(dataHandler, file);
            config = DatabaseCreatorConfigImpl.copyOf(config).withSource(file.getAbsolutePath()).build();
        } else {
            file = null;
        }

        try {
            new DatabaseCreator(config).configureDatabase();
        } finally {
            if (file != null) {
                deleteQuietly(file);//TODO improve this, use data handler directly
            }
        }

        configService.putStrings(DATABASE_CONFIG_NAMESPACE, config.getCmdbuildDbConfig());

        //TODO wait for next system status ??
        return success().with("status", serializeSystemStatus(systemService.getSystemStatus()));
    }

    @GET
    @Path("patches")
    public Object getPendingPatches() {
        List<Patch> patches = patchManager.getAvailableCorePatches();
        List list = patches.stream().map(WsSerializationUtils::serializePatchInfo).collect(toList());
        return response(list);
    }

    @POST
    @Path("patches/apply")
    @Consumes(WILDCARD)
    public Object applyPendingPatches() {
        logger.info("applyPendingPatches");
        patchManager.applyPendingPatchesAndFunctions();
        return success();
    }

}
