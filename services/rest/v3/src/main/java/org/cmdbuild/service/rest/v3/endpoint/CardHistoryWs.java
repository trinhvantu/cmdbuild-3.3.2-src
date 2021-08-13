package org.cmdbuild.service.rest.v3.endpoint;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import org.cmdbuild.common.utils.PagedElements;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_BEGINDATE;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import static org.cmdbuild.data.filter.SorterElementDirection.DESC;

import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.CARD_ID;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.CLASS_ID;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.LIMIT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.START;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.cmdbuild.dao.beans.Card;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_STATUS;
import org.cmdbuild.dao.postgres.services.CardHistoryService;
import static org.cmdbuild.data.filter.SorterElementDirection.ASC;
import org.cmdbuild.service.rest.common.serializationhelpers.CardWsSerializationHelperv3;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;

@Path("{a:processes|classes}/{" + CLASS_ID + "}/{b:cards|instances}/{" + CARD_ID + "}/history")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
public class CardHistoryWs {

    private final CardHistoryService service;
    private final CardWsSerializationHelperv3 helper;

    public CardHistoryWs(CardHistoryService service, CardWsSerializationHelperv3 helper) {
        this.service = checkNotNull(service);
        this.helper = checkNotNull(helper);
    }

    @GET
    @Path("")
    public Object getHistory(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long cardId, @QueryParam(LIMIT) Integer limit, @QueryParam(START) Integer offset) {
        DaoQueryOptionsImpl query = DaoQueryOptionsImpl.builder()
                .withPaging(offset, limit)
                .orderBy(ATTR_BEGINDATE, DESC)
                .orderBy(ATTR_STATUS, ASC)//note: improve to order first status A and then status U
                .orderBy(ATTR_ID, DESC)//note: this relies on sequential ids
                .build();
        PagedElements<Card> history = service.getHistory(classId, cardId, query);
        return response(history.stream().map(CardHistoryWs::serializeBasicHistory), history.totalSize());
    }

    @GET
    @Path("{recordId}")
    public Object getHistoryRecord(@PathParam(CLASS_ID) String classId, @PathParam(CARD_ID) Long id, @PathParam("recordId") Long recordId) {
        Card record = service.getHistoryRecord(classId, recordId);
        checkArgument(equal(record.getCurrentId(), id));
        return response(helper.serializeCard(record).with(
                "_endDate", toIsoDateTime(record.getEndDate()),
                "_status", record.getCardStatus().name()));
    }

    public static FluentMap<String, Object> serializeBasicHistory(Card record) {
        return map(
                "_type", record.getType().getName(),
                "_id", record.getId(),
                "_endDate", toIsoDateTime(record.getEndDate()),
                "_beginDate", toIsoDateTime(record.getBeginDate()),
                "_user", record.getUser(),
                "_status", record.getCardStatus().name());
    }
}
