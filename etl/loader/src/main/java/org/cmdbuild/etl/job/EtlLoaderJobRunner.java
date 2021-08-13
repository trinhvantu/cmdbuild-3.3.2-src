/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.job;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Iterables.getOnlyElement;
import static java.lang.String.format;
import static java.util.Collections.emptyMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import javax.activation.DataSource;
import org.cmdbuild.api.fluent.CmApiService;
import org.cmdbuild.customclassloader.CustomClassloaderService;
import org.cmdbuild.email.EmailService;
import static org.cmdbuild.email.EmailStatus.ES_OUTGOING;
import org.cmdbuild.email.EmailTemplate;
import org.cmdbuild.email.EmailTemplateService;
import org.cmdbuild.email.beans.EmailImpl;
import org.cmdbuild.etl.EtlException;
import org.cmdbuild.etl.gate.EtlGateService;
import org.cmdbuild.etl.gate.inner.EtlData;
import org.cmdbuild.etl.gate.inner.EtlDataRepository;
import org.cmdbuild.etl.gate.inner.EtlGate;
import org.cmdbuild.etl.gate.inner.EtlGateHandler;
import static org.cmdbuild.etl.gate.inner.EtlGateHandlerType.ETLHT_SCRIPT;
import org.cmdbuild.etl.gate.inner.EtlGateImpl;
import org.cmdbuild.etl.gate.inner.EtlJob;
import org.cmdbuild.jobs.JobData;
import org.cmdbuild.jobs.JobRunContext;
import org.cmdbuild.jobs.JobRunner;
import static org.cmdbuild.utils.encode.CmPackUtils.unpackIfPacked;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.io.CmIoUtils.readToString;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmStringUtils.abbreviate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.etl.gate.inner.EtlJobUtils.toEtlJob;
import org.cmdbuild.etl.loader.EtlHandlerContext;
import org.cmdbuild.etl.loader.EtlHandlerContextImpl;
import org.cmdbuild.utils.groovy.GroovyScriptService;
import org.cmdbuild.etl.loader.EtlTemplate;
import org.cmdbuild.etl.loader.EtlProcessingResult;
import org.cmdbuild.etl.loader.EtlTemplateService;
import static org.cmdbuild.etl.utils.EtlResultUtils.serializeEtlProcessingResult;
import static org.cmdbuild.jobs.JobRun.JOB_OUTPUT;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import static org.cmdbuild.utils.lang.CmConvertUtils.isPrimitiveOrWrapper;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import static org.cmdbuild.etl.gate.inner.EtlJobUtils.ETLJOB_TYPE;
import static org.cmdbuild.etl.utils.EtlResultUtils.prepareEmailData;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLongOrNull;
import static org.cmdbuild.utils.lang.CmExecutorUtils.runSafe;
import static org.cmdbuild.utils.lang.CmInlineUtils.unflattenMap;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrLtEqZero;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;

@Component
public class EtlLoaderJobRunner implements JobRunner {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EtlDataRepository dataRepository;
    private final EtlTemplateService importService;
    private final EtlGateService gateService;
    private final GroovyScriptService scriptService;
    private final CmApiService apiService;
    private final EtlLoadHandlerRepository handlerRepository;
    private final CustomClassloaderService customClassloaderService;
    private final EmailTemplateService emailTemplateService;
    private final EmailService emailService;

    public EtlLoaderJobRunner(EtlDataRepository dataRepository, EtlTemplateService importService, EtlGateService gateService, GroovyScriptService scriptService, CmApiService apiService, EtlLoadHandlerRepository handlerRepository, CustomClassloaderService customClassloaderService, EmailTemplateService emailTemplateService, EmailService emailService) {
        this.dataRepository = checkNotNull(dataRepository);
        this.importService = checkNotNull(importService);
        this.gateService = checkNotNull(gateService);
        this.scriptService = checkNotNull(scriptService);
        this.apiService = checkNotNull(apiService);
        this.handlerRepository = checkNotNull(handlerRepository);
        this.customClassloaderService = checkNotNull(customClassloaderService);
        this.emailTemplateService = checkNotNull(emailTemplateService);
        this.emailService = checkNotNull(emailService);
    }

    @Override
    public String getName() {
        return ETLJOB_TYPE;
    }

    @Override
    public void vaildateJob(JobData jobData) {
        toEtlJob(jobData);
    }

