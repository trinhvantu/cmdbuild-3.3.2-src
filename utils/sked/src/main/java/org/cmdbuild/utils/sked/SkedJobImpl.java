/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.sked;

import static com.google.common.base.Preconditions.checkNotNull;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.sked.SkedJobClusterMode.RUN_ON_ALL_NODES;

public class SkedJobImpl implements SkedJob {

    private final String code, trigger;
    private final Runnable runnable;
    private final SkedJobClusterMode clusterMode;

    private SkedJobImpl(SkedJobImplBuilder builder) {
        this.code = checkNotBlank(builder.code);
        this.trigger = checkNotBlank(builder.trigger);
        this.runnable = checkNotNull(builder.runnable);
        this.clusterMode = firstNotNull(builder.clusterMode, RUN_ON_ALL_NODES);
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getTrigger() {
        return trigger;
    }

    @Override
    public Runnable getRunnable() {
        return runnable;
    }

    @Override
    public SkedJobClusterMode getClusterMode() {
        return clusterMode;
    }

    @Override
    public String toString() {
        return "SkedJob{" + "code=" + code + '}';
    }

    public static SkedJobImplBuilder builder() {
        return new SkedJobImplBuilder();
    }

    public static SkedJob build(String code, String trigger, Runnable runnable) {
        return new SkedJobImplBuilder()
                .withCode(code)
                .withTrigger(trigger)
                .withRunnable(runnable)
                .build();
    }

    public static SkedJobImplBuilder copyOf(SkedJob source) {
        return new SkedJobImplBuilder()
                .withCode(source.getCode())
                .withTrigger(source.getTrigger())
                .withRunnable(source.getRunnable())
                .withClusterMode(source.getClusterMode());
    }

    public static class SkedJobImplBuilder implements Builder<SkedJobImpl, SkedJobImplBuilder> {

        private String code;
        private String trigger;
        private Runnable runnable;
        private SkedJobClusterMode clusterMode;

        public SkedJobImplBuilder withCode(String code) {
            this.code = code;
            return this;
        }

        public SkedJobImplBuilder withTrigger(String trigger) {
            this.trigger = trigger;
            return this;
        }

        public SkedJobImplBuilder withRunnable(Runnable runnable) {
            this.runnable = runnable;
            return this;
        }

        public SkedJobImplBuilder withClusterMode(SkedJobClusterMode clusterMode) {
            this.clusterMode = clusterMode;
            return this;
        }

        @Override
        public SkedJobImpl build() {
            return new SkedJobImpl(this);
        }

    }
}
