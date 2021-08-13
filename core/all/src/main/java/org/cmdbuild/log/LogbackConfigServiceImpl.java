/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.log;

import com.fasterxml.jackson.databind.JsonNode;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Maps.uniqueIndex;
import static com.google.common.collect.Streams.stream;
import static com.google.common.io.Files.copy;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toList;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.activation.DataHandler;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.common.log.LoggerConfig;
import org.cmdbuild.common.log.LoggerConfigImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.cmdbuild.config.api.DirectoryService;
import org.cmdbuild.config.CoreConfiguration;
import static org.cmdbuild.config.CoreConfiguration.CORE_LOGGER_CONFIG_PROPERTY;
import org.cmdbuild.config.api.ConfigListener;
import org.cmdbuild.config.api.GlobalConfigService;
import static org.cmdbuild.log.LogbackUtils.asList;
import static org.cmdbuild.log.LogbackUtils.documentToString;
import static org.cmdbuild.log.LogbackUtils.stringToDocument;
import org.cmdbuild.services.PostStartup;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import org.springframework.context.annotation.Primary;
import org.cmdbuild.common.log.LoggerConfigService;
import org.cmdbuild.services.MinionComponent;
import org.cmdbuild.services.MinionStatus;
import static org.cmdbuild.services.MinionStatus.MS_DISABLED;
import static org.cmdbuild.services.MinionStatus.MS_ERROR;
import static org.cmdbuild.services.MinionStatus.MS_READY;
import static org.cmdbuild.utils.encode.CmPackUtils.unpackIfPacked;
import static org.cmdbuild.utils.encode.CmPackUtils.pack;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.io.CmIoUtils.tempFile;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmMapUtils.toImmutableMap;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowConsumer;

