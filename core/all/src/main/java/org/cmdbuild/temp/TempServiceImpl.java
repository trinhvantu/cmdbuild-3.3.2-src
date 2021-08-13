/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.temp;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import java.io.IOException;
import java.io.InputStream;
import static java.lang.String.format;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import static org.apache.commons.io.FileUtils.byteCountToDisplaySize;
import org.cmdbuild.dao.beans.CardImpl;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.systemToSqlExpr;
import org.cmdbuild.scheduler.ScheduledJob;
import static org.cmdbuild.temp.TempDataImpl.TEMP_TABLE;
import static org.cmdbuild.temp.TempServiceUtils.cardIdToTempId;
import static org.cmdbuild.temp.TempServiceUtils.tempIdToCardId;
import static org.cmdbuild.utils.date.CmDateUtils.now;
import static org.cmdbuild.utils.hash.CmHashUtils.hash;
import org.cmdbuild.utils.io.BigByteArray;
import org.cmdbuild.utils.io.BigByteArrayInputStream;
import static org.cmdbuild.utils.io.CmIoUtils.getContentType;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import static org.cmdbuild.utils.io.CmIoUtils.toBigByteArray;
import static org.cmdbuild.utils.io.CmIoUtils.toDataSource;
import static org.cmdbuild.utils.json.CmJsonUtils.toJson;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.utils.sked.SkedJobClusterMode.RUN_ON_SINGLE_NODE;

@Component
public class TempServiceImpl implements TempService {

    private final static int MAX_TEMP_PART_SIZE = 10 * 1024 * 1024; //10 MiB

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DaoService dao;

    public TempServiceImpl(DaoService dao) {
        this.dao = checkNotNull(dao);
    }

    @ScheduledJob(value = "0 */10 * * * ?", clusterMode = RUN_ON_SINGLE_NODE, persistRun = false) //run every 10 minutes
    public void removeExpiredRecords() {
        dao.getJdbcTemplate().update(format("DELETE FROM \"_Temp\" WHERE %s > \"BeginDate\" + format('%%s seconds', \"TimeToLive\")::interval", systemToSqlExpr(now())));
    }

    @Override
    public String putTempData(DataHandler data) {
        return putTempData(toBigByteArray(data), TempInfoImpl.builder().withContentType(getContentType(toDataSource(data))).withFileName(data.getName()).build());
    }

    @Override
    public String putTempData(DataSource data) {
        return putTempData(data, null);
    }

    @Override
    public String putTempData(DataSource data, @Nullable TempInfoSource source) {
        return putTempData(toBigByteArray(data), TempInfoImpl.builder().withContentType(getContentType(data)).withFileName(data.getName()).withSource(source).build());
    }

    @Override
    public String putTempData(BigByteArray data) {
        return putTempData(data, TempInfoImpl.builder().withContentType(getContentType(data)).build());
    }

    @Override
    public String putTempData(String data, Map<String, String> info) {
        long id = dao.createOnly(CardImpl.buildCard(dao.getClasse(TEMP_TABLE), "Data", checkNotBlank(data).getBytes(StandardCharsets.UTF_8), "Info", toJson(info)));//TODO improve this
        return cardIdToTempId(id);
    }

    private String putTempData(BigByteArray data, TempInfo info) {
        logger.debug("put temp data ( {} {} )", byteCountToDisplaySize(data.length()), info.getContentType());
        info = TempInfoImpl.copyOf(info).withSize(data.length()).build();
        long id;
        if (data.length() < MAX_TEMP_PART_SIZE) {
            id = dao.createOnly(TempDataImpl.builder().withData(data.toByteArray()).withInfo(info).build());
        } else {
            logger.debug("data is big, split and load multiple parts");
            try {
                InputStream in = new BigByteArrayInputStream(data);
                byte[] buffer = new byte[MAX_TEMP_PART_SIZE];
                int len;
                List<Long> parts = list();
                while ((len = in.read(buffer)) > 0) {
                    byte[] part;
                    if (len < buffer.length) {
                        part = Arrays.copyOf(buffer, len);
                    } else {
                        part = buffer;
                    }
                    logger.debug("load temp part {} ( {}% )", parts.size() + 1, 100l * parts.size() * MAX_TEMP_PART_SIZE / data.length());
                    parts.add(dao.createOnly(TempDataImpl.builder().withData(part).build()));
                }
                logger.debug("aggregate temp parts");
                id = dao.create(TempDataImpl.builder().withCompositionInfo(new CompositionInfoImpl(parts, hash(data), data.length())).withInfo(info).build()).getId();
            } catch (IOException ex) {
                throw runtime(ex);
            }
        }
        logger.debug("stored temp record = {} ( {} )", id, byteCountToDisplaySize(data.length()));
        return cardIdToTempId(id);
    }

    @Override
    public DataHandler getTempData(String key) {
        BigByteArray data = getTempDataBigBytes(key);
        TempInfo info = getTempInfo(key);
        return newDataHandler(data, info.getContentType(), info.getFileName());
    }

    @Override
    public BigByteArray getTempDataBigBytes(String key) {
        long id = tempIdToCardId(key);
        logger.debug("get temp record = {}", id);
        TempData card = dao.getById(TempData.class, id);
        BigByteArray data = new BigByteArray();
        if (card.isComposite()) {
            CompositionInfo compositionInfo = card.getCompositionInfo();
            for (int i = 0; i < compositionInfo.getParts().size(); i++) {
                logger.debug("load temp part {} / {} ( {} {}% )", i + 1, byteCountToDisplaySize(data.length()), compositionInfo.getParts().size(), i * 100 / compositionInfo.getParts().size());
                TempData part = dao.getById(TempData.class, compositionInfo.getParts().get(i));
                data.append(part.getData());
            }
            checkArgument(equal(compositionInfo.getSize(), data.length()), "invalid temp data size: expected = {}, observed = {}", compositionInfo.getSize(), data.length());
            checkArgument(equal(compositionInfo.getHash(), hash(data)), "invalid temp data hash");
        } else {
            data.append(card.getData());
        }
        logger.debug("loaded temp record = {} ( {} )", id, byteCountToDisplaySize(data.length()));
        return data;
    }

    @Override
    public TempInfo getTempInfo(String key) {
        long id = tempIdToCardId(key);
        return dao.getById(TempData.class, id).getInfo();
    }

}
