/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.requestcontext;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Supplier;
import java.util.Map;
import javax.annotation.Nullable;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.truncate;
import static org.cmdbuild.utils.random.CmRandomUtils.randomId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class RequestContextServiceImpl implements RequestContextService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ThreadLocal<RequestContext> requestContextHolder = new ThreadLocal<>();

    @Override
    public <T> RequestContextHolder<T> createRequestContextHolder(Supplier<T> initialValueSupplier) {
        return new RequestContextHolderImpl<>(initialValueSupplier);
    }

    @Override
    public RequestContext getRequestContext() {
        RequestContext requestContext = requestContextHolder.get();
        if (requestContext == null) {
            requestContext = new RequestContextImpl("sys_" + truncate(Thread.currentThread().getName(), 20) + "_" + randomId(4));
            logger.warn("invoked getRequestContext(), but there is no request context set on this thread! generating sys request context = {}", requestContext, new Exception("stack trace"));
            requestContextHolder.set(requestContext);
        }
        return requestContext;
    }

    @Override
    public void initCurrentRequestContext(String identifier, Map<String, Object> data) {
        logger.debug("init request context for this request thread with id = {}", identifier);
        RequestContextImpl requestContext = new RequestContextImpl(identifier);
        data.forEach(requestContext::set);
        requestContextHolder.set(requestContext);
    }

    @Override
    public void destroyCurrentRequestContext() {
        logger.debug("destroy request context for this request thread");
        requestContextHolder.remove();
    }

    @Override
    public boolean hasRequestContext() {
        return requestContextHolder.get() != null;
    }

    private static class RequestContextImpl implements RequestContext {

        private final Map map = map();
        private final String id;

        public RequestContextImpl(String id) {
            this.id = checkNotBlank(id);
            checkArgument(id.length() <= 50, "request context identifier too long (max size 50 chars)");//TODO validate/normalize chars
        }

        @Override
        public Map<String, Object> getData() {
            return map;
        }

        @Override
        public <T> T get(String key) {
            return (T) map.get(checkNotBlank(key));
        }

        @Override
        public void set(String key, Object value) {
            map.put(checkNotBlank(key), value);
        }

        @Override
        public String getId() {
            return id;
        }

        @Override
        public String toString() {
            return "RequestContext{" + "id=" + id + '}';
        }

    }

    private class RequestContextHolderImpl<T> implements RequestContextHolder<T> {

        private final String key = randomId();
        private final Supplier<T> initialValueSupplier;

        public RequestContextHolderImpl(Supplier<T> initialValueSupplier) {
            this.initialValueSupplier = checkNotNull(initialValueSupplier);
        }

        @Override
        public void set(T value) {
            getRequestContext().set(key, value);
        }

        @Override
        @Nullable
        public T getOrNull() {
            return hasRequestContext() ? getRequestContext().get(key) : null;
        }

        @Override
        public T get() {
            return checkNotNull(getRequestContext().get(key, initialValueSupplier::get), "missing value in request context holder");
        }

    }

    private final static RequestContextService INSTANCE = new RequestContextServiceImpl();

    public static RequestContextService getInstance() {
        return INSTANCE;
    }
}
