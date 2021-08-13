/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.jobs.runners.script;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import java.util.Map;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.api.fluent.CmApiService;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.customclassloader.CustomClassloaderService;
import org.cmdbuild.jobs.JobData;
import org.cmdbuild.jobs.JobRunContext;
import org.cmdbuild.jobs.JobRunner;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmStringUtils.normalize;
import org.cmdbuild.utils.beanshell.BeanshellScriptExecutor;
import static org.cmdbuild.utils.encode.CmPackUtils.unpackIfPacked;
import org.cmdbuild.utils.groovy.GroovyScriptService;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ScriptJobRunner implements JobRunner {

    public static final String SCRIPT_JOB_TYPE = "script",
            SCRIPT_CONFIG_SCRIPT = "script",
            SCRIPT_CONFIG_LANGUAGE = "language",
            SCRIPT_CONFIG_CLASSPATH = "classpath",
            SCRIPT_CONFIG_LANGUAGE_BEANSHELL = "beanshell",
            SCRIPT_CONFIG_LANGUAGE_GROOVY = "groovy";

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final CmApiService apiService;
    private final GroovyScriptService groovyScriptService;
    private final CustomClassloaderService customClassloaderService;

    public ScriptJobRunner(CmApiService apiService, GroovyScriptService groovyScriptService, CustomClassloaderService customClassloaderService) {
        this.apiService = checkNotNull(apiService);
        this.groovyScriptService = checkNotNull(groovyScriptService);
        this.customClassloaderService = checkNotNull(customClassloaderService);
    }

    @Override
    public String getName() {
        return SCRIPT_JOB_TYPE;
    }

    @Override
    public void vaildateJob(JobData jobData) {
        new ScriptJobRunHelper(jobData);
    }

    @Override
    public void runJob(JobData jobData, JobRunContext jobContext) {
        new ScriptJobRunHelper(jobData).run();
    }

    private class ScriptJobRunHelper {

        private final JobData jobData;
        private final String script;
        private final String type;

        public ScriptJobRunHelper(JobData jobData) {
            this.jobData = checkNotNull(jobData);
            script = unpackIfPacked(jobData.getConfigNotBlank(SCRIPT_CONFIG_SCRIPT));
            type = firstNotBlank(jobData.getConfig(SCRIPT_CONFIG_LANGUAGE), SCRIPT_CONFIG_LANGUAGE_GROOVY).trim().toLowerCase();
            checkArgument(set(SCRIPT_CONFIG_LANGUAGE_BEANSHELL, SCRIPT_CONFIG_LANGUAGE_GROOVY).contains(type), "invalid script type =< %s >", jobData.getConfig(SCRIPT_CONFIG_LANGUAGE));
        }

        public void run() {
            Map<String, Object> params = map(
                    "job", jobData,
                    "cmdb", apiService.getCmApi(),
                    "logger", LoggerFactory.getLogger(format("%s.job_%s_%s", getClass().getName(), jobData.getId(), normalize(jobData.getCode())))), result;

            switch (type) {
                case SCRIPT_CONFIG_LANGUAGE_GROOVY:
                    result = groovyScriptService.executeScript(script, getCustomClassloaderOrNull(), params);
                    break;
                case SCRIPT_CONFIG_LANGUAGE_BEANSHELL:
                    result = new BeanshellScriptExecutor(script, getCustomClassloaderOrNull()).execute(params);
                    break;
                default:
                    throw new IllegalArgumentException("unsupported script type =< " + type + " >");
            }

            logger.debug(marker(), "executed job = {}, result =\n\n{}\n", jobData, mapToLoggableStringLazy(result));
        }

        @Nullable
        private ClassLoader getCustomClassloaderOrNull() {
            return customClassloaderService.getCustomClassLoaderOrNull(jobData.getConfig(SCRIPT_CONFIG_CLASSPATH));
        }
    }

}
