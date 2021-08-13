package org.cmdbuild.api.fluent;

abstract class AbstractActiveCard extends CardImpl {

    private final FluentApiExecutor executor;

    AbstractActiveCard(FluentApiExecutor executor, String className, Long id) {
        super(className, id);
        this.executor = executor;
    }

    protected FluentApiExecutor executor() {
        return executor;
    }

}
