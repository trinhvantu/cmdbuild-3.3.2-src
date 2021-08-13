/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.service.rest.v3.endpoint;

import org.cmdbuild.service.rest.v3.model.WsEventData;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import java.util.function.Consumer;
import javax.activation.DataHandler;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.APPLICATION_OCTET_STREAM;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import org.cmdbuild.auth.user.OperationUserSupplier;
import org.cmdbuild.calendar.CalendarService;
import org.cmdbuild.calendar.beans.CalendarEvent;
import static org.cmdbuild.calendar.beans.CalendarEvent.EVENT_TABLE;
import static org.cmdbuild.calendar.data.CalendarEventRepositoryImpl.addCalendarEventUserFilter;
import org.cmdbuild.common.utils.PagedElements;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import static org.cmdbuild.config.api.ConfigValue.TRUE;
import org.cmdbuild.dao.beans.Card;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_BEGINDATE;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.orm.CardMapperService;
import org.cmdbuild.dao.postgres.services.CardHistoryService;
import static org.cmdbuild.data.filter.SorterElementDirection.DESC;
import static org.cmdbuild.dms.DmsService.DMS_MODEL_PARENT_CLASS;
import static org.cmdbuild.dms.DmsService.DOCUMENT_ATTR_CARD;
import static org.cmdbuild.email.Email.EMAIL_ATTR_CARD;
import static org.cmdbuild.email.Email.EMAIL_CLASS_NAME;
import org.cmdbuild.report.SysReportService;
import static org.cmdbuild.report.utils.ReportExtUtils.reportExtFromString;
import org.cmdbuild.service.rest.common.beans.WsQueryOptions;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.DETAILED;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.FILTER;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.LIMIT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.POSITION_OF;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.POSITION_OF_GOTOPAGE;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.SORT;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.START;
import static org.cmdbuild.service.rest.v3.endpoint.CardHistoryWs.serializeBasicHistory;
import static org.cmdbuild.service.rest.v3.endpoint.ProcessTaskWs.handlePositionOfAndGetMeta;
import org.cmdbuild.service.rest.common.serializationhelpers.CalendarWsSerializationHelper;
import static org.cmdbuild.service.rest.common.serializationhelpers.CalendarWsSerializationHelper.CAL_ATTR_MAPPING;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.EXTENSION;
import static org.cmdbuild.service.rest.v3.endpoint.ClassPrintWs.buildQueryOptions;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;

@Path("calendar/events/")
@Produces(APPLICATION_JSON)
public class CalendarEventWs {

    private final CalendarService service;
    private final CalendarWsSerializationHelper helper;
    private final CardHistoryService historyService;
    private final CardMapperService mapper;
    private final OperationUserSupplier operationUser;
    private final DaoService dao;
    private final SysReportService reportService;

    public CalendarEventWs(CalendarService service, CalendarWsSerializationHelper helper, CardHistoryService historyService, CardMapperService mapper, OperationUserSupplier operationUser, DaoService dao, SysReportService reportService) {
        this.service = checkNotNull(service);
        this.helper = checkNotNull(helper);
        this.historyService = checkNotNull(historyService);
        this.mapper = checkNotNull(mapper);
        this.operationUser = checkNotNull(operationUser);
        this.dao = checkNotNull(dao);
        this.reportService = checkNotNull(reportService);
    }

    @GET
    @Path("{eventId}")
    public Object readOne(@PathParam("eventId") Long eventId, @QueryParam("includeStats") @DefaultValue(FALSE) Boolean includeStats) {
        CalendarEvent event = service.getUserEvent(eventId);
        return response(helper.serializeDetailedEvent(event).accept(m -> {
            if (includeStats) {
                m.put("_attachment_count", dao.selectCount().from(DMS_MODEL_PARENT_CLASS).where(DOCUMENT_ATTR_CARD, EQ, event.getId()).getCount(), //TODO: duplicate code, improve this
                        "_email_count", dao.selectCount().from(EMAIL_CLASS_NAME).where(EMAIL_ATTR_CARD, EQ, event.getId()).getCount());
            }
        }));
    }

