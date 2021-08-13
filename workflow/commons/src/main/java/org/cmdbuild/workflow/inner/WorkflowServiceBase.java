package org.cmdbuild.workflow.inner;

import static com.google.common.base.Objects.equal;
import java.util.Collection;
import org.cmdbuild.workflow.model.Task;
import java.util.List;
import java.util.Map;
import javax.activation.DataSource;
import javax.annotation.Nullable;
import org.cmdbuild.common.utils.PagedElements;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.CmdbSorter;
import static org.cmdbuild.utils.io.CmIoUtils.newDataSource;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import org.cmdbuild.workflow.model.XpdlInfo;
import org.cmdbuild.workflow.model.Flow;
import org.cmdbuild.workflow.model.TaskDefinition;

public interface WorkflowServiceBase {

    List<TaskDefinition> getTaskDefinitions(String processId);

    List<XpdlInfo> getXpdlInfosOrderByVersionDesc(String classId);

    XpdlInfo addXpdl(String classId, DataSource dataSource);

    XpdlInfo addXpdlReplaceCurrent(String classId, DataSource dataSource);

    List<Task> getTaskListForCurrentUserByClassIdAndCardId(String classId, Long cardId); //TODO move this to facade?

    PagedElements<Task> getTaskListForCurrentUserByClassIdSkipFlowData(String classId, DaoQueryOptions queryOptions); //TODO move this to facade?

    Task getTask(Flow flowCard, String taskId);

    Collection<Task> getTaskList(Flow flowCard);

    void abortProcessInstance(Flow flowCard);

    void suspendProcessInstance(Flow flowCard);

    void resumeProcessInstance(Flow flowCard);

    default TaskDefinition getTaskDefinition(String processId, String taskId) {
        return getTaskDefinitions(processId).stream().filter(t -> equal(t.getId(), taskId)).collect(onlyElement("task def not found for processId =< %s > and taskId =< %s >", processId, taskId));
    }

    default Collection<Task> getTaskListLean(Flow flowCard) {
        return getTaskList(flowCard);
    }

    default Map<String, Object> getWidgetData(Collection<Task> taskList, Flow flowCard) {
        throw new UnsupportedOperationException();
    }

    default Map<String, Object> getAllFlowData(String classId, long cardId) {
        throw new UnsupportedOperationException();
    }

    default Task getTaskByDefinitionId(Flow card, String taskDefinitionId) {
        return getTaskList(card).stream().filter(t -> equal(t.getDefinition().getId(), taskDefinitionId)).collect(onlyElement("task not found for flow = %s definition id =< %s >", card, taskDefinitionId));
    }

    default XpdlInfo addXpdl(String classId, String xpdlData) {
        return addXpdl(classId, newDataSource(xpdlData, "text/xml"));
    }

    default XpdlInfo addXpdl(Classe process, String xpdlData) {
        return addXpdl(process.getName(), xpdlData);
    }

    default XpdlInfo addXpdlReplaceCurrent(String classId, String xpdlData) {
        return addXpdlReplaceCurrent(classId, newDataSource(xpdlData, "text/xml"));
    }

    default PagedElements<Task> getTaskListForCurrentUserByClassId(String classId, @Nullable Long offset, @Nullable Long limit, CmdbSorter sort, CmdbFilter filter, @Nullable Long positionOfCard, @Nullable Boolean goToPage) {
        return getTaskListForCurrentUserByClassIdSkipFlowData(classId, DaoQueryOptionsImpl.builder()
                .withOffset(offset)
                .withLimit(limit)
                .withSorter(sort)
                .withFilter(filter)
                .withPositionOf(positionOfCard, goToPage)
                .build());
    }

    /**
     * Synchronizes the local store with the workflow service.
     *
     * legacy stuff, used only by shark
     */
    default void sync() {
    }
}
