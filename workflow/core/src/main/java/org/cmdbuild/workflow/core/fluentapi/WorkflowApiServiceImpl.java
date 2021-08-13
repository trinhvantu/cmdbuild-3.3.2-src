/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.workflow.core.fluentapi;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import java.lang.reflect.Method;
import java.util.Collections;
import static java.util.Collections.emptyList;
import java.util.Map;
import javax.inject.Provider;
import org.cmdbuild.api.fluent.CmApiService;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import static org.cmdbuild.utils.lang.CmReflectionUtils.wrapProxy;
import org.cmdbuild.utils.lang.CmStringUtils;
import org.cmdbuild.utils.lang.ProxyWrapper;
import org.cmdbuild.workflow.WorkflowConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class WorkflowApiServiceImpl implements WorkflowApiService, CmApiService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final WorkflowConfiguration config;

    private final Provider<ExtendedApi> workflowApi;

    public WorkflowApiServiceImpl(WorkflowConfiguration config, Provider<ExtendedApi> workflowApi) {
        this.workflowApi = checkNotNull(workflowApi);
        this.config = checkNotNull(config);
    }

    @Override
    public Map<String, Object> getWorkflowApiAsDataMap() {
        return Collections.singletonMap(CMDB_API_PARAM, getWorkflowApi());
    }

    @Override
    public Object getCmApi() {
        return getWorkflowApi();
    }

    @Override
    public ExtendedApi getWorkflowApi() {
        return wrapProxy(ExtendedApi.class, checkNotNull(workflowApi.get()), new LoggerProxyWrapper());
    }

    private class LoggerProxyWrapper extends ProxyWrapper {

        @Override
        public void beforeMethodInvocation(Method method, Object[] params) {
            logger.debug("invoking cmdbuild api method = {} with params = {}", method.getName(), loggable(params));
        }

        @Override
        public void afterFailedMethodInvocation(Method method, Object[] params, Throwable error) {
            switch (config.getApiErrorManagementMode()) {
                case WAE_RETHROW:
                    logger.debug("error invoking method = {} of cmdbuild api with params = {}", method.getName(), loggable(params), error);
                    break;
                case WAE_LOG_AND_RETHROW:
                    logger.warn("error invoking method = {} of cmdbuild api with params = {}", method.getName(), loggable(params), error);
                    break;
                case WAE_LOG_MARK_AND_RETHROW:
                    logger.warn(marker(), "error invoking method = {} of cmdbuild api with params = {}", method.getName(), loggable(params), error);
                    break;
                default:
                    throw unsupported("unsupported api error management mode =< %s >", config.getApiErrorManagementMode());
            }
        }

        private Object loggable(Object[] params) {
            return params == null ? emptyList() : list(params).map(CmStringUtils::toStringOrNullSafe).map(CmStringUtils::abbreviate);
        }

    }
}
