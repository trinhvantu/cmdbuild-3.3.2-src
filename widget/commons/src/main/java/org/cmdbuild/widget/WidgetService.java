package org.cmdbuild.widget;

import java.util.Collection;
import org.cmdbuild.widget.model.WidgetData;
import org.cmdbuild.widget.model.Widget;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.widget.model.WidgetDbData;

public interface WidgetService {

    List<WidgetData> getAllWidgetsForClass(Classe classe);

    Widget widgetDataToWidget(WidgetData data, Map<String, Object> context);

    void updateWidgetsForClass(Classe classe, List<WidgetData> widgets);

    void deleteForClass(Classe classe);

    List<WidgetDbData> getAllWidgets();

    default List<Widget> widgetDataToWidget(Collection<WidgetData> data, Map<String, Object> context) {
        return data.stream().map((wd) -> widgetDataToWidget(wd, context)).collect(toList());
    }
}
