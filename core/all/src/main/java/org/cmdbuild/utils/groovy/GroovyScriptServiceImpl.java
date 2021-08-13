/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.groovy;

import static com.google.common.base.Objects.equal;
import static java.lang.String.format;
import java.util.Map;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.capitalize;
import org.cmdbuild.cache.CacheService;
import org.cmdbuild.cache.CmCache;
import static org.cmdbuild.utils.hash.CmHashUtils.hash;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.normalizeId;
import org.springframework.stereotype.Component;

@Component
public class GroovyScriptServiceImpl implements GroovyScriptService {

    private final CmCache<GroovyScriptExecutor> cache;

    public GroovyScriptServiceImpl(CacheService cacheService) {
        cache = cacheService.newCache("groovy_script_executors");
    }

    @Override
    public GroovyScriptExecutor getScriptExecutor(String scriptContent, @Nullable ClassLoader customClassLoader, Iterable<String> scriptParams, Map<String, String> hints) {
        return doGetScriptExecutor(createClassname(hash(scriptContent)), scriptContent, customClassLoader, scriptParams, hints);
    }

    @Override
    public GroovyScriptExecutor getScriptExecutor(String key, String scriptContent, @Nullable ClassLoader customClassLoader, Iterable<String> scriptParams, Map<String, String> hints) {
        if (equal(key, GROOVY_SCRIPT_NO_CACHE)) {
            return new GroovyScriptExecutorImpl(createClassname("Once" + hash(scriptContent, 8)), scriptContent, customClassLoader, scriptParams, hints);
        } else {
            return doGetScriptExecutor(createClassname(checkNotBlank(key) + hash(scriptContent, 4)), scriptContent, customClassLoader, scriptParams, hints);
        }
    }

    private GroovyScriptExecutor doGetScriptExecutor(String className, String scriptContent, @Nullable ClassLoader customClassLoader, Iterable<String> scriptParams, Map<String, String> hints) {
        return cache.get(className, () -> {
            return new GroovyScriptExecutorImpl(className, scriptContent, customClassLoader, scriptParams, hints);
        });
    }

    public static String createClassname(String key) {
        return format("GroovyScript%s", capitalize(normalizeId(key)));
    }

}