    @Override
    public Map<String, String> runJobWithOutput(JobData jobData, JobRunContext jobContext) {
        EtlJob job = toEtlJob(jobData);
        try {
            logger.info("run job = {}", job);
            EtlHandlerContext context = new EtlLoaderHelper(jobContext, job).runJob();
            if (context.hasEtlProcessingResult()) {
                EtlProcessingResult result = context.getEtlProcessingResult();
//                checkArgument(!result.hasErrors(), result.getErrorsDescription()); TODO check this ?? make configurable ??
                return map(JOB_OUTPUT, serializeEtlProcessingResult(result));
            } else if (context.hasData()) {
                return map(JOB_OUTPUT, serializeJobOutput(context.getData()));
            } else {
                return emptyMap();
            }
        } catch (Exception ex) {
            throw new EtlException(ex, "error processing etl job = %s", job);
        }
    }

    private static String serializeJobOutput(Object value) {
        if (isPrimitiveOrWrapper(value)) {
            return toStringOrNull(value);
        } else {
            return toJson(value);
        }
    }

    private class EtlLoaderHelper {

        private final JobRunContext jobContext;
        private final EtlJob job;
        private final EtlGate gate;
        private final EtlData data;
        private final List<EtlHandlerHelper> helpers;
        private final EmailTemplate errorTemplate;

        public EtlLoaderHelper(JobRunContext jobContext, EtlJob job) {
            this.jobContext = checkNotNull(jobContext);
            this.job = checkNotNull(job);
            switch (job.getGate()) {
                case "INLINE":
                    gate = EtlGateImpl.builder().withCode("INLINE_" + job.getId()).withConfig(unflattenMap(job.getMeta(), "gateconfig")).build();
                    logger.debug("built inline gate with config =\n\n{}\n", mapToLoggableStringLazy(gate.getConfig()));
                    break;
                default:
                    gate = gateService.getByCode(job.getGate());
            }
            data = job.hasData() ? dataRepository.getById(job.getDataId()) : null;
            helpers = gate.getHandlers().stream().map(h -> new EtlHandlerHelper(h)).collect(toImmutableList());

            Long errorTemplateId = toLongOrNull(gate.getConfig().get("errorTemplate"));
            errorTemplate = isNullOrLtEqZero(errorTemplateId) ? null : emailTemplateService.getOne(errorTemplateId);
        }

        public EtlHandlerContext runJob() {
            try {
                DataSource dataSource = job.hasData() ? newDataSource(data.getData(), data.getContentType()) : null;//TODO improve this, allow stream processing without having all data in memory (!)
                EtlHandlerContext context = new EtlHandlerContextImpl(dataSource, job.hasData() ? data.getMeta() : emptyMap());
                for (EtlHandlerHelper helper : helpers) {
                    logger.debug("execute etl handler = {}", helper.handler);
                    context = helper.handleDataImport(context);
                }
                if (context.hasEtlProcessingResult() && context.getEtlProcessingResult().hasErrors() && errorTemplate != null) {
                    EtlProcessingResult result = context.getEtlProcessingResult();
                    runSafe(() -> emailService.create(emailService.applyTemplate(EmailImpl.builder().withStatus(ES_OUTGOING).build(), errorTemplate, prepareEmailData(jobContext, null, result))));
//                    throw new EtlException("error executing database import job: %s", result.getErrorsDescription()); //TODO check this, improve error management and notification (??)
                }
                return context;
            } catch (Exception ex) {
                if (errorTemplate != null) {
                    runSafe(() -> emailService.create(emailService.applyTemplate(EmailImpl.builder().withStatus(ES_OUTGOING).build(), errorTemplate, prepareEmailData(jobContext, ex, null))));
                }
                throw new EtlException(ex, "error processing etl gate = %s", gate);
            }
        }

        private class EtlHandlerHelper {

            private final EtlGateHandler handler;
            private final Function<EtlHandlerContext, EtlHandlerContext> handlerProcessor;
            private final List<EtlTemplate> templates;

