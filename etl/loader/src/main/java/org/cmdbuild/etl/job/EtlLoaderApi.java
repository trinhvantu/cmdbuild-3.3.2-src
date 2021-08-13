/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.job;

import com.google.common.base.Splitter;
import static com.google.common.base.Strings.nullToEmpty;
import static java.lang.String.format;
import java.util.List;
import java.util.Map;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import static org.cmdbuild.etl.gate.EtlGateService.ETLGATE_REQUEST_METHOD;
import static org.cmdbuild.etl.gate.EtlGateService.ETLGATE_REQUEST_PATH;
import org.cmdbuild.etl.loader.EtlTemplate;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlankOrNull;

public interface EtlLoaderApi {

    String getGateCode();

    String getDataAsString();

    DataSource getData();

    Map<String, String> getConfig();

    Map<String, String> getMeta();

    List<EtlTemplate> getTemplates();

    default String getConfigNotBlank(String key) {
        return checkNotBlank(getConfig(key), "config not found for key =< %s >", key);
    }

    @Nullable
    default String getConfig(String key) {
        return getConfig().get(key);
    }

    @Nullable
    default String getParam(String key) {
        return firstNotBlankOrNull(getMeta(format("param_%s", key)), getMeta(key), getConfig(key));
    }

    default String getParamNotBlank(String key) {
        return checkNotBlank(getParam(key), "config/param not found for key =< %s >", key);
    }

    @Nullable
    default String getMeta(String key) {
        return getMeta().get(key);
    }

    @Nullable
    default String getPath() {
        return getParam(ETLGATE_REQUEST_PATH);
    }

    @Nullable
    default String getMethod() {
        return getParam(ETLGATE_REQUEST_METHOD);
    }

    default List<String> getPathParts() {
        return Splitter.on("/").omitEmptyStrings().trimResults().splitToList(nullToEmpty(getPath()));
    }

}
