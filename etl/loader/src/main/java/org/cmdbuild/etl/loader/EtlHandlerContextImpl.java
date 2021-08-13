/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.Map;
import javax.annotation.Nullable;

public class EtlHandlerContextImpl<T> implements EtlHandlerContext<T> {

    private final T data;
    private final Map<String, String> meta;

    public EtlHandlerContextImpl(@Nullable T data, Map<String, String> meta) {
        this.data = data;
        this.meta = checkNotNull(meta);
    }

    @Nullable
    @Override
    public T getData() {
        return data;
    }

    @Override
    public Map<String, String> getMeta() {
        return meta;
    }

}