@Component
@Primary
@MinionComponent(name = "Log Service", configBean = CoreConfiguration.class)
public class LogbackConfigServiceImpl implements LoggerConfigService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final Map<String, LoggerConfig> suggestedLoggers;

    private final LogbackHelper logbackHelper = LogbackHelper.getInstance();

    private final CoreConfiguration configuration;
    private final LogbackConfigRepository repository;
    private final DirectoryService directoryService;
    private final GlobalConfigService configService;

    private final LogbackConfigFileHelper configHelper;

    private MinionStatus status = MS_DISABLED;

    public LogbackConfigServiceImpl(GlobalConfigService configService, CoreConfiguration config, LogbackConfigRepository repository, DirectoryService directoryService) {
        this.repository = checkNotNull(repository);
        this.directoryService = checkNotNull(directoryService);
        this.configuration = checkNotNull(config);
        this.configService = checkNotNull(configService);
        configHelper = new LogbackConfigFileHelper(repository, directoryService);

        JsonNode loggersInfo = fromJson(readToString(getClass().getResourceAsStream("loggers_info.json")), JsonNode.class);
        suggestedLoggers = stream(loggersInfo.get("suggested_loggers").elements())
                .map(n -> new LoggerConfigImpl(n.get("category").asText(), n.get("description").asText(), LOGGER_LEVEL_DEFAULT))
                .collect(toImmutableMap(LoggerConfig::getCategory, identity()));
    }

    public MinionStatus getServiceStatus() {
        return status;
    }

    @PostStartup
    public void init() {
        if (isAutoconfigureEnabled()) {
            reloadLoggerConfigFromDbIfExistsSafe();
            upgradeLoggerConfigFileIfRequired();
        } else {
            logger.info("logback autoconfiguration is disabled (this includes dynamic reconfiguration ad db config processing)");
            status = MS_DISABLED;
        }
    }

    @ConfigListener(CoreConfiguration.class)//TODO trigger only for logger config param
    public void reloadConfig() {
        if (isAutoconfigureEnabled()) {
            reloadLoggerConfigFromDbIfExistsSafe();
        } else {
            logger.info("logback autoconfiguration is disabled (this includes dynamic reconfiguration ad db config processing)");
            status = MS_DISABLED;
        }
    }

    @Override
    public List<File> getActiveLogFiles() {
        return getLogFiles(false);
    }

    @Override
    public List<File> getAllLogFiles() {
        return getLogFiles(true);
    }

    @Override
    public DataHandler downloadLogFile(String fileName) {
        File file = getLogFileBynameOrPath(fileName);
        return newDataHandler(file);
    }

    @Override
    public DataHandler downloadAllLogFiles() {
        return downloadLogFiles(getAllLogFiles());
    }

    @Override
    public DataHandler downloadActiveLogFiles() {
        return downloadLogFiles(getActiveLogFiles());
    }

    @Override
    public List<LoggerConfig> getAllLoggerConfig() {
        logger.debug("getAllLoggerConfig");
        return asList(getCurrentConfigAsDocument().getElementsByTagName("logger")).stream().map((node) -> {
            String category = checkNotBlank(((Element) node).getAttribute("name")),
                    level = checkNotBlank(((Element) node).getAttribute("level")),
                    description = Optional.ofNullable(suggestedLoggers.get(category)).map(LoggerConfig::getDescription).orElse("");
            return new LoggerConfigImpl(category, description, level);
        }).collect(toList());
    }

    @Override
    public List<LoggerConfig> getAllLoggerConfigIncludeUnconfigured() {
        Map<String, LoggerConfig> configuredLoggers = uniqueIndex(getAllLoggerConfig(), LoggerConfig::getCategory);
        return set(suggestedLoggers.keySet()).with(configuredLoggers.keySet()).stream().sorted()
                .map(c -> configuredLoggers.getOrDefault(c, suggestedLoggers.get(c)))
                .collect(toImmutableList());
    }

    @Override
    public void removeLoggerConfig(String category) {
        logger.info("removeLoggerConfig = {}", category);
        Document document = getCurrentConfigAsDocument();
        asList(document.getElementsByTagName("logger")).stream().filter((node) -> equal(((Element) node).getAttribute("name"), category)).forEach((node) -> {
            node.getParentNode().removeChild(node);
        });
        setConfig(document);
    }

    @Override
    public void setLoggerConfig(LoggerConfig loggerConfig) {
        logger.info("setLoggerConfig = {}", loggerConfig);
        Document document = getCurrentConfigAsDocument();
        setLoggerConfigInDocument(document, loggerConfig);
        setConfig(document);
    }

    @Override
    public String getConfigFileContent() {
        return configHelper.getConfigFileContentOrDefault();
    }

    private List<File> getLogFiles(boolean includeArchives) {
        List<File> configFiles = includeArchives ? logbackHelper.getAllLogFiles() : logbackHelper.getActiveLogFiles();
        if (directoryService.hasContainerLogDirectory()) {
            File catalinaOut = new File(directoryService.getContainerLogDirectory(), "catalina.out");//TODO improve this
            if (catalinaOut.exists()) {
                configFiles = set(configFiles).with(catalinaOut).stream().sorted().collect(toImmutableList());
            }
        }
        return configFiles;
    }

    private DataHandler downloadLogFiles(List<File> files) {
        File temp = tempFile("logs_", ".zip");
        try (ZipOutputStream zip = new ZipOutputStream(new FileOutputStream(temp))) {
            files.forEach(rethrowConsumer(f -> {
                zip.putNextEntry(new ZipEntry(f.getName()));
                copy(f, zip);
                zip.closeEntry();
            }));
        } catch (IOException ex) {
            throw runtime(ex);
        }
        return newDataHandler(temp);
    }

    private File getLogFileBynameOrPath(String fileNameOrPath) {
        checkNotBlank(fileNameOrPath);
        return getAllLogFiles().stream().filter(f -> equal(f.getName(), fileNameOrPath) || equal(f.getAbsolutePath(), fileNameOrPath)).collect(onlyElement("log file not found for fileName/path =< %s >", fileNameOrPath));
    }

    private boolean isAutoconfigureEnabled() {
        try {
            return configuration.isLogbackAutoconfigurationEnabled() && toBooleanOrDefault(XPathFactory.newInstance().newXPath().compile("//*[local-name()='property'][@name='CM_AUTO_UPGRADE_CONFIG']/@value").evaluate(stringToDocument(getConfigFileContent()), XPathConstants.STRING), true);
        } catch (Exception ex) {
            logger.error("error processing logger config file", ex);
            return true;
        }
    }

    private void upgradeLoggerConfigFileIfRequired() {
        if (directoryService.hasConfigDirectory()) {
            try {
                List<LoggerConfig> curLoggers = getAllLoggerConfig();
                boolean recreateConfigFile = !repository.hasConfigFile() || isAutoconfigureEnabled();
                if (recreateConfigFile) {
                    Document document = stringToDocument(configHelper.setConfigPropertiesInLogbackConfig(repository.getDefaultLogbackConfig()));
                    curLoggers.forEach(l -> setLoggerConfigInDocument(document, l));
                    String newConfig = documentToString(document);
                    if (!repository.hasConfigFile() || !equal(getConfigFileContent(), newConfig)) {
                        logger.info("upgrade logger config file");
                        setConfig(newConfig);
                    }
                } else {
                    logger.debug("skip logger config auto upgrade");
                }
            } catch (Exception ex) {
                logger.error("error processing logger config file", ex);
            }
        }
    }

    private void setLoggerConfigInDocument(Document document, LoggerConfig loggerConfig) {
        Stream<Element> stream = asList(document.getElementsByTagName("logger")).stream().map((Node n) -> ((Element) n));

        Optional<Element> thisLogger = stream.filter((element) -> equal(element.getAttribute("name"), loggerConfig.getCategory())).findFirst();
        if (thisLogger.isPresent()) {
            logger.debug("logger config already present, update element = {}", thisLogger.get());
            thisLogger.get().setAttribute("level", loggerConfig.getLevel());
        } else {
            logger.debug("logger config not present, insert new logger element before root logger element, for category = {}", loggerConfig.getCategory());
            Element rootLogger = (Element) document.getElementsByTagName("root").item(0);
            Element newLogger = document.createElement("logger");
            newLogger.setAttribute("name", loggerConfig.getCategory());
            newLogger.setAttribute("level", loggerConfig.getLevel());
            rootLogger.getParentNode().insertBefore(newLogger, rootLogger);
            rootLogger.getParentNode().insertBefore(document.createTextNode("\n\n\t"), rootLogger);
        }

    }

    private Document getCurrentConfigAsDocument() {
        try {
            return stringToDocument(getConfigFileContent());
        } catch (Exception ex1) {
            logger.error("error reading current log config, trying to reset config", ex1);
            try {
                return stringToDocument(configHelper.setConfigPropertiesInLogbackConfig(repository.getDefaultLogbackConfig()));
            } catch (Exception ex2) {
                logger.error("error processing default log config, using fallback config", ex2);
                return stringToDocument(configHelper.setConfigPropertiesInLogbackConfig(repository.getFallbackLogbackConfig()));
            }
        }
    }

    private void setConfig(Document document) {
        setConfig(documentToString(document));
    }

    private void setConfig(String config) {
        configService.putString(CORE_LOGGER_CONFIG_PROPERTY, pack(config));
    }

    private void reloadLoggerConfigFromDbIfExistsSafe() {
        try {
            reloadLoggerConfigFromDbIfExists();
            status = MS_READY;
        } catch (Exception ex) {
            status = MS_ERROR;
            logbackHelper.configureLogback(repository.getFallbackLogbackConfig());
            logger.error("error reloading logger config from db", ex);
        }
    }

    private void reloadLoggerConfigFromDbIfExists() {
        String config = unpackIfPacked(configuration.getLoggerConfig());
        if (isNotBlank(config)) {
            config = configHelper.setConfigPropertiesInLogbackConfig(config);
            if (!equal(repository.getLogbackConfig(), config)) {
                logbackHelper.configureLogback(config);
                repository.setLogbackConfig(config);
            }
        }
    }

}
