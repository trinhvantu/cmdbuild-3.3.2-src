/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.handler;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.Iterables.getOnlyElement;
import java.io.File;
import static java.lang.String.format;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import javax.annotation.Nullable;
import static org.apache.commons.io.FileUtils.deleteQuietly;
import org.cmdbuild.config.api.DirectoryService;
import org.cmdbuild.etl.EtlException;
import static org.cmdbuild.utils.date.CmDateUtils.dateTimeFileSuffix;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class FileReaderHelperService {

    public final static String PROCESSED_FILE_EXT = "_processed", FAIL_ON_MISSING_SOURCE_DATA_CONFIG = "failOnMissingSourceData";

    private final DirectoryService directoryService;

    public FileReaderHelperService(DirectoryService directoryService) {
        this.directoryService = checkNotNull(directoryService);
    }

    public FileReaderHelper newHelper(Map<String, ?> config) {
        return new FileReaderHelper(config);
    }

    public class FileReaderHelper {

        private final Logger logger = LoggerFactory.getLogger(getClass());

        private final String directory, filePattern, targetDirectory;
        private final PostImportAction postImportAction;
        private final boolean failOnMissingSourceData;

        private FileReaderHelper(Map<String, ?> config) {
            directory = checkNotBlank(toStringOrNull(config.get("directory")), "missing `directory` param");
            filePattern = toStringOrNull(config.get("filePattern"));
            postImportAction = parseEnum(toStringOrNull(config.get("postImportAction")), PostImportAction.class);
            switch (postImportAction) {
                case PIA_MOVE_FILES:
                    targetDirectory = checkNotBlank(toStringOrNull(config.get("targetDirectory")), "missing `targetDirectory` param");
                    break;
                default:
                    targetDirectory = null;
            }
            failOnMissingSourceData = toBooleanOrDefault(config.get(FAIL_ON_MISSING_SOURCE_DATA_CONFIG), true);
        }

        public boolean failForMissingFile() {
            return failOnMissingSourceData;
        }

        public boolean failForMissingDir() {
            return failOnMissingSourceData;
        }

        @Nullable
        public File getFileForImport() {
            File dir = directoryService.getFileRelativeToContainerDirectoryIfAvailableAndNotAbsolute(new File(directory));
            if (!dir.exists()) {
                if (failForMissingDir()) {
                    throw new EtlException("CM: invalid source dir =< %s >", directory);
                } else {
                    logger.warn(marker(), "CM: invalid source dir = {}", dir.getAbsolutePath());
                    return null;
                }
            }
            List<File> files = list(dir.listFiles());
            if (isNotBlank(filePattern)) {
                files = files.stream().filter(f -> Pattern.compile(filePattern).matcher(f.getName()).find()).collect(toList());
            }
            files = files.stream().filter(f -> !f.getName().endsWith(PROCESSED_FILE_EXT)).collect(toList());
            if (files.isEmpty()) {
                if (failOnMissingSourceData) {
                    throw new EtlException("CM: no file found in dir =< %s > with pattern =< %s >", directory, firstNotBlank(filePattern, ".*"));
                } else {
                    logger.warn(marker(), "CM: no file found in dir = {} with pattern =< {} >", dir.getAbsolutePath(), firstNotBlank(filePattern, ".*"));
                    return null;
                }
            }
            checkArgument(files.size() == 1, "expected only one file for import job, but found many = %s", files.stream().map(File::getAbsolutePath).collect(joining(", ")));
            return getOnlyElement(files);
        }

        public void handlePostImportAction() {
            logger.debug("handle post import action = {}", postImportAction);
            File file = checkNotNull(getFileForImport());
            switch (postImportAction) {
                case PIA_DELETE_FILES:
                    deleteQuietly(file);
                    logger.debug("delete processed file = {}", file.getAbsolutePath());
                    break;
                case PIA_DO_NOTHING:
                    break;
                case PIA_DISABLE_FILES:
                    File targetForRename = new File(file.getParentFile(), format("%s_%s%s", file.getName(), dateTimeFileSuffix(), PROCESSED_FILE_EXT));
                    logger.debug("move processed file to {}", targetForRename.getAbsolutePath());
                    checkArgument(file.renameTo(targetForRename), "failed to move file to %s", targetForRename.getAbsolutePath());
                    break;
                case PIA_MOVE_FILES:
                    File targetDir = directoryService.getFileRelativeToContainerDirectoryIfAvailableAndNotAbsolute(new File(checkNotBlank(targetDirectory)));
                    targetDir.mkdirs();
                    checkArgument(targetDir.isDirectory(), "invalid target dir = %s", targetDir.getAbsolutePath());
                    File targetForMove = new File(targetDir, file.getName());
                    logger.debug("move processed file to {}", targetForMove.getAbsolutePath());
                    checkArgument(file.renameTo(targetForMove), "failed to move file to %s", targetForMove.getAbsolutePath());
                    break;
                default:
                    throw new EtlException("unsupported port import action = %s", postImportAction);
            }
        }

    }

}
