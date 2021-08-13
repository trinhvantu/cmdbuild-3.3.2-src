package org.cmdbuild.api.fluent;

import javax.annotation.Nullable;

public class AttachmentImpl implements Attachment {

    private final String url;
    private final String name;
    private final String category;
    private final String description;
    private final Object data;

    public AttachmentImpl(String name, String description, String category, String url) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.url = url;
        this.data = null;
    }

    public AttachmentImpl(String name, String description, String category, Object data) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.url = null;
        this.data = data;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public String getCategory() {
        return category;
    }

    @Override
    @Nullable
    public String getUrl() {
        return url;
    }

    @Override
    @Nullable
    public Object getDocument() {
        return data;
    }

}
