package org.cmdbuild.workflow.commons.fluentapi;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.concurrent.Callable;

public interface ImpersonateApi<T> {

    ImpersonateApi username(String username);

    ImpersonateApi group(String group);

    ImpersonateApi sponsor(String sponsor);

    T impersonate();

    <O> O call(Callable<O> callable);

    default ImpersonateApi actingAs(String sponsor) {
        return sponsor(sponsor);
    }

    default T then() {
        return impersonate();
    }

    default void run(Runnable runnable) {
        checkNotNull(runnable);
        call(() -> {
            runnable.run();
            return null;
        });
    }
}
