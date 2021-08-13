/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.groovy;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.MoreCollectors.toOptional;
import groovy.lang.GroovyClassLoader;
import java.util.Collection;
import java.util.Map;
import static java.util.stream.Collectors.toList;
import java.util.stream.Stream;
import javax.annotation.Nullable;
import static org.cmdbuild.utils.lang.CmCollectionUtils.listOf;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmExecutorUtils.safe;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.abbreviate;
import static org.cmdbuild.utils.lang.CmStringUtils.addLineNumbers;
import static org.cmdbuild.utils.lang.CmStringUtils.getLine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GroovyScriptExecutorImpl implements GroovyScriptExecutor {//TODO move this in its own utility project

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final String scriptContent;
    private final GroovyScriptClass preparedScript;
    private final GroovyScript compiledScript;
    private final Collection<String> paramNames;
    private final ClassLoader customClassLoader;

    public GroovyScriptExecutorImpl(String className, String scriptContent, @Nullable ClassLoader customClassLoader, Iterable<String> globalParameters, Map<String, String> hints) {
        try {
            logger.debug("create groovy script executor for script = \n\n{}\n\n", scriptContent);
            checkNotBlank(className);
            this.scriptContent = checkNotNull(scriptContent);
            this.customClassLoader = customClassLoader;
            Stream<String> stream = set(checkNotNull(globalParameters)).stream();
            if (toBooleanOrDefault(hints.get(ENABLE_GROOVY_SMART_VARIABLES), false)) {
                stream = stream.filter((key) -> scriptContent.contains(key));//TODO warning, this won't find vars used by scripts or other
            }
            paramNames = stream.sorted().collect(toList());
            preparedScript = new GroovyScriptToClassHelper(className, scriptContent, paramNames).buildGroovyClassScript();
            logger.debug("compiling groovy script = \n\n{}\n\n", preparedScript.getCode());
            ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
            if (customClassLoader != null) {
                Thread.currentThread().setContextClassLoader(customClassLoader);
            }
            try {
                GroovyClassLoader groovyClassLoader = new GroovyClassLoader();
                Class<GroovyScript> groovyClass = checkNotNull(groovyClassLoader.parseClass(preparedScript.getCode(), preparedScript.getClassName()));
                try {
                    compiledScript = groovyClass.newInstance();
                } catch (Exception ex) {
                    logger.error("error compiling groovy script from class script = \n\n{}\n", preparedScript.getCode());
                    throw new GroovyScriptException(ex, "error compiling groovy script");
                }
            } finally {
                if (customClassLoader != null) {
                    Thread.currentThread().setContextClassLoader(contextClassLoader);
                }
            }
        } catch (Exception ex) {
            logger.error("error preparing script = \n\n{}\n", scriptContent);
            throw new GroovyScriptException(ex, "error preparing groovy script");
        }
    }

    @Override
    public Map<String, Object> execute(Map<String, Object> dataIn) {
        Map<String, Object> dataOut = map();
        ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        if (customClassLoader != null) {
            Thread.currentThread().setContextClassLoader(customClassLoader);
        }
        try {
            try {
                compiledScript.execute(dataIn, dataOut);
            } finally {
                if (customClassLoader != null) {
                    Thread.currentThread().setContextClassLoader(contextClassLoader);
                }
            }
        } catch (Exception ex) {
            logger.debug("error executing groovy class code = \n\n{}\n", addLineNumbers(preparedScript.getCode()));
            logger.error("error executing script = \n\n{}\n", addLineNumbers(scriptContent));
            StackTraceElement element = listOf(StackTraceElement.class).with(ex.getStackTrace()).stream().filter(e -> equal(e.getClassName(), compiledScript.getClass().getName())).limit(1).collect(toOptional()).orElse(null);
            if (element == null) {
                throw new GroovyScriptException(ex, "error executing script");
            } else {
                int lineNumber = element.getLineNumber() - preparedScript.getScriptOffset();
                throw new GroovyScriptException(ex, "error executing groovy script at line = %s, near < %s >", lineNumber + 1, abbreviate(safe(() -> getLine(lineNumber, scriptContent))));
            }
        }
        return map(dataIn).with(dataOut);
    }

}
