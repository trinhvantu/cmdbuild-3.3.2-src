/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.workflow.core.fluentapi;

import static java.util.Arrays.asList;
import javax.annotation.Nullable;

public interface SystemApi {

    <T> T getService(String name);

    <T> T getService(Class<T> classe);

    @Nullable
    String getSystemConfig(String key);

    SqlApi sql();

    LookupApi lookup();

    void reload();

    void dropCache(String cache);

    default void dropCache(String... cache) {
        asList(cache).forEach(this::dropCache);
    }

    @Nullable
    default String getConfig(String key) {
        return getSystemConfig(key);
    }

}
