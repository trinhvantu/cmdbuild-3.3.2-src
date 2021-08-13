/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.minions;

import org.cmdbuild.services.PreShutdown;
import org.cmdbuild.services.PostStartup;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.eventbus.Subscribe;
import java.lang.reflect.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
import org.cmdbuild.services.SystemStartingServicesEvent;
import org.cmdbuild.services.SystemStoppingServicesEvent;
import org.cmdbuild.system.SystemEventbusService;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;

@Component
public class LifecycleBeanMethodAnnotationHandler implements BeanPostProcessor {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final SystemEventbusService systemEventService;
    private final DelayedPostStartupService delayedPostStartupService;

    public LifecycleBeanMethodAnnotationHandler(SystemEventbusService systemEventService, DelayedPostStartupService delayedPostStartupService) {
        this.systemEventService = checkNotNull(systemEventService);
        this.delayedPostStartupService = checkNotNull(delayedPostStartupService);
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean; // nothing to do
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        ReflectionUtils.doWithMethods(bean.getClass(), (Method method) -> {
            if (method.isAnnotationPresent(PostStartup.class)) {
                PostStartup postStartup = method.getAnnotation(PostStartup.class);
                if (isNotNullAndGtZero(postStartup.delaySeconds())) {
                    logger.debug("register method {}#{} for delayed PostStartup hook", beanName, method.getName());
                    delayedPostStartupService.registerDelayedPostStartupEvent(postStartup.delaySeconds(), () -> {
                        try {
                            method.invoke(bean);
                        } catch (Exception ex) {
                            throw runtime(ex, "error invoking delayed PostStartup method {}.{}", beanName, method.getName());
                        }
                    });
                } else {
                    logger.debug("register method {}#{} for PostStartup hook", beanName, method.getName());
                    systemEventService.getEventBus().register(new Object() {
                        @Subscribe
                        public void handleSystemStartingServicesEvent(SystemStartingServicesEvent event) {
                            logger.info("run PostStartup method {}#{}", beanName, method.getName());
                            try {
                                method.invoke(bean);
                            } catch (Exception ex) {
                                logger.error("error invoking PostStartup method {}.{}", beanName, method.getName(), ex);
                            }
                        }
                    });
                }
            }
            if (method.isAnnotationPresent(PreShutdown.class)) {
                logger.debug("register method {}#{} for PreShutdown hook", beanName, method.getName());
                systemEventService.getEventBus().register(new Object() {
                    @Subscribe
                    public void handleSystemStoppingServicesEvent(SystemStoppingServicesEvent event) {
                        logger.info("run PreShutdown method {}#{}", beanName, method.getName());
                        try {
                            method.invoke(bean);
                        } catch (Exception ex) {
                            logger.error("error invoking PreShutdown method {}.{}", beanName, method.getName(), ex);
                        }
                    }
                });
            }
        });
        return bean;

    }

}
