/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import static com.google.common.base.Preconditions.checkNotNull;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.scheduler.ScheduledJob;
import org.springframework.stereotype.Component;
import static org.cmdbuild.utils.sked.SkedJobClusterMode.RUN_ON_SINGLE_NODE;

@Component
public class EtlDataRepositoryImpl implements EtlDataRepository {

    private final DaoService dao;

    public EtlDataRepositoryImpl(DaoService dao) {
        this.dao = checkNotNull(dao);
    }

    @ScheduledJob(value = "0 0 04 * * ?", clusterMode = RUN_ON_SINGLE_NODE)// run once per day at 4 am
    public void processedDataCleanup() {
        //TODO make this configurable, actually delete records and history to reclaim space
//        dao.getJdbcTemplate().execute(format("UPDATE \"_EtlData\" SET \"Status\" = 'N' WHERE \"EtlStatus\" = '%s' AND \"Status\" = 'A' AND \"Timestamp\" < now() - interval '1 week'", serializeEnum(EDS_PROCESSED)));
    }

    @Override
    public long create(EtlData data) {
        return dao.createOnly(data);
    }

    @Override
    public EtlData getById(long id) {
        return dao.getById(EtlData.class, id);
    }

}
