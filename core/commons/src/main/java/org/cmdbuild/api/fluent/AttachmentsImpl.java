package org.cmdbuild.api.fluent;

import static com.google.common.base.Predicates.alwaysTrue;
import static com.google.common.collect.Lists.newArrayList;
import static org.apache.commons.lang3.ObjectUtils.defaultIfNull;

import java.util.Collection;

import com.google.common.base.Predicate;
import static org.cmdbuild.utils.io.CmIoUtils.isUrl;

public class AttachmentsImpl implements Attachments {

    private static final Attachment[] NO_ATTACHMENTS = new Attachment[]{};
    private static final String[] NO_NAMES = new String[]{};
    private static final Predicate<AttachmentDescriptor> ALL_ELEMENTS = alwaysTrue();

    private final FluentApiExecutor executor;
    private final CardDescriptor descriptor;

    AttachmentsImpl(FluentApiExecutor executor, CardDescriptor descriptor) {
        this.executor = executor;
        this.descriptor = descriptor;
    }

    @Override
    public Iterable<AttachmentDescriptor> fetch() {
        return executor.fetchAttachments(descriptor);
    }

    @Override
    public void upload(Attachment... attachments) {
        executor.upload(descriptor, newArrayList(defaultIfNull(attachments, NO_ATTACHMENTS)));
    }

    @Override
    public void upload(String name, String description, String category, Object document) {
        Attachment attachment;
        if (document instanceof String && isUrl((String) document)) {
            attachment = new AttachmentImpl(name, description, category, (String) document);
        } else {
            attachment = new AttachmentImpl(name, description, category, (Object) document);
        }
        executor.upload(descriptor, newArrayList(attachment));
    }

    @Override
    public SelectedAttachments selectByName(String... names) {
        return new SelectedAttachmentsImpl(executor, descriptor, new NamePredicate(newArrayList(defaultIfNull(names, NO_NAMES))));
    }

    @Override
    public SelectedAttachments selectAll() {
        return new SelectedAttachmentsImpl(executor, descriptor, ALL_ELEMENTS);
    }

    private static class NamePredicate implements Predicate<AttachmentDescriptor> {

        private final Collection<String> allowed;

        public NamePredicate(final Iterable<String> names) {
            allowed = newArrayList(names);
        }

        @Override
        public boolean apply(final AttachmentDescriptor input) {
            return allowed.contains(input.getName());
        }

    }
}
