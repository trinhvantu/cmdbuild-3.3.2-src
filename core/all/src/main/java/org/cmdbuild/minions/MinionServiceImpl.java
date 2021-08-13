/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.minions;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.MoreCollectors.toOptional;
import com.google.common.eventbus.Subscribe;
import java.lang.reflect.Method;
import java.util.Collection;
import static java.util.Collections.unmodifiableCollection;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.config.api.AfterConfigReloadEvent;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import static org.cmdbuild.config.api.ConfigValue.TRUE;
import org.cmdbuild.config.api.GlobalConfigService;
import org.cmdbuild.config.api.NamespacedConfigService;
import org.cmdbuild.services.AppContextReadyEvent;
import org.cmdbuild.services.Minion;
import org.cmdbuild.services.MinionComponent;
import org.cmdbuild.services.MinionConfig;
import org.cmdbuild.services.MinionService;
import org.cmdbuild.services.MinionStatus;
import static org.cmdbuild.services.MinionStatus.MS_DISABLED;
import static org.cmdbuild.services.MinionStatus.MS_ERROR;
import static org.cmdbuild.services.MinionStatus.MS_NOTRUNNING;
import static org.cmdbuild.services.MinionStatus.MS_READY;
import org.cmdbuild.services.SystemStartedServicesEvent;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmReflectionUtils.executeMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import org.cmdbuild.system.SystemEventbusService;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmExecutorUtils.waitSafeUntil;

@Component
public class MinionServiceImpl implements MinionService {

    private final static String SERVICE_ENABLED = "enabled";

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final GlobalConfigService configService;
    private final Map<String, MinionImpl> minions = map();

    public MinionServiceImpl(MinionBeanRepository repository, GlobalConfigService configService, SystemEventbusService systemEventService) {
        this.configService = checkNotNull(configService);
        checkNotNull(repository);
        systemEventService.getEventBus().register(new Object() {
            @Subscribe
            public void handleAppContextReadyEvent(AppContextReadyEvent event) {
                try {
                    List<InnerBean> beans = repository.getMinionBeans();
                    logger.info("loading {} system services", beans.size());
                    beans.forEach((innerBean) -> {
                        try {
                            MinionImpl minion = new MinionImpl(innerBean.getBean());
                            minions.put(minion.getId(), minion);
                        } catch (Exception ex) {
                            throw runtime(ex, "error processing system service bean = %s ( %s )", innerBean.getName(), innerBean.getBean());
                        }
                    });
                } catch (Exception ex) {
                    logger.error("error loading system services", ex);//TODO propagate error
                }
            }

            @Subscribe
            public void handleSystemStartedServicesEvent(SystemStartedServicesEvent event) {
                minions.values().forEach((m) -> {
                    try {
                        m.refreshStatus();
                    } catch (Exception ex) {
                        logger.error("error loading service status for service = {}", m, ex);
                    }
                });
            }

        });

    }

    @Override
    public Collection<Minion> getMinions() {
        return (List) list(minions.values()).without(Minion::isExperimental);//TODO configurabile experimental hide/show
    }

    @Override
    public Minion getMinion(String id) {
        return checkNotNull(minions.get(checkNotBlank(id)), "service not found for id =< %s >", id);
    }

    private final class MinionImpl implements Minion {

        private final String name;
        private final Supplier<MinionStatus> statusSupplier;
        private final Supplier<Boolean> enabled;
        private final boolean canStop, experimental;
        private final NamespacedConfigService config;
        private MinionStatus status;

        public MinionImpl(Object innerBean) {
            MinionComponent annotation = checkNotNull(innerBean.getClass().getAnnotation(MinionComponent.class));
            name = firstNotBlank(annotation.name(), annotation.value());

            Method statusMethod = list(innerBean.getClass().getMethods()).stream().filter(m -> m.getParameterCount() == 0 && MinionStatus.class.isAssignableFrom(m.getReturnType())).collect(toOptional()).orElse(null),
                    configMethod = list(innerBean.getClass().getMethods()).stream().filter(m -> m.getParameterCount() == 0 && MinionConfig.class.isAssignableFrom(m.getReturnType())).collect(toOptional()).orElse(null);

            checkNotNull(statusMethod, "missing status method");
            statusSupplier = () -> checkNotNull(executeMethod(innerBean, statusMethod));

            String configNamespace = null;
            if (isNotBlank(annotation.config())) {
                configNamespace = annotation.config();
            } else if (!equal(Void.class, annotation.configBean())) {
                configNamespace = configService.getConfigNamespaceFromConfigBeanClass(annotation.configBean());
            }
            checkNotBlank(configNamespace, "missing namespace config");
            config = configService.getConfig(configNamespace);

            set(configNamespace).with(annotation.watchForConfigs()).forEach(cn -> {
                configService.getConfig(cn).getEventBus().register(new Object() {
                    @Subscribe
                    public void handleAfterConfigReloadEvent(AfterConfigReloadEvent event) {
                        refreshStatus();
                    }
                });
            });
            canStop = annotation.canStartStop();
            experimental = annotation.experimental();
            if (configMethod != null) {
                enabled = () -> {
                    MinionConfig mc = (MinionConfig) checkNotNull(executeMethod(innerBean, configMethod));
                    switch (mc) {
                        case MC_ENABLED:
                            return true;
                        case MC_DISABLED:
                            return false;
                        default:
                            throw new UnsupportedOperationException("unsupported minion config value = " + mc);

                    }
                };
            } else {
                enabled = () -> toBooleanOrDefault(config.getStringOrDefault(SERVICE_ENABLED), true);
            }
        }

        @Override
        public String toString() {
            return "MinionImpl{" + "name=" + name + '}';
        }

        public void refreshStatus() {
            status = statusSupplier.get();
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public MinionStatus getStatus() {
            return checkNotNull(status, "service status not available");
        }

        @Override
        public void startService() {
            logger.info("start {}", getName());
            checkArgument(canStop, "manual start/stop not supported for this service");
            if (!equal(getStatus(), MS_DISABLED)) {
                config.set(SERVICE_ENABLED, FALSE);
                waitSafeUntil(() -> equal(getStatus(), MS_DISABLED), 5);
            }
            config.set(SERVICE_ENABLED, TRUE);
        }

        @Override
        public void stopService() {
            logger.info("stop {}", getName());
            checkArgument(canStop, "manual start/stop not supported for this service");
            config.set(SERVICE_ENABLED, FALSE);
        }

        @Override
        public boolean isEnabled() {
            return enabled.get();
        }

        @Override
        public boolean isExperimental() {
            return experimental;
        }

        @Override
        public boolean canStart() {
            return canStop && set(MS_ERROR, MS_NOTRUNNING, MS_DISABLED).contains(getStatus());
        }

        @Override
        public boolean canStop() {
            return canStop && set(MS_READY, MS_ERROR).contains(getStatus());
        }

    }
}
