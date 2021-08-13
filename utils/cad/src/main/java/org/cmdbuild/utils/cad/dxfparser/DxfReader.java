/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.dxfparser;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.ImmutableList;
import org.cmdbuild.utils.cad.dxfparser.model.DxfValueImpl;
import java.io.InputStreamReader;
import static java.util.Collections.unmodifiableList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Stack;
import java.util.function.Consumer;
import static java.util.function.Function.identity;
import org.cmdbuild.utils.cad.dxfparser.model.DxfArc;
import org.cmdbuild.utils.cad.model.CadPolyline;
import org.cmdbuild.utils.cad.dxfparser.model.DxfDocument;
import org.cmdbuild.utils.cad.dxfparser.model.DxfEntity;
import org.cmdbuild.utils.cad.dxfparser.model.DxfExtendedData;
import org.cmdbuild.utils.cad.dxfparser.model.DxfGenericObject;
import org.cmdbuild.utils.cad.dxfparser.model.DxfObject;
import org.cmdbuild.utils.cad.dxfparser.model.DxfPolilyne;
import org.cmdbuild.utils.cad.dxfparser.model.DxfValue;
import org.cmdbuild.utils.cad.dxfparser.model.DxfVariable;
import org.cmdbuild.utils.cad.dxfparser.model.DxfVariableImpl;
import org.cmdbuild.utils.cad.dxfparser.model.DxfVertex;
import org.cmdbuild.utils.cad.model.CadPoint;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.cmdbuild.utils.cad.model.CadPoint.point;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmMapUtils.MapDuplicateKeyMode.ALLOW_DUPLICATES;
import static org.cmdbuild.utils.lang.CmMapUtils.toMap;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class DxfReader {

    private final static String BLOCK_CODE = "CM_BLOCK_CODE";

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final Stack<Consumer<DxfStreamEvent>> eventHandler = new Stack<>();

    private final List< DxfVariable> headerVariables = list();
    private final List<DxfEntity> entities = list();
    private final List<DxfObject> objects = list();

    private int lineNumber = 0;

    public DxfReader() {
        eventHandler.push(this::handleDefault);
    }

    public DxfDocument readStream(InputStreamReader reader) {
        new DxfStreamProcessor(this::handleEvent).processStream(reader);
        DxfDocument document = new DxfDocumentImpl();
        logger.debug("parsed dxf document, version = {}", document.getAcadVersion());
        return document;
    }

    private void handleEvent(DxfStreamEvent event) {
        lineNumber = event.getLineNumber();
        eventHandler.peek().accept(event);
    }

    private void pushHandler(Consumer<DxfStreamEvent> handler) {
        logger.trace("switch handler after line {}", lineNumber);
        eventHandler.push(handler);
    }

    private void replaceHandler(Consumer<DxfStreamEvent> handler) {
        logger.trace("switch handler after line {}", lineNumber);
        eventHandler.pop();
        eventHandler.push(handler);
    }

    private void popHandler() {
        logger.trace("switch handler after line {}", lineNumber);
        eventHandler.pop();
    }

    private void bubbleHandler(DxfStreamEvent event) {
        logger.trace("switch handler at line {}", lineNumber);
        eventHandler.pop();
        eventHandler.peek().accept(event);
    }

    private void handleDefault(DxfStreamEvent event) {
        switch (event.getGroupCodeDashValue()) {
            case "0-SECTION":
                pushHandler(this::handleSection);
                break;
        }
    }

    private void handleSection(DxfStreamEvent event) {
        switch (event.getGroupCodeDashValue()) {
            case "2-HEADER":
                replaceHandler(new HeaderHandler());
                break;
            case "2-ENTITIES":
                replaceHandler(new EntitiesHandler());
                break;
            case "2-TABLES":
                replaceHandler(new TablesHandler());
                break;
            case "2-OBJECTS":
                replaceHandler(new ObjectsHandler());
                break;
            case "0-ENDSEC":
                popHandler();
                break;
        }
    }

    private DxfValueImpl createValue(DxfStreamEvent event) {
        String value = event.getValue().trim();//TODO check trim
        return new DxfValueImpl(event.getGroupCode(), value);
    }

    private class HeaderHandler implements Consumer<DxfStreamEvent> {

        private DxfVariableImpl variable;

        public HeaderHandler() {
            logger.debug("processing dxf header");
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0://ENDSEC
                    logger.debug("found {} header variables", headerVariables.size());
                    popHandler();
                    break;
                case 9:
                    variable = new DxfVariableImpl(event.getValue());
                    headerVariables.add(variable);
                    break;
                default:
                    variable.addValue(createValue(event));
            }
        }

    }

    private class EntitiesHandler implements Consumer<DxfStreamEvent> {

        public EntitiesHandler() {
            logger.debug("processing dxf entities starting with line {}", lineNumber);
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0:
                    switch (event.getValue()) {
                        case "ENDSEC":
                            logger.debug("end of entities section at line {}, found {} entities", lineNumber, entities.size());
                            popHandler();
                            break;
                        case "LINE":
                            pushHandler(new LineHandler());
                            break;
                        case "ARC":
                            pushHandler(new ArcHandler());
                            break;
                        case "POLYLINE":
                            pushHandler(new PolylineHandler());
                            break;
                        case "LWPOLYLINE":
                            pushHandler(new LwpolylineHandler());
                            break;
                        case "INSERT":
                            pushHandler(new BlockHandler());
                            break;
                    }
                    break;
            }
        }
    }

    private class TablesHandler implements Consumer<DxfStreamEvent> {

        public TablesHandler() {
            logger.debug("processing dxf tables");
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0:
                    switch (event.getValue()) {
                        case "ENDSEC":
                            popHandler();
                            break;
                    }
                    break;
            }
        }
    }

    private class ObjectsHandler implements Consumer<DxfStreamEvent> {

        public ObjectsHandler() {
            logger.debug("processing dxf objects");
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0:
                    switch (event.getValue()) {
                        case "ENDSEC":
                            popHandler();
                            break;
                        case "GEODATA":
                        case "ACAD_PROXY_OBJECT":
                            pushHandler(new GenericObjectHandler(event.getValue()));
                            break;
                    }
                    break;
            }
        }
    }

    private class GenericObjectHandler implements Consumer<DxfStreamEvent> {

        private final DxfGenericObjectImpl obj;

        public GenericObjectHandler(String type) {
            obj = new DxfGenericObjectImpl(type);
            logger.debug("processing object of type =< {} >", type);
            objects.add(obj);
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0:
                    bubbleHandler(event);
                    break;
                default:
                    obj.addValue(createValue(event));
            }
        }

    }

    private class BlockHandler implements Consumer<DxfStreamEvent> {

        private final DxfPolylineImpl polyLine;
        private final List<Double> xpoints = list(), ypoints = list();

        public BlockHandler() {
            polyLine = new DxfPolylineImpl();
            entities.add(polyLine);
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0:
                    checkArgument(xpoints.size() == ypoints.size());
                    for (int i = 0; i < xpoints.size(); i++) {
                        polyLine.addVertex(new DxfVertexImpl(xpoints.get(i), ypoints.get(i)));
                    }
                    bubbleHandler(event);
                    break;
                case 2:
                    polyLine.getXdata().addXdata(BLOCK_CODE, event.getValue());
                    break;
                case 8:
                    polyLine.setLayer(event.getValue());
                    break;
                case 10:
                    xpoints.add(event.getValueAsDouble());
                    break;
                case 20:
                    ypoints.add(event.getValueAsDouble());
                    break;
                case 1001:
                    pushHandler(new XdataHandler(event.getValue(), polyLine.getXdata()));
                    break;
            }
        }
    }

    private class LwpolylineHandler implements Consumer<DxfStreamEvent> {

        private final DxfPolylineImpl polyLine;
        private final List<Double> xpoints = list(), ypoints = list();

        public LwpolylineHandler() {
            polyLine = new DxfPolylineImpl();
            entities.add(polyLine);
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0:
                    checkArgument(xpoints.size() == ypoints.size());
                    for (int i = 0; i < xpoints.size(); i++) {
                        polyLine.addVertex(new DxfVertexImpl(xpoints.get(i), ypoints.get(i)));
                    }
                    bubbleHandler(event);
                    break;
                case 8:
                    polyLine.setLayer(event.getValue());
                    break;
                case 10:
                    xpoints.add(event.getValueAsDouble());
                    break;
                case 20:
                    ypoints.add(event.getValueAsDouble());
                    break;
                case 70:
                    int polylineFlag = event.getValueAsInt();
                    switch (polylineFlag) {
                        case 1:
                            polyLine.setClosedPerimeter(true);
                            break;
                    }
                    break;
                case 1001:
                    pushHandler(new XdataHandler(event.getValue(), polyLine.getXdata()));
                    break;
            }
        }
    }

    private class LineHandler implements Consumer<DxfStreamEvent> {

        private final DxfPolylineImpl polyLine;
        private Double x1, y1, x2, y2;

        public LineHandler() {
            polyLine = new DxfPolylineImpl();
            entities.add(polyLine);
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0:
                    polyLine.addVertex(new DxfVertexImpl(x1, y1));
                    polyLine.addVertex(new DxfVertexImpl(x2, y2));
                    bubbleHandler(event);
                    break;
                case 8:
                    polyLine.setLayer(event.getValue());
                    break;
                case 10:
                    x1 = event.getValueAsDouble();
                    break;
                case 20:
                    y1 = event.getValueAsDouble();
                    break;
                case 11:
                    x2 = event.getValueAsDouble();
                    break;
                case 21:
                    y2 = event.getValueAsDouble();
                    break;
                case 70:
                    int polylineFlag = event.getValueAsInt();
                    switch (polylineFlag) {
                        case 1:
                            polyLine.setClosedPerimeter(true);
                            break;
                    }
                    break;
                case 1001:
                    pushHandler(new XdataHandler(event.getValue(), polyLine.getXdata()));
                    break;
            }
        }
    }

    private class ArcHandler implements Consumer<DxfStreamEvent> {

        private final DxfExtendedDataImpl xdata = new DxfExtendedDataImpl();
        private Double startAngle, endAngle, radius, x, y;
        private String layer;

        public ArcHandler() {

        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0://TODO check this, last element ??
                    entities.add(new DxfArcImpl(point(x, y), startAngle, endAngle, radius, layer, xdata));
                    bubbleHandler(event);
                    break;
                case 8:
                    layer = event.getValue();
                    break;
                case 10:
                    x = event.getValueAsDouble();
                    break;
                case 20:
                    y = event.getValueAsDouble();
                    break;
                case 40:
                    radius = event.getValueAsDouble();
                    break;
                case 50:
                    startAngle = event.getValueAsDouble();
                    break;
                case 51:
                    endAngle = event.getValueAsDouble();
                    break;
                case 1001:
                    pushHandler(new XdataHandler(event.getValue(), xdata));
                    break;
            }
        }
    }

    private class PolylineHandler implements Consumer<DxfStreamEvent> {

        private final DxfPolylineImpl polyLine;

        public PolylineHandler() {
            polyLine = new DxfPolylineImpl();
            entities.add(polyLine);
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 0:
                    switch (event.getValue()) {
                        case "VERTEX":
                            pushHandler(new PolylineVertexHandler());
                            break;
                        default:
                            bubbleHandler(event);
                    }
                    break;
                case 8:
                    polyLine.setLayer(event.getValue());
                    break;
                case 70:
                    int polylineFlag = event.getValueAsInt();
                    switch (polylineFlag) {
                        case 1:
                            polyLine.setClosedPerimeter(true);
                            break;
                    }
                    break;
                case 1001:
                    pushHandler(new XdataHandler(event.getValue(), polyLine.getXdata()));
                    break;
            }
        }

        private class PolylineVertexHandler implements Consumer<DxfStreamEvent> {

            private final DxfVertexImpl vertex;

            public PolylineVertexHandler() {
                vertex = new DxfVertexImpl();
                polyLine.addVertex(vertex);
            }

            @Override
            public void accept(DxfStreamEvent event) {
                switch (event.getGroupCode()) {
                    case 0:
                        switch (event.getValue()) {
                            case "SEQEND":
                                popHandler();
                                break;
                            default:
                                bubbleHandler(event);
                        }
                        break;
                    case 10:
                        vertex.setX(event.getValueAsDouble());
                        break;
                    case 20:
                        vertex.setY(event.getValueAsDouble());
                        break;
                    case 30:
                        vertex.setZ(event.getValueAsDouble());
                        break;
                }

            }
        }
    }

    private class XdataHandler implements Consumer<DxfStreamEvent> {

        private final DxfExtendedDataImpl xdata;
        private String appName;

        private XdataHandler(String value, DxfExtendedDataImpl xdata) {
            this.appName = value;
            this.xdata = checkNotNull(xdata);
        }

        @Override
        public void accept(DxfStreamEvent event) {
            switch (event.getGroupCode()) {
                case 1002:
                    //TODO
                    break;
                case 1001:
                    //TODO verify this
                    appName = event.getValue();
                    break;
                case 1000:
                    xdata.addXdata(appName, event.getValue());
                    break;
                //TODO process other xdata values
                case 0:
                    bubbleHandler(event);
                    break;
            }
        }
    }

