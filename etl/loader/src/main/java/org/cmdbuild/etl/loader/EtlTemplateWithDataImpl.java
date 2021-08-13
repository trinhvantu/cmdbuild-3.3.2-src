/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.loader;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Supplier;
import com.google.common.base.Suppliers;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;

public class EtlTemplateWithDataImpl implements EtlTemplateWithData {

    private final EtlTemplate template;
    private final Supplier<List<Map<String, ?>>> data;
    private final Object callback;

    public EtlTemplateWithDataImpl(EtlTemplate template, Supplier<List<Map<String, ?>>> data) {
        this(template, data, null);
    }

    public EtlTemplateWithDataImpl(EtlTemplate template, Supplier<List<Map<String, ?>>> data, @Nullable Object callback) {
        this.template = checkNotNull(template);
        this.data = Suppliers.memoize(() -> checkNotNull(data.get()));
        this.callback = callback;
    }

    @Override
    public EtlTemplate getTemplate() {
        return template;
    }

    @Override
    public List<Map<String, ?>> getData() {
        return data.get();
    }

    @Override
    @Nullable
    public Object getCallback() {
        return callback;
    }

}
