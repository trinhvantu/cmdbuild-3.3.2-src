package org.cmdbuild.service.rest.v3.endpoint;

import com.fasterxml.jackson.annotation.JsonCreator;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Strings.emptyToNull;
import static java.util.Collections.emptyMap;

import java.util.Map;

import org.cmdbuild.common.utils.PagedElements;

import java.util.List;
import static java.util.stream.Collectors.toList;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import javax.ws.rs.Consumes;
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
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import org.cmdbuild.cardfilter.CardFilterService;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import static org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl.emptyOptions;
import org.cmdbuild.workflow.WorkflowService;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

import org.cmdbuild.workflow.model.Task;
import org.cmdbuild.workflow.FlowAdvanceResponse;
import org.cmdbuild.service.rest.v3.serializationhelpers.FlowWsSerializationHelper;
import static org.cmdbuild.dao.utils.AttributeConversionUtils.rawToSystem;
import static org.cmdbuild.dms.DmsService.DMS_MODEL_PARENT_CLASS;
import static org.cmdbuild.dms.DmsService.DOCUMENT_ATTR_CARD;
import static org.cmdbuild.email.Email.EMAIL_ATTR_CARD;
import static org.cmdbuild.email.Email.EMAIL_CLASS_NAME;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.PROCESS_ID;
import static org.cmdbuild.service.rest.common.utils.WsSerializationAttrs.PROCESS_INSTANCE_ID;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.response;
import static org.cmdbuild.service.rest.common.utils.WsResponseUtils.success;
import org.cmdbuild.service.rest.common.beans.WsQueryOptions;
import static org.cmdbuild.service.rest.v3.endpoint.ProcessTaskWs.handlePositionOfAndGetMeta;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import org.cmdbuild.utils.lang.CmMapUtils;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.cmdbuild.workflow.model.Flow;
import org.cmdbuild.workflow.model.Process;
import org.cmdbuild.workflow.WorkflowGraphService;

@Path("{a:processes}/{" + PROCESS_ID + "}/{b:instances}/")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
public class ProcessInstancesWs {

    private final WorkflowGraphService graphService;
    private final DaoService dao;
    private final WorkflowService workflowService;
    private final FlowWsSerializationHelper converterService;
    private final CardFilterService filterService;

    public ProcessInstancesWs(
            WorkflowGraphService graphService,
            WorkflowService workflowService,
            FlowWsSerializationHelper converterService,
            CardFilterService filterService,
            DaoService dao) {
        this.graphService = checkNotNull(graphService);
        this.workflowService = checkNotNull(workflowService);
        this.converterService = checkNotNull(converterService);
        this.filterService = checkNotNull(filterService);
        this.dao = checkNotNull(dao);
    }

    @POST
    @Path(EMPTY)
    public Object create(@PathParam(PROCESS_ID) String processId, WsFlowData processInstance) {
        Process processClass = workflowService.getProcess(processId);
        FlowAdvanceResponse response = workflowService.startProcess(
                processId,
                convertInputValuesForFlow(processClass, processInstance),
                //				adaptWidgets(processInstance.getWidgets()),
                processInstance.isAdvance());
        return response(toData(response));
    }

    @PUT
    @Path("{" + PROCESS_INSTANCE_ID + "}")
    public Object update(@PathParam(PROCESS_ID) String planClassId, @PathParam(PROCESS_INSTANCE_ID) Long flowCardId, WsFlowData processInstance) {
        Flow flowCard = workflowService.getFlowCard(planClassId, flowCardId);
        Task task = workflowService.getTask(flowCard, checkNotBlank(processInstance.getActivity(), "must set 'activity' param"));

        Map<String, Object> map = convertInputValuesForFlow(flowCard.getType(), processInstance);
        map = convertTaskValues(task, map);

        FlowAdvanceResponse response = workflowService.updateProcess(planClassId, flowCardId, task.getId(), map, processInstance.isAdvance());

        return response(toData(response));
    }

    @GET
    @Path("{" + PROCESS_INSTANCE_ID + "}")
    public Object read(
            @PathParam(PROCESS_ID) String planClasseId,
            @PathParam(PROCESS_INSTANCE_ID) Long flowCardId,
            @QueryParam("includeModel") @DefaultValue(FALSE) Boolean includeModel,
            @QueryParam("include_tasklist") @DefaultValue(FALSE) Boolean includeTasklist,
            @QueryParam("includeStats") @DefaultValue(FALSE) Boolean includeStats) {
        Flow card = workflowService.getUserFlowCard(planClasseId, flowCardId);
        CmMapUtils.FluentMap<String, Object> map = converterService.serializeFlow(card, includeTasklist, true, includeModel, emptyOptions());
        if (includeStats) {
            map.put("_attachment_count", dao.selectCount().from(DMS_MODEL_PARENT_CLASS).where(DOCUMENT_ATTR_CARD, EQ, flowCardId).getCount(),
                    "_email_count", dao.selectCount().from(EMAIL_CLASS_NAME).where(EMAIL_ATTR_CARD, EQ, flowCardId).getCount());
        }
        return response(map);
    }

    @GET
    @Path("{" + PROCESS_INSTANCE_ID + "}/graph/")
    @Produces(APPLICATION_OCTET_STREAM)
    public DataHandler plotGraph(@PathParam(PROCESS_ID) String processId, @PathParam(PROCESS_INSTANCE_ID) Long cardId, @QueryParam("simplified") @DefaultValue(FALSE) Boolean simplified) {
        Flow card = workflowService.getFlowCard(processId, cardId);
        DataSource graph;
        if (simplified) {
            graph = graphService.getSimplifiedGraphImageForFlow(card);
        } else {
            graph = graphService.getGraphImageForFlow(card);
        }
        return new DataHandler(graph);
    }

