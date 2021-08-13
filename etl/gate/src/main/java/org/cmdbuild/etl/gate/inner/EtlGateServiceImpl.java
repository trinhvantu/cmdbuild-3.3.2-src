/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.joining;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import org.cmdbuild.audit.ErrorMessageData;
import org.cmdbuild.etl.EtlException;
import org.cmdbuild.etl.gate.EtlGateService;
import static org.cmdbuild.etl.gate.inner.EtlJobUtils.toJobData;
import org.cmdbuild.fault.FaultEventCollectorService;
import org.cmdbuild.jobs.JobData;
import static org.cmdbuild.jobs.JobData.JOB_CONFIG_MODE;
import org.cmdbuild.jobs.JobService;
import static org.cmdbuild.requestcontext.RequestContext.REQUEST_ID;
import org.cmdbuild.requestcontext.RequestContextService;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.io.CmIoUtils.toByteArray;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.jobs.JobMode.JM_REALTIME;
import static org.cmdbuild.jobs.JobMode.JM_BATCH;
import org.cmdbuild.jobs.JobRun;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;

@Component
public class EtlGateServiceImpl implements EtlGateService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EtlDataRepository dataRepository;
    private final EtlGateRepository gateRepository;
    private final RequestContextService requestContextService;
    private final JobService jobService;
    private final FaultEventCollectorService faultService;

    public EtlGateServiceImpl(EtlDataRepository dataRepository, EtlGateRepository gateRepository, RequestContextService requestContextService, JobService jobService, FaultEventCollectorService faultService) {
        this.dataRepository = checkNotNull(dataRepository);
        this.gateRepository = checkNotNull(gateRepository);
        this.requestContextService = checkNotNull(requestContextService);
        this.jobService = checkNotNull(jobService);
        this.faultService = checkNotNull(faultService);
    }

    @Override
    @Nullable
    public DataSource receive(String gateCode, DataSource payload, Map<String, String> meta) {
        return receive(gateRepository.getByCode(gateCode), payload, meta);
    }

    @Override
    @Nullable
    public DataSource receive(EtlGate gate, DataSource payload, Map<String, String> meta) {
        logger.debug("receiving data for gate =< {} > data = {}", gate, payload);
        meta = map(gate.getConfig()).with(meta).with(
                "source", "gateService",
                "contextId", requestContextService.getRequestContextId(),
                "requestId", requestContextService.get(REQUEST_ID)
        );
        long dataId = dataRepository.create(EtlDataImpl.builder()
                .withGate(gate.getCode())
                .withData(toByteArray(payload))
                .withContentType(payload.getContentType())
                .withMeta(meta).build());
        logger.debug("stored data = {}", dataId);

        EtlJob job = EtlJobImpl.builder()
                .withDataId(dataId)
                .withGate(gate.getCode())
                .withMeta(meta)
                .withTimestamp(now())
                .build();

        switch (gate.getProcessingMode()) {
            case PM_BATCH:
                job = EtlJobImpl.copyOf(job).withMeta(JOB_CONFIG_MODE, serializeEnum(JM_BATCH)).build();
                break;
            case PM_REALTIME:
                job = EtlJobImpl.copyOf(job).withMeta(JOB_CONFIG_MODE, serializeEnum(JM_REALTIME)).build();
                break;
            case PM_NOOP:
                job = EtlJobImpl.copyOf(job).withEnabled(false).build();
                break;
            default:
                throw new IllegalArgumentException("unsupported gate processing mode = " + gate.getProcessingMode());
        }

        JobData runnableJob = jobService.createJob(toJobData(job));

        if (runnableJob.hasMode(JM_REALTIME)) {
            JobRun jobRun = jobService.getOnlyJobRun(runnableJob.getCode());
            jobRun.getErrorOrWarningEvents().stream().map(ErrorMessageData::toFaultEvent).forEach(faultService.getCurrentRequestEventCollector()::addEvent);
            if (jobRun.isFailed()) {
                throw new EtlException("etl job failed: ", jobRun.getErrorOrWarningEvents().stream().filter(ErrorMessageData::isError).map(ErrorMessageData::getMessage).collect(joining(", ")));
            }
            if (jobRun.hasOutput()) {
                return newDataSource(jobRun.getOutput());//TODO more structured output, big data from _EtlData
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    @Override
    public EtlGate create(EtlGate gate) {
        return gateRepository.create(gate);
    }

    @Override
    public EtlGate update(EtlGate gate) {
        return gateRepository.update(gate);
    }

    @Override
    public void delete(long gateId) {
        gateRepository.delete(gateId);
    }

    @Override
    public List<EtlGate> getAll() {
        return gateRepository.getAll();
    }

    @Override
    public EtlGate getByCodeOrId(String gateId) {
        return gateRepository.getByCodeOrId(gateId);
    }

    @Override
    public EtlGate getById(long gateId) {
        return gateRepository.getById(gateId);
    }

    @Override
    public EtlGate getByCodeOrNull(String gate) {
        return gateRepository.getByCodeOrNull(gate);
    }

}
