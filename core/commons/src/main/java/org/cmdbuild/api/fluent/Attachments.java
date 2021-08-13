package org.cmdbuild.api.fluent;

import static com.google.common.collect.Iterables.getOnlyElement;
import javax.annotation.Nullable;

public interface Attachments {

    Iterable<AttachmentDescriptor> fetch();

    void upload(Attachment... attachments);

    void upload(String name, @Nullable String description, @Nullable String category, Object document);

    SelectedAttachments selectByName(String... names);

    // TODO add later
    // SelectedAttachments selectByRegex(String regex);
    SelectedAttachments selectAll();

    default void upload(String name, Object document) {
        upload(name, null, null, document);
    }

    default Attachment download(String name) {
        return getOnlyElement(selectByName(name).download());
    }
}
