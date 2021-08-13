/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.handler;

import com.google.common.collect.ImmutableList;
import static java.lang.String.format;
import static java.util.Collections.emptyMap;
import java.util.List;
import javax.activation.DataSource;
import static org.apache.commons.io.FileUtils.byteCountToDisplaySize;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.etl.gate.inner.EtlGateHandlerType;
import static org.cmdbuild.etl.gate.inner.EtlGateHandlerType.ETLHT_URLREADER;
import org.cmdbuild.etl.job.EtlLoadHandler;
import org.cmdbuild.etl.job.EtlLoaderApi;
import org.cmdbuild.etl.loader.EtlHandlerContext;
import org.cmdbuild.etl.loader.EtlHandlerContextImpl;
import org.cmdbuild.utils.UrlHandler;
import org.cmdbuild.utils.UrlHandlerResponse;
import org.cmdbuild.utils.UrlHandlerResponseImpl;
import static org.cmdbuild.utils.io.CmIoUtils.countBytes;
import static org.cmdbuild.utils.io.CmIoUtils.isUrl;
import static org.cmdbuild.utils.io.CmIoUtils.urlToDataSource;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class UrlReaderEtlLoadHandler implements EtlLoadHandler {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final List<UrlHandler> urlHandlers;

    public UrlReaderEtlLoadHandler(List<UrlHandler> urlHandlers) {
        this.urlHandlers = (List) ImmutableList.builder().addAll(urlHandlers).add(new DefaultHandler()).build();
    }

    @Override
    public EtlGateHandlerType getType() {
        return ETLHT_URLREADER;
    }

    @Override
    public EtlHandlerContext load(EtlLoaderApi api) {
        String urlParam = firstNotBlank(api.getConfig("urlParam"), "url");
        String url = isUrl(urlParam) ? urlParam : api.getParam(urlParam);
        if (isBlank(url)) {
            logger.info("source url is missing");
            return new EtlHandlerContextImpl(null, api.getMeta());
        } else {
            logger.info("load data from url =< {} >", url);
            for (UrlHandler handler : urlHandlers) {
                if (handler.handlesUrl(url)) {
                    UrlHandlerResponse response = handler.loadFromUrl(url);
                    DataSource data = response.getDataSource();
                    logger.info("found data = {} ( {} {} ) with meta =\n\n{}\n", data.getName(), byteCountToDisplaySize(countBytes(data)), data.getContentType());
                    return new EtlHandlerContextImpl(data, map(api.getMeta()).with(map(response.getMeta()).mapKeys(k -> format("param_%s", k))));
                }
            }
            throw new IllegalStateException();
        }
    }

    private class DefaultHandler implements UrlHandler {

        @Override
        public boolean handlesUrl(String url) {
            return true;
        }

        @Override
        public UrlHandlerResponse loadFromUrl(String url) {
            return new UrlHandlerResponseImpl(urlToDataSource(url), emptyMap());//TODO meta
        }

    }

}
