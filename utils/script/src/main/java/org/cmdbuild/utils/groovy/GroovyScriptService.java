/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.groovy;

import static java.util.Collections.emptyMap;
import java.util.Map;
import javax.annotation.Nullable;

public interface GroovyScriptService {

    static final String GROOVY_SCRIPT_NO_CACHE = "NO_CACHE";

    GroovyScriptExecutor getScriptExecutor(String key, String scriptContent, @Nullable ClassLoader customClassLoader, Iterable<String> scriptParams, Map<String, String> hints);

    GroovyScriptExecutor getScriptExecutor(String scriptContent, @Nullable ClassLoader customClassLoader, Iterable<String> scriptParams, Map<String, String> hints);

    default GroovyScriptExecutor getScriptExecutor(String key, String scriptContent, Iterable<String> scriptParams, Map<String, String> hints) {
        return getScriptExecutor(key, scriptContent, null, scriptParams, hints);
    }

    default GroovyScriptExecutor getScriptExecutor(String scriptContent, Iterable<String> scriptParams, Map<String, String> hints) {
        return getScriptExecutor(scriptContent, (ClassLoader) null, scriptParams, hints);
    }

    default Map<String, Object> executeScript(String script, Map<String, Object> dataIn) {
        return executeScript(script, null, dataIn);
    }

    default Map<String, Object> executeScript(String script, @Nullable ClassLoader customClassLoader, Map<String, Object> dataIn) {
        return getScriptExecutor(script, customClassLoader, dataIn.keySet(), emptyMap()).execute(dataIn);
    }

    default Map<String, Object> executeScriptOnce(String script, Map<String, Object> data) {
        return getScriptExecutor(GROOVY_SCRIPT_NO_CACHE, script, null, data.keySet(), emptyMap()).execute(data);
    }

}
