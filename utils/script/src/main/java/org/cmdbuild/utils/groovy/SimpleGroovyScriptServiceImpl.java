/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.groovy;

import java.util.Map;
import java.util.UUID;
import javax.annotation.Nullable;
import org.apache.commons.lang3.StringUtils;

public class SimpleGroovyScriptServiceImpl implements GroovyScriptService {

    @Override
    public GroovyScriptExecutor getScriptExecutor(String scriptContent, @Nullable ClassLoader customClassLoader, Iterable<String> scriptParams, Map<String, String> hints) {
        return getScriptExecutor(scriptContent, scriptContent, customClassLoader, scriptParams, hints);
    }

    @Override
    public GroovyScriptExecutor getScriptExecutor(String key, String scriptContent, @Nullable ClassLoader customClassLoader, Iterable<String> scriptParams, Map<String, String> hints) {
        return new GroovyScriptExecutorImpl(createClassname(key), scriptContent, customClassLoader, scriptParams, hints);
    }

    public static String createClassname(String key) {
        return "GroovyScript" + StringUtils.capitalize(UUID.nameUUIDFromBytes(key.getBytes()).toString().toLowerCase().replaceAll("[^a-z]+", ""));
    }
}
