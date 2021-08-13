/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.services;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import javax.annotation.Nullable;
import org.cmdbuild.cleanup.RecordCleanupHelperService;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.orm.CardMapperService;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class RecordCleanupHelperServiceImpl implements RecordCleanupHelperService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DaoService dao;
    private final CardMapperService mapper;

    public RecordCleanupHelperServiceImpl(DaoService dao, CardMapperService mapper) {
        this.dao = checkNotNull(dao);
        this.mapper = checkNotNull(mapper);
    }

    @Override
    public void cleanupRecords(Class model, @Nullable Integer maxRecordsToKeep, @Nullable Long maxRecordAgeToKeep, @Nullable Object queryOptions) {
        Classe classe = mapper.getClasseForModelOrBuilder(model);
        if (isNotNullAndGtZero(maxRecordAgeToKeep)) {
            logger.debug("cleanup {} records older than {} secs", classe.getName(), maxRecordAgeToKeep);
            String query = format("DELETE FROM \"%s\" WHERE \"BeginDate\" < NOW() - interval '%s seconds'", classe.getName(), maxRecordAgeToKeep);
            if (classe.hasHistory()) {
                query += " AND \"Status\" <> 'A'";
            }
            int res = dao.getJdbcTemplate().update(query);
            if (res > 0) {
                logger.info("removed {} {} records that where older than {} secs", res, classe.getName(), maxRecordAgeToKeep);
            } else {
                logger.debug("no {} record removed", classe.getName());
            }
        }
        if (isNotNullAndGtZero(maxRecordsToKeep)) {
            logger.debug("cleanup {} records, keep at most {} records", classe.getName(), maxRecordsToKeep);
            long count = dao.selectCount().from(classe).getCount();
            if (count <= maxRecordsToKeep) {
                logger.debug("current {} record count = {}, skip cleanup", classe.getName(), count);
            } else {
                int res = dao.getJdbcTemplate().update(format("DELETE FROM \"%s\" WHERE \"Id\" IN (SELECT \"Id\" FROM  \"%s\" ORDER BY \"BeginDate\" ASC LIMIT ((SELECT COUNT(*) FROM \"%s\")-%s))",
                        classe.getName(), classe.getName(), classe.getName(), maxRecordsToKeep));
                logger.info("removed {} {} records", res, classe.getName());
            }
        }
    }
}
