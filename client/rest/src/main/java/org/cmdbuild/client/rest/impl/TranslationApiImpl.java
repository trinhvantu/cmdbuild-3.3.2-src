package org.cmdbuild.client.rest.impl;

import static com.google.common.base.Strings.nullToEmpty;
import static java.lang.String.format;
import org.cmdbuild.client.rest.api.TranslationApi;
import org.cmdbuild.client.rest.core.AbstractServiceClientImpl;
import org.cmdbuild.client.rest.core.RestWsClient;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class TranslationApiImpl extends AbstractServiceClientImpl implements TranslationApi {

    public TranslationApiImpl(RestWsClient restClient) {
        super(restClient);
    }

    @Override
    public void put(String code, String lang, String value) {
        put(format("translations/%s", encodeUrlPath(checkNotBlank(code))), map(checkNotBlank(lang), nullToEmpty(value)));
    }

}
