package org.cmdbuild.api.fluent;

import static java.util.Arrays.asList;
import static java.util.Collections.unmodifiableSet;

import java.util.List;
import java.util.Set;
import org.cmdbuild.utils.lang.CmCollectionUtils;

public class QueryClass extends AbstractActiveCard {

    private final Set<String> requestedAttributes = CmCollectionUtils.set();

    public QueryClass(FluentApiExecutor executor, String className) {
        super(executor, className, null);
    }

    public QueryClass withCode(String value) {
        super.setCode(value);
        return this;
    }

    public QueryClass withDescription(String value) {
        super.setDescription(value);
        return this;
    }

    public QueryClass with(String name, Object value) {
        return withAttribute(name, value);
    }

    public QueryClass withAttribute(String name, Object value) {
        super.set(name, value);
        return this;
    }

    public QueryClass limitAttributes(String... names) {
        requestedAttributes.addAll(asList(names));
        return this;
    }

    public Set<String> getRequestedAttributes() {
        return unmodifiableSet(requestedAttributes);
    }

    public List<Card> fetch() {
        return executor().fetchCards(this);
    }

}