            public EtlHandlerHelper(EtlGateHandler handler) {
                this.handler = checkNotNull(handler);
                logger.debug("processing handler = {} with config = \n\n{}\n", handler, mapToLoggableStringLazy(handler.getConfig()));
                switch (handler.getType()) {
                    case ETLHT_TEMPLATE:
                        handlerProcessor = this::applyTemplates;
                        break;
                    case ETLHT_SCRIPT:
                        handlerProcessor = this::executeScript;
                        break;
                    case ETLHT_GATE:
                        EtlGate nextGate = gateService.getByCodeOrId(handler.getConfig().get("gate"));
                        Map<String, String> configOverride = unflattenMap(handler.getConfig(), "config");
                        logger.debug("found next gate = {} with config override = \n\n{}\n", nextGate, mapToLoggableStringLazy(configOverride));
                        if (!configOverride.isEmpty()) {
                            nextGate = EtlGateImpl.copyOf(nextGate).withConfig(configOverride).build();
                        }
                        handlerProcessor = new EtlNextHandlerProcessor(nextGate)::process;
                        break;
                    default:
                        EtlLoadHandler item = handlerRepository.getHandler(handler.getType());
                        handlerProcessor = (c) -> item.load(new EtlLoaderApiImpl(c));
                }
                templates = handler.getTemplates().stream().map(importService::getTemplateByName).collect(toImmutableList());
            }

            public EtlHandlerContext handleDataImport(EtlHandlerContext context) {
                return handlerProcessor.apply(context);
            }

            private EtlHandlerContext applyTemplates(EtlHandlerContext context) {
                logger.debug("apply etl import template[s]");
                checkArgument(context.hasData(), "cannot apply templates, missing input data");
                checkArgument(templates.size() == 1, "invalid gate config: expected exactly one template but found %s", templates.size());
                return new EtlHandlerContextImpl(importService.importDataWithTemplate(context.getData(), getOnlyElement(templates)), context.getMeta());//TODO handle multi table import (order, relations, etc
            }

            private EtlHandlerContext executeScript(EtlHandlerContext context) {
                logger.debug("execute custom script");
                String script = unpackIfPacked(handler.getScript());
                Map<String, Object> params = map(
                        "gate", new EtlLoaderApiImpl(context),
                        "cmdb", apiService.getCmApi(),
                        "logger", LoggerFactory.getLogger(format("%s.job_%s_%s", getClass().getName(), gate.getCode(), job.getId())),
                        "meta", map(data.getMeta()),
                        "output", null);
                logger.debug("execute gate script = \n\n{}\n", script);
                Map<String, Object> res = scriptService.executeScript(script, customClassloaderService.getCustomClassLoaderOrNull(handler.getConfig().get("classpath")), params);
                Object out = res.get("output");
                logger.debug("gate script output = {}", out);
                Map<String, String> meta = (Map) firstNotNull(res.get("meta"), emptyMap());
                return new EtlHandlerContextImpl(out, meta);
            }

            private DataSource toDataSource(EtlHandlerContext context) {
                if (!context.hasData()) {
                    return newDataSource("", "text/plain");
                } else if (context.getData() instanceof String) {
                    return newDataSource((String) context.getData(), "text/plain");
                } else if (context.getData() instanceof byte[]) {
                    return newDataSource((byte[]) context.getData(), "application/octet-stream");
                } else if (context.getData() instanceof DataSource) {
                    return (DataSource) context.getData();
                } else {
                    throw new IllegalArgumentException(format("invalid context data =< %s >", abbreviate(context.getData())));
                }
            }

            private class EtlNextHandlerProcessor {

                private final EtlGate nextGate;

                public EtlNextHandlerProcessor(EtlGate nextGate) {
                    this.nextGate = checkNotNull(nextGate);
                }

                public EtlHandlerContext process(EtlHandlerContext c) {
                    logger.debug("forward data to next gate = {}", nextGate);
                    gateService.receive(nextGate, toDataSource(c), c.getMeta());
                    return new EtlHandlerContextImpl(null, c.getMeta());//TODO handle etl gate response (if any)
                }

            }

            private class EtlLoaderApiImpl implements EtlLoaderApi {

                private final DataSource data;
                private final EtlHandlerContext context;
                private final Map<String, String> config;

                public EtlLoaderApiImpl(EtlHandlerContext context) {
                    this.context = checkNotNull(context);
                    this.data = toDataSource(context);
                    config = map(gate.getConfig()).with(handler.getConfig());
                    logger.debug("etl loader handler api ready with config, meta = \n\n{}\n\n{}\n", mapToLoggableStringLazy(config), mapToLoggableStringLazy(context.getMeta()));
                }

                @Override
                public String getGateCode() {
                    return gate.getCode();
                }

                @Override
                public String getDataAsString() {
                    return readToString(data);
                }

                @Override
                public DataSource getData() {
                    return data;
                }

                @Override
                public Map<String, String> getConfig() {
                    return config;
                }

                @Override
                public List<EtlTemplate> getTemplates() {
                    return templates;
                }

                @Override
                public Map<String, String> getMeta() {
                    return context.getMeta();
                }

            }
        }

    }

}