//    @Nullable
//    private DxfGeoreferenceInfo buildGeoreferenceInfoSafe() {
//        try {
//            List<DxfGeodata> list = objects.stream().filter(DxfGeodata.class::isInstance).map(DxfGeodata.class::cast).collect(toList());
//            if (list.isEmpty()) {
//                logger.debug("cannot build georeference info: missing geodata in dxf");
//                return null;
//            } else {
//                DxfGeodata geodata = getOnlyElement(list);
//                int cxType = geodata.getValue(70).getValueAsInt();
//                /** 
//                    70 Tipi di coordinate di progettazione:
//                    0 - Sconosciuto
//                    1 - Griglia locale
//                    2 - Griglia proiettata
//                    3 - Geografico (latitudine/longitudine)
//               
//                40	Scala unità orizzontale, fattore che converte le coordinate di progettazione orizzontali in metri tramite moltiplicazione.
//                41	Scala unità verticale, fattore che converte le coordinate di progettazione verticali in metri tramite moltiplicazione. 
//                
//                95
//                    Metodo di valutazione della scala:
//                    1 - Nessuno
//                    2 - Fattore di scala specificato dall'utente
//                    3 - Scala griglia in corrispondenza del punto di riferimento
//                    4 - Prismoidale
//                 */
//                DxfGeoreferenceInfo info;
//                switch (cxType) {
//                    case 1:
//                        double //
//                                refX = geodata.getValue(10).getValueAsDouble(),
//                         refY = geodata.getValue(20).getValueAsDouble(),
//                         lgtX = geodata.getValue(11).getValueAsDouble(),
//                         latY = geodata.getValue(21).getValueAsDouble(),
////                                refX = geodata.getFirstValue(13).getValueAsDouble(),
////                         refY = geodata.getFirstValue(23).getValueAsDouble(),
////                         lgtX = geodata.getFirstValue(14).getValueAsDouble(),
////                         latY = geodata.getFirstValue(24).getValueAsDouble(),
//                         northX = geodata.getValue(12).getValueAsDouble(),
//                         northY = geodata.getValue(22).getValueAsDouble(),
//                         northDirection = Math.atan2(northY, northX);//TODO                         	DxfValue{groupCode=12, value=2.449293598294706E-16} 	DxfValue{groupCode=22, value=1.0}                                
////                         scaleX = geodata.getValue(40).getValueAsDouble(),
////                         scaleY = geodata.getValue(41).getValueAsDouble();
////                        checkArgument(scaleX == scaleY, "unsupported scale: scaleX <> scaleY");
//                        int scaleMode = geodata.getFirstValue(95).getValueAsInt();
//                        checkArgument(scaleMode == 1, "unsupported scale mode = %s", scaleMode);//TODO support scale (?)
//                        double scale = 1d;
//
//                        String coodinateSystemXml = geodata.getValues().stream().filter(g -> g.getGroupCode() == 303 || g.getGroupCode() == 301).map(DxfValue::getValue).collect(joining("")).replaceAll(Pattern.quote("^J"), "");
//                        logger.debug("geo xml = \n\n{}\n", prettifyIfXml(coodinateSystemXml));
//
//                        String coordinateSystem = applyXpath(coodinateSystemXml, map("g", "http://www.osgeo.org/mapguide/coordinatesystem"), "/g:Dictionary/g:ProjectedCoordinateSystem/@id");
//                        logger.debug("coordinate system =< {} >", coordinateSystem);
//
////                        CadPoint latLgt = translateCoordinates(point(lgtX, latY), "EPSG:4236", "EPSG:3857");
//                        info = new DxfGeoreferenceInfoImpl(refX, refY, lgtX, latY, northDirection, scale, coordinateSystem);
//                        break;
//                    default:
//                        throw new DxfParserException("unsupported geodata cx type = %s", cxType);
//                }
//                logger.debug("found georeference info = {}", info);
//                return info;
//            }
//        } catch (Exception ex) {
//            logger.warn(marker(), "error processing dxf data: unable to build georeference helper", ex);
//            return null;
//        }
//    }
    private class DxfDocumentImpl implements DxfDocument {

        private final Map<String, DxfVariable> headerVariables;
        private final List<DxfEntity> entities;
        private final List<DxfObject> objects;
//        private final DxfGeoreferenceInfo georeferenceInfo;

        private DxfDocumentImpl() {
            this.headerVariables = DxfReader.this.headerVariables.stream().collect(toMap(DxfVariable::getKey, identity(), ALLOW_DUPLICATES)).accept(m -> {
                Iterator<DxfVariable> iterator = DxfReader.this.headerVariables.iterator();
                DxfVariable head = null;
                while (iterator.hasNext()) {
                    DxfVariable element = iterator.next();
                    switch (element.getKey()) {
                        case "$CUSTOMPROPERTYTAG":
                            head = element;
                            break;
                        case "$CUSTOMPROPERTY":
                            DxfVariable var = new DxfVariableImpl(checkNotNull(head, "invalid custom property structure/sequence").getStringValue(), element.getValues().values());
                            m.put(var.getKey(), var);
                            head = null;
                    }
                }

            });
            this.entities = ImmutableList.copyOf(DxfReader.this.entities);
            this.objects = ImmutableList.copyOf(DxfReader.this.objects);
//            this.georeferenceInfo = buildGeoreferenceInfoSafe();
        }

        @Override
        public Map<String, DxfVariable> getHeaderVariables() {
            return headerVariables;
        }

        @Override
        public List<DxfEntity> getEntities() {
            return entities;
        }

        @Override
        public List<DxfObject> getObjects() {
            return objects;
        }

//        @Override
//        public DxfGeoreferenceInfo getGeoreferenceInfo() {
//            return georeferenceInfo;
//        }
    }

    private static class DxfGenericObjectImpl implements DxfGenericObject {

        private final String type;
        private final List<DxfValue> values;

        public DxfGenericObjectImpl(String type) {
            this.type = checkNotBlank(type);
            this.values = list();
        }

        @Override
        public String getType() {
            return type;
        }

        @Override
        public List<DxfValue> getValues() {
            return unmodifiableList(values);
        }

        public void addValue(DxfValueImpl value) {
            values.add(value);
//            checkArgument(values.put(value.getGroupCode(), value) == null, "duplicate value received for groupCode = {}", value.getGroupCode());
        }

        @Override
        public String toString() {
            return "DxfGenericObject{values=" + values + '}';
        }

    }


    private static class DxfPolylineImpl implements DxfPolilyne {

        private boolean isClosedPerimeter = false;
        private String layer;
        private final List<DxfVertex> vertexes = list();
        private final DxfExtendedDataImpl xdata = new DxfExtendedDataImpl();

        public void addVertex(DxfVertexImpl vertex) {
            vertexes.add(vertex);
        }

        @Override
        public CadPolyline getPolilyne() {
            return new CadPolyline(list(vertexes).map(v -> point(v.getX(), v.getY())));
        }

        @Override
        public String getType() {
            return "POLYLINE";
        }

        @Override
        public String getLayer() {
            return layer;
        }

        public void setLayer(String layer) {
            this.layer = layer;
        }

        @Override
        public DxfExtendedDataImpl getXdata() {
            return xdata;
        }

        @Override
        public boolean isClosedPerimeter() {
            return isClosedPerimeter;
        }

        public void setClosedPerimeter(boolean isClosedPerimeter) {
            this.isClosedPerimeter = isClosedPerimeter;
        }

        @Override
        public CadPolyline getPerimeter() {
            return getPolilyne();
        }

    }

    private static class DxfExtendedDataImpl implements DxfExtendedData {

        private final Map<String, List<String>> xdata = map();

        public void addXdata(String application, String value) {
            if (!xdata.containsKey(application)) {
                xdata.put(application, list());
            }
            xdata.get(application).add(value);
        }

        @Override
        public Map<String, List<String>> getXdata() {
            return xdata;
        }
    }

    private static class DxfVertexImpl implements DxfVertex {

        private double x, y, z;

        public DxfVertexImpl() {
        }

        private DxfVertexImpl(double x, double y) {
            this.x = x;
            this.y = y;
            this.z = 0;
        }

        @Override
        public double getX() {
            return x;
        }

        public void setX(double x) {
            this.x = x;
        }

        @Override
        public double getY() {
            return y;
        }

        public void setY(double y) {
            this.y = y;
        }

        @Override
        public double getZ() {
            return z;
        }

        public void setZ(double z) {
            this.z = z;
        }

    }
}
