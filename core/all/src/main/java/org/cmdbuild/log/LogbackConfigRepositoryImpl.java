/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.log;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import java.io.File;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.config.api.DirectoryService;
import org.cmdbuild.utils.io.CmIoUtils;
import static org.cmdbuild.utils.io.CmIoUtils.writeToFile;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class LogbackConfigRepositoryImpl implements LogbackConfigRepository {

    private final static String LOGBACK_CONFIG_FILE_NAME = "logback.xml",
            DEFAULT_LOGBACK_CONFIG_TEMPLATE = checkNotBlank(readToString(LogbackConfigRepositoryImpl.class.getResourceAsStream("/org/cmdbuild/log/logback_default.xml"))),
            FALLBACK_LOGBACK_CONFIG = checkNotBlank(readToString(LogbackConfigRepositoryImpl.class.getResourceAsStream("/org/cmdbuild/log/logback_fallback.xml")));

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DirectoryService directoryService;

    public LogbackConfigRepositoryImpl(DirectoryService directoryService) {
        this.directoryService = checkNotNull(directoryService);
    }

    @Override
    public String getDefaultLogbackConfig() {
        return DEFAULT_LOGBACK_CONFIG_TEMPLATE;
    }

    @Override
    public String getFallbackLogbackConfig() {
        return FALLBACK_LOGBACK_CONFIG;
    }

    @Override
    @Nullable
    public String getLogbackConfig() {
        if (directoryService.hasConfigDirectory()) {
            File file = getConfigFile();
            if (file.exists()) {
                try {
                    return CmIoUtils.readToString(file);
                } catch (Exception ex) {
                    logger.error("error reading logback config from file = {}", file, ex);
                }
            }
        }
        return null;
    }

    @Override
    public void setLogbackConfig(String xmlConfiguration) {
        checkArgument(directoryService.hasConfigDirectory(), "unable to store logback config: config directory is not available");
        File file = getConfigFile();
        if (file.exists()) {
            directoryService.backupFileSafe(file);
        }
        logger.info("update logback config file = {}", file.getAbsolutePath());
        writeToFile(file, xmlConfiguration);
    }

    @Override
    public boolean hasConfigFile() {
        return directoryService.hasConfigDirectory() && getConfigFile().isFile() && isNotBlank(getLogbackConfig());
    }

    private File getConfigFile() {
        return new File(directoryService.getConfigDirectory(), LOGBACK_CONFIG_FILE_NAME);
    }
}
