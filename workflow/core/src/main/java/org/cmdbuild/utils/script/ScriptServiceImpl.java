/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.script;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.nullToEmpty;
import static java.lang.String.format;
import static java.util.Collections.emptyMap;
import java.util.Map;
import javax.annotation.Nullable;
import org.cmdbuild.utils.ScriptService;
import org.cmdbuild.utils.beanshell.BeanshellScriptExecutor;
import static org.cmdbuild.utils.encode.CmPackUtils.unpackIfPacked;
import org.cmdbuild.utils.groovy.GroovyScriptService;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import org.cmdbuild.workflow.core.fluentapi.WorkflowApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ScriptServiceImpl implements ScriptService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final WorkflowApiService apiService;
    private final GroovyScriptService groovyScriptService;

    public ScriptServiceImpl(WorkflowApiService apiService, GroovyScriptService groovyScriptService) {
        this.apiService = checkNotNull(apiService);
        this.groovyScriptService = checkNotNull(groovyScriptService);
    }

    @Override
    public ScriptServiceHelper helper() {
        return new ScriptServiceHelperImpl();
    }

    private Map<String, Object> doExecute(ScriptServiceHelperImpl helper) {
        String language = firstNotBlank(helper.language, "groovy").trim().toLowerCase();
        logger.debug("execute {} script = \n\n{}\n", language, helper.script);
        Map<String, Object> input = map(apiService.getWorkflowApiAsDataMap())
                .with("logger", LoggerFactory.getLogger(format("%s.EVAL", firstNotNull(helper.parentLoggerClass, getClass()).getName())))
                .with(helper.dataIn);
        String script = unpackIfPacked(nullToEmpty(helper.script));
        switch (language) {
            case "beanshell":
                return new BeanshellScriptExecutor(script, helper.customClassLoader).execute(input);
            case "groovy":
                return groovyScriptService.executeScript(script, helper.customClassLoader, input);
            default:
                throw new IllegalArgumentException("unsupported script language =< " + language + " >");
        }

    }

    private class ScriptServiceHelperImpl implements ScriptServiceHelper {

        private Class parentLoggerClass;
        private String script, language;
        private ClassLoader customClassLoader;
        private final Map<String, Object> dataIn = map();

        @Override
        public ScriptServiceHelper withLoggerClass(@Nullable Class parentLoggerClass) {
            this.parentLoggerClass = parentLoggerClass;
            return this;
        }

        @Override
        public ScriptServiceHelper withScript(String script) {
            this.script = script;
            return this;
        }

        @Override
        public ScriptServiceHelper withLanguage(@Nullable String language) {
            this.language = language;
            return this;
        }

        @Override
        public ScriptServiceHelper withClassLoader(@Nullable ClassLoader customClassLoader) {
            this.customClassLoader = customClassLoader;
            return this;
        }

        @Override
        public ScriptServiceHelper withData(@Nullable Map<String, Object> dataIn) {
            this.dataIn.putAll(firstNotNull(dataIn, emptyMap()));
            return this;
        }

        @Override
        public ScriptServiceHelper withData(String key, Object value) {
            this.dataIn.put(key, value);
            return this;
        }

        @Override
        public Object executeForOutput() {
            if (!dataIn.containsKey("output")) {
                dataIn.put("output", null);
            }
            return execute().get("output");
        }

        @Override
        public Map<String, Object> execute() {
            return doExecute(this);
        }

    }

}