    @GET
    @Path(EMPTY)
    public Object readMany(@PathParam(PROCESS_ID) String processId, WsQueryOptions wsQueryOptions, @QueryParam("include_tasklist") @DefaultValue(FALSE) Boolean includeTasklist) {
        Process found = workflowService.getProcess(processId);

//        CmdbFilter filter = CmdbFilterUtils.parseFilter(getFilterOrNull(filterStr));//TODO map filter attribute names
//        CmdbSorter sorter = CmdbSorterUtils.parseSorter(sorterStr);
        // TODO do it better
//		// <<<<<
//		String regex = "\"attribute\"[\\s]*:[\\s]*\"" + UNDERSCORED_STATUS + "\"";
//		String replacement = "\"attribute\":\"" + ATTR_FLOW_STATUS + "\"";
//		String _filter = defaultString(getFilter(filter)).replaceAll(regex, replacement);
//		// <<<<<
//		Iterable<String> attributes = activeAttributes(found);
//		Iterable<String> _attributes = concat(attributes, asList(ATTR_FLOW_STATUS));
//        DaoQueryOptions queryOptions = DaoQueryOptionsImpl.builder()
//                //				.onlyAttributes(_attributes)
//                .withFilter(filter)
//                .withSorter(sorter)
//                .withPaging(offset, limit)
//                .withPositionOf(positionOfCard, goToPage)
//                .build();
//.filterKeys(k -> !queryOptions.hasAttrs() || queryOptions.getAttrs().contains(card.getType().getAliasToAttributeMap().getOrDefault(k, (String) k)))
        PagedElements< Flow> elements = workflowService.getUserFlowCardsByClasseIdAndQueryOptions(found.getName(), wsQueryOptions.getQuery());

        return response(elements.stream().map(f -> converterService.serializeFlow(f, includeTasklist, false, false, wsQueryOptions.getQuery())).collect(toList()), elements.totalSize(), handlePositionOfAndGetMeta(wsQueryOptions.getQuery(), elements));
    }

    @DELETE
    @Path("{" + PROCESS_INSTANCE_ID + "}") //TODO add permission control; use 'user can stop' wf option'
    public void delete(@PathParam(PROCESS_ID) String processId, @PathParam(PROCESS_INSTANCE_ID) Long instanceId) {
        workflowService.abortProcessFromUser(processId, instanceId);
    }

    @POST
    @Path("{" + PROCESS_INSTANCE_ID + "}/suspend")
    public void suspend(@PathParam(PROCESS_ID) String processId, @PathParam(PROCESS_INSTANCE_ID) Long instanceId) {
        workflowService.suspendProcessFromUser(processId, instanceId);
    }

    @POST
    @Path("{" + PROCESS_INSTANCE_ID + "}/resume")
    public void resume(@PathParam(PROCESS_ID) String processId, @PathParam(PROCESS_INSTANCE_ID) Long instanceId) {
        workflowService.resumeProcessFromUser(processId, instanceId);
    }

    @DELETE
    @Path("")
    public Object deleteMany(@PathParam(PROCESS_ID) String processId, WsQueryOptions wsQueryOptions) {
        // TODO access control (can_bulk), bulk query
        workflowService.getUserFlowCardsByClasseIdAndQueryOptions(processId, wsQueryOptions.getQuery()).forEach(c -> workflowService.abortProcessFromUser(c.getClassName(), c.getId()));
        return success();
    }

    private Object toData(FlowAdvanceResponse response) {
        List tasklist = response.getTasklist().stream().map((task) -> converterService.serializeDetailedTask(task)).collect(toList());
        return converterService.serializeFlow(response.getFlowCard()).with("_flowStatus", response.getAdvancedFlowStatus().name(), "_flowId", response.getFlowId(), "_tasklist", tasklist);
    }

    private Map<String, Object> convertInputValuesForFlow(Process userProcessClass, WsFlowData processInstanceAdvanceable) {
        return convertValues(userProcessClass, firstNonNull(processInstanceAdvanceable.getValues(), emptyMap()));
    }

    private Map<String, Object> convertValues(Process planClasse, Map<String, Object> values) {
        Map<String, Object> map = map();
        values.forEach((key, value) -> {
            if (planClasse.hasAttribute(key)) {
                value = rawToSystem(planClasse.getAttribute(key).getType(), value);
            }
            map.put(key, value);
        });
        return map;
    }

    private Map<String, Object> convertTaskValues(Task task, Map<String, Object> values) {
        Map<String, Object> map = map(values);
        task.getWidgets().forEach((w) -> {
            if (w.hasOutputKey() && w.hasOutputType()) {
                Object rawValue = values.get(w.getOutputKey());
                Object value = rawToSystem(w.getOutputType(), rawValue);
                map.put(w.getOutputKey(), value);
            }
        });
        return map;
    }

    @Nullable
    private String getFilterOrNull(@Nullable String filter) {
        return CardWs.getFilterOrNull(filter, (id) -> filterService.getById(id).getConfiguration());
    }

    public static class WsFlowData {

        private final Map<String, Object> values;
        private final boolean advance;
        private final String taskId;

        @JsonCreator
        public WsFlowData(Map<String, Object> values) {
            this.values = map(checkNotNull(values)).immutable();
            advance = toBooleanOrDefault(values.get("_advance"), false);
            taskId = emptyToNull(toStringOrNull(values.get("_activity")));
        }

        public Map<String, Object> getValues() {
            return values;
        }

        public boolean isAdvance() {
            return advance;

        }

        @Nullable
        public String getActivity() {
            return taskId;
        }

    }

}
