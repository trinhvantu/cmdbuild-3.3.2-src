package org.cmdbuild.workflow.model;

import static com.google.common.base.Objects.equal;
import static com.google.common.collect.MoreCollectors.toOptional;
import static com.google.common.collect.Streams.stream;
import java.util.List;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.widget.model.WidgetData;

public interface TaskDefinition {

    final static String TASKDEF_METADATA_DESCRIPTION_ATTR_NAME = "AdditionalActivityLabel";

    String getId();

    String getDescription();

    String getInstructions();

    List<TaskPerformer> getPerformers();

    TaskPerformer getFirstNonAdminPerformer();

    List<TaskAttribute> getVariables();

    Iterable<TaskMetadata> getMetadata();

    List<WidgetData> getWidgets();

    @Nullable
    default String getMetadata(String key) {
        return stream(getMetadata()).filter(m -> equal(key, m.getName())).map(TaskMetadata::getValue).collect(toOptional()).orElse(null);
    }

    @Nullable
    default String getTaskDescriptionAttrName() {
        return getMetadata(TASKDEF_METADATA_DESCRIPTION_ATTR_NAME);
    }

    default boolean hasTaskDescriptionAttrName() {
        return isNotBlank(getTaskDescriptionAttrName());
    }

}