    @GET
    @Path(EMPTY)
    public Object readMany(
            @QueryParam(FILTER) String filterStr,
            @QueryParam(SORT) String sort,
            @QueryParam(LIMIT) Long limit,
            @QueryParam(START) Long offset,
            @QueryParam(DETAILED) @DefaultValue(FALSE) Boolean detailed,
            @QueryParam(POSITION_OF) Long positionOf,
            @QueryParam(POSITION_OF_GOTOPAGE) @DefaultValue(TRUE) Boolean goToPage) {//TODO improve this, auto processing of params in dao query options
        DaoQueryOptions queryOptions = DaoQueryOptionsImpl.builder().withFilter(filterStr).withSorter(sort).withPositionOf(positionOf, goToPage).withPaging(offset, limit).build().mapAttrNames(CAL_ATTR_MAPPING);
        PagedElements<CalendarEvent> events = service.getUserEvents(queryOptions);
        return response(events.map(detailed ? helper::serializeDetailedEvent : CalendarWsSerializationHelper::serializeBasicEvent), handlePositionOfAndGetMeta(queryOptions, events));
    }

    @POST
    @Path("")
    public Object createUserEvent(WsEventData data) {
        CalendarEvent event = data.buildEvent().accept((Consumer) service.fixTimeZone()).withOwner(operationUser.getUsername()).build();
        checkArgument(!event.hasSequence(), "cannot create standalone sequence event");
        event = service.createUserEvent(event);//TODO access control, etc
        return response(helper.serializeDetailedEvent(event));
    }

    @PUT
    @Path("{eventId}")
    public Object update(@PathParam("eventId") Long eventId, WsEventData data) {
        CalendarEvent event = service.updateEvent(data.buildEvent().accept((Consumer) service.fixTimeZone()).withId(eventId).build());//TODO access control, etc
        return response(helper.serializeDetailedEvent(event));
    }

    @DELETE
    @Path("{eventId}/")
    public Object delete(@PathParam("eventId") Long eventId) {
        service.deleteEvent(eventId);
        return success();
    }

    @GET
    @Path("{eventId}/history")
    public Object readHistory(@PathParam("eventId") Long eventId, @QueryParam(LIMIT) Long limit, @QueryParam(START) Long offset, @QueryParam("detailed") @DefaultValue(FALSE) boolean detailed) {
        //TODO access control (!) 
        DaoQueryOptionsImpl query = DaoQueryOptionsImpl.builder()
                .withPaging(offset, limit)
                .orderBy(ATTR_BEGINDATE, DESC)
                .build();
        PagedElements<Card> history = historyService.getHistory(CalendarEvent.EVENT_TABLE, eventId, query);
        return response(history.stream().map(c -> serializeBasicHistory(c).withoutKey("_type")), history.totalSize());
    }

    @GET
    @Path("{eventId}/history/{recordId}")
    public Object getHistoryRecord(@PathParam("eventId") Long eventId, @PathParam("recordId") Long recordId) {
        Card record = historyService.getHistoryRecord(CalendarEvent.EVENT_TABLE, recordId);
        checkArgument(equal(record.getCurrentId(), eventId));//TODO improve this; access control
        return response(helper.serializeDetailedEvent(mapper.cardToObject(record)).with(
                "_endDate", toIsoDateTime(record.getEndDate()),//TODO duplicate code from history ws, improve this
                "_status", record.getCardStatus().name()));
    }

    @GET
    @Path("/print/{file}")
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler printCalendarEventReport(WsQueryOptions wsQueryOptions, @QueryParam(EXTENSION) String extension, @QueryParam("attributes") String attributes) {
        Classe classe = dao.getClasse(EVENT_TABLE);
        DaoQueryOptions queryOptions = buildQueryOptions(classe, wsQueryOptions, attributes).mapAttrNames(CAL_ATTR_MAPPING);
        return reportService.executeUserClassReport(classe, reportExtFromString(extension), queryOptions, () -> dao.selectAll().from(classe).withOptions(queryOptions).accept(addCalendarEventUserFilter(operationUser.getUser())).getCards().stream());
    }

}
