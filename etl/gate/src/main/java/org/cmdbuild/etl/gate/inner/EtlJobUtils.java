/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import static java.lang.String.format;
import java.util.Map;
import org.cmdbuild.jobs.JobData;
import org.cmdbuild.jobs.beans.JobDataImpl;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLongOrNull;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;

public class EtlJobUtils {

    public final static String ETLJOB_TYPE = "etl",
            ELTJOB_ATTR_GATE = "gate",
            ETLJOB_ATTR_DATA = "etl_data_id",
            ETLJOB_ATTR_TIMESTAMP = "etl_request_timestamp";

    public static JobData toJobData(EtlJob job) {
        return JobDataImpl.builder()
                .withId(job.getId())
                .withCode(format("etl_%s_%s", job.getGate(), firstNotNull(job.getDataId(), "nodata")))
                .withType(ETLJOB_TYPE)
                .withConfig((Map) map(job.getMeta()).with(
                        ELTJOB_ATTR_GATE, job.getGate(),
                        ETLJOB_ATTR_DATA, job.getDataId(),
                        ETLJOB_ATTR_TIMESTAMP, toIsoDateTime(job.getTimestamp())
                ))
                .withEnabled(job.isEnabled())
                .build();
    }

    public static EtlJob toEtlJob(JobData job) {
        return EtlJobImpl.builder()
                .withId(job.getId())
                .withDataId(toLongOrNull(job.getConfig().get(ETLJOB_ATTR_DATA)))
                .withGate(job.getConfigNotBlank(ELTJOB_ATTR_GATE))
                .withTimestamp(toDateTime(job.getConfig().get(ETLJOB_ATTR_TIMESTAMP)))
                .withMeta((Map) map(job.getConfig()).withoutKeys(ETLJOB_ATTR_DATA, ELTJOB_ATTR_GATE, ETLJOB_ATTR_TIMESTAMP))
                .withEnabled(job.isEnabled())
                .build();
    }

}
