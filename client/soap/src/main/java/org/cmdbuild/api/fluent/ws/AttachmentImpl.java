package org.cmdbuild.api.fluent.ws;

import java.util.Optional;
import java.util.function.Supplier;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import org.cmdbuild.api.fluent.Attachment;

public class AttachmentImpl extends AttachmentDescriptorImpl implements Attachment {

    private Supplier<String> url;
    private Supplier<DataSource> data;

    public AttachmentImpl() {
    }

    public AttachmentImpl(String name, String description, String category, @Nullable Supplier<String> url, @Nullable Supplier<DataSource> data) {
        super(name, description, category);
        this.url = url;
        this.data = data;
    }

    @Override
    @Nullable
    public String getUrl() {
        return Optional.ofNullable(url).map(Supplier::get).orElse(null);
    }

    public void setUrl(String url) {
        this.url = () -> url;
        this.data = null;
    }

    @Override
    @Nullable
    public DataSource getData() {
        return Optional.ofNullable(data).map(Supplier::get).orElse(null);
    }

}
