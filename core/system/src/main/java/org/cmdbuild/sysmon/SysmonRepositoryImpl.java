/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.sysmon;

import static com.google.common.base.Preconditions.checkNotNull;
import java.time.ZonedDateTime;
import java.util.List;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_BEGINDATE;
import org.springframework.stereotype.Component;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.WhereOperator.GT;

@Component
public class SysmonRepositoryImpl implements SysmonRepository {

    private final DaoService dao;

    public SysmonRepositoryImpl(DaoService dao) {
        this.dao = checkNotNull(dao);
    }

    @Override
    public void store(SystemStatusLog systemStatusRecord) {
        dao.createOnly(systemStatusRecord);
    }

    @Override
    public List<SystemStatusLog> getRecordsSince(ZonedDateTime since) {
        return dao.selectAll().from(SystemStatusLog.class).where(ATTR_BEGINDATE, GT, since).orderBy(ATTR_BEGINDATE).asList();
    }

}
