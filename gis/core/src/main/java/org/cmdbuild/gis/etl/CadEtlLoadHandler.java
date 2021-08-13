/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.gis.etl;

import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Predicates;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.ImmutableSet.toImmutableSet;
import static com.google.common.collect.Iterables.getLast;
import static com.google.common.collect.Iterables.getOnlyElement;
import static com.google.common.collect.MoreCollectors.toOptional;
import static java.lang.String.format;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import static java.util.Collections.singletonList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Predicate;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import java.util.stream.Stream;
import javax.annotation.Nullable;
import static org.apache.commons.io.FileUtils.byteCountToDisplaySize;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.apache.commons.lang3.tuple.Pair;
import org.cmdbuild.dao.beans.Card;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.WhereOperator.EQ;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.Classe;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.FOREIGNKEY;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.REFERENCE;
import org.cmdbuild.dao.postgres.q3.RefAttrHelperService;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.beans.AttributeFilterConditionImpl;
import org.cmdbuild.etl.gate.inner.EtlGateHandlerType;
import static org.cmdbuild.etl.gate.inner.EtlGateHandlerType.ETLHT_CAD;
import org.cmdbuild.etl.job.EtlLoadHandler;
import org.cmdbuild.etl.job.EtlLoaderApi;
import org.cmdbuild.etl.loader.EtlHandlerContext;
import org.cmdbuild.etl.loader.EtlHandlerContextImpl;
import static org.cmdbuild.etl.loader.EtlMergeMode.EM_LEAVE_MISSING;
import static org.cmdbuild.etl.loader.EtlMergeMode.EM_NO_MERGE;
import org.cmdbuild.etl.loader.EtlProcessingResult;
import org.cmdbuild.etl.loader.EtlTemplate;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfig;
import org.cmdbuild.etl.loader.EtlTemplateColumnConfigImpl;
import static org.cmdbuild.etl.loader.EtlTemplateColumnMode.ETCM_RECORDID;
import org.cmdbuild.etl.loader.EtlTemplateImpl;
import org.cmdbuild.etl.loader.EtlTemplateService;
import org.cmdbuild.etl.loader.EtlTemplateWithData;
import org.cmdbuild.etl.loader.EtlTemplateWithDataImpl;
import org.cmdbuild.etl.loader.inner.EtlProcessingResultErrorImpl;
import org.cmdbuild.etl.loader.inner.EtlProcessingResultImpl;
import static org.cmdbuild.etl.loader.inner.EtlProcessingResultImpl.emptyResult;
import static org.cmdbuild.etl.loader.inner.EtlTemplateProcessorServiceImpl.CM_IMPORT_RECORD_ID;
import org.cmdbuild.gis.GisService;
import org.cmdbuild.gis.Polygon;
import static org.cmdbuild.gis.etl.CadEtlLoadHandler.MasterCardFilterMode.MCFM_FROMSHAPE;
import org.cmdbuild.gis.model.PointImpl;
import org.cmdbuild.gis.model.PolygonImpl;
import static org.cmdbuild.gis.utils.GisUtils.cmGeometryToPostgisSql;
import static org.cmdbuild.utils.cad.CadGeometryUtils.getBoundingBox;
import static org.cmdbuild.utils.cad.CadUtils.parseCadFile;
import org.cmdbuild.utils.cad.dxfparser.model.DxfDocument;
import org.cmdbuild.utils.cad.dxfparser.model.DxfEntity;
import org.cmdbuild.utils.cad.geo.DxfToShapefileHelper;
import static org.cmdbuild.utils.cad.geo.GeoUtils.parseTransformationRules;
import org.cmdbuild.utils.cad.model.CadEntity;
import org.cmdbuild.utils.cad.model.CadEntityImpl;
import org.cmdbuild.utils.cad.model.CadPoint;
import static org.cmdbuild.utils.cad.model.CadPoint.point;
import org.cmdbuild.utils.cad.model.CadPolyline;
import org.cmdbuild.utils.cad.model.CadRectangle;
import static org.cmdbuild.utils.cad.model.CadRectangle.rectangle;
import static org.cmdbuild.utils.encode.CmPackUtils.unpackIfPacked;
import org.cmdbuild.utils.io.BigByteArray;
import static org.cmdbuild.utils.io.CmIoUtils.countBytes;
import static org.cmdbuild.utils.io.CmIoUtils.getContentType;
import static org.cmdbuild.utils.io.CmIoUtils.newDataHandler;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.zip;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnumOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmConvertUtils.toListOfStrings;
import static org.cmdbuild.utils.lang.CmExceptionUtils.exceptionToMessage;
import static org.cmdbuild.utils.lang.CmExceptionUtils.exceptionToUserMessage;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmMapUtils.toImmutableMap;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotEmpty;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.mapToLoggableStringLazy;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.random.CmRandomUtils.randomId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class CadEtlLoadHandler implements EtlLoadHandler {

    public final static String CAD_METADATA_PREFIX = "meta.",
            CAD_LAYER_MASTER = "CM_MASTER",
            CAD_LAYER = "layer",
            CAD_AREA = "area",
            CAD_POSITION = "position",
            CAD_PERIMETER = "perimeter",
            CAD_BOX = "box",
            CAD_ENTITY = "entity",
            CAD_IMPORT_RELATIVE_LOCATION_COLUMN_NAME = "CM_RELATIVE_LOCATION",
            CMDBUILD_DEFAULT_EPSG = "EPSG:3857"; //same as EPSG:900913

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final EtlTemplateService importService;
    private final GisService gisService;
    private final DaoService dao;
    private final RefAttrHelperService referenceHelper;

    public CadEtlLoadHandler(EtlTemplateService importService, GisService gisService, DaoService dao, RefAttrHelperService referenceHelper) {
        this.importService = checkNotNull(importService);
        this.gisService = checkNotNull(gisService);
        this.dao = checkNotNull(dao);
        this.referenceHelper = checkNotNull(referenceHelper);
    }

    @Override
    public EtlGateHandlerType getType() {
        return ETLHT_CAD;
    }

    @Override
    @Nullable
    public EtlHandlerContext<EtlProcessingResult> load(EtlLoaderApi api) {
        return new CadImportHelper(api).loadRecords();
    }

    @Nullable
    private static String buildGisPerimeter(CadEntity entity) {
        return entity.getPerimeter().isPoint() ? null : cmGeometryToPostgisSql(toPostgisPolygon(entity.getPerimeter()));
    }

    @Nullable
    private static String buildGisBox(CadEntity entity) {
        return entity.getPerimeter().isPoint() ? null : cmGeometryToPostgisSql(toPostgisPolygon(entity.getBoundingBox()));
    }

    private static String buildGisPosition(CadEntity entity) {
        return cmGeometryToPostgisSql(new PointImpl(entity.getPosition().getX(), entity.getPosition().getY()));
    }

    private static Polygon toPostgisPolygon(CadPolyline cadPolyline) {
        return new PolygonImpl((List) list(cadPolyline.getVertexes()).map(p -> new PointImpl(p.getX(), p.getY())).accept(l -> {
            if (!equal(l.get(0), getLast(l))) {
                l.add(l.get(0));
            }
        }));
    }

    private class CadImportHelper {

        private final EtlLoaderApi api;
        private final CadImportConfig config;
        private final DxfDocument document;
        private final Map<String, String> globalMetadata;
        private List<Map<String, Object>> records;

        public CadImportHelper(EtlLoaderApi api) {
            this.api = checkNotNull(api);
            config = new CadImportConfig(api);
            document = parseCadFile(api.getData());
            globalMetadata = map(document.getMetadata()).mapKeys(k -> format("global.%s", k)).with(document.getMetadata());
        }

        @Nullable
        public EtlHandlerContext<EtlProcessingResult> loadRecords() {
            logger.info("loading cad file = {} {}", byteCountToDisplaySize(countBytes(api.getData())), getContentType(api.getData()));

            logger.debug("global metadata = \n\n{}\n", mapToLoggableStringLazy(globalMetadata));

            EtlProcessingResult cardImportResult;

            if (!api.getTemplates().isEmpty()) {
                List<CadEntity> entities = document.getCadEntities(CMDBUILD_DEFAULT_EPSG);
                CadEntity master = CadEntityImpl.builder().withLayer(CAD_LAYER_MASTER).withSurface(0d).accept(m -> {
                    if (entities.isEmpty()) {
                        m.withBoundingBox(rectangle(0, 0, 0, 0)).withPerimeter(new CadPolyline(point(0, 0))).withPosition(point(0, 0));
                    } else {
                        CadRectangle box = entities.iterator().next().getBoundingBox();
                        for (CadEntity entity : entities) {
                            box = getBoundingBox(list(box.getVertexes()).with(entity.getPerimeter().getVertexes()));
                        }
                        m.withBoundingBox(box).withPerimeter(box).withPosition(box.getCenter());
                    }
                }).build();
                records = (List) list(entities).with(master).stream().map(e -> map(globalMetadata).with(
                        CAD_LAYER, e.getLayer(),
                        CAD_AREA, toStringNotBlank(e.getSurface()),//TODO format/unit ??
                        CAD_POSITION, buildGisPosition(e),
                        CAD_PERIMETER, buildGisPerimeter(e),
                        CAD_BOX, buildGisBox(e),
                        CAD_ENTITY, e,
                        CM_IMPORT_RECORD_ID, randomId()
                ).accept(m -> {
                    e.getMetadata().forEach((k, v) -> {
                        m.put(CAD_METADATA_PREFIX + k, v);
                        m.putIfAbsent(k, v);
                    });
                })).collect(toList());

                List<EtlTemplate> templates = api.getTemplates().stream().filter(t -> t.isActive()).collect(toList());
//                if (enableShapeImport && config.enableAutoMasterCardFilter) {
//                    List<EtlTemplate> list = templates.stream().filter(t -> equal(t.getTargetName(), config.classId)).collect(toList());
//                    if (!list.isEmpty()) {
//                        int index = list.stream().mapToInt(templates::lastIndexOf).max().getAsInt();
//                        list = templates.subList(0, index + 1);
//                        templates = templates.subList(index + 1, templates.size());
//                        cardImportResult = cardImportResult.and(importTemplates(records, list));
//                    }
//                }
//                cardImportResult = 
//                cardImportResult.and(importTemplates(templates));

                //TODO fix auto master card filter (when master card is imported by templates here) !!
                try {
                    List<EtlTemplateWithData> data = templates.stream().map(t -> new EtlTemplateWithDataImpl(EtlTemplateImpl.copyOf(t).withColumns(t.getColumns().stream().map(c -> {
                        switch (c.getColumnName()) {
                            case CAD_IMPORT_RELATIVE_LOCATION_COLUMN_NAME:
                                return EtlTemplateColumnConfigImpl.copyOf(c).withColumnName(c.getAttributeName()).withMode(ETCM_RECORDID).build();
                            default:
                                return EtlTemplateColumnConfigImpl.copyOf(c).withColumnName(c.getAttributeName()).build();
                        }
                    }).collect(toImmutableList())).accept(b -> {
                        if (config.enableAutoMasterCardFilter && !equal(config.masterCardClassId, t.getTargetName())) {
                            Attribute attr = getAttrForMasterCardFilterOrNull(t.getTargetName());
                            if (attr != null) {
                                Object masterCardIdOrRecordId = Optional.ofNullable(dao.select(ATTR_ID).from(config.masterCardClassId).accept(q -> {
                                    config.getMasterCardKeySourceAndAttrs().forEach(p -> q.where(p.getRight(), EQ, globalMetadata.get(p.getLeft())));
                                }).getCardOrNull()).map(Card::getId).orElse(null);
                                if (masterCardIdOrRecordId == null) {
                                    masterCardIdOrRecordId = templates.stream().filter(tt -> equal(tt.getTargetName(), config.masterCardClassId)).flatMap(tt -> new TemplateRecordsHelper(tt).getRecordStreamForTemplate()).distinct()
                                            .collect(toOptional()).map(m -> m.get(CM_IMPORT_RECORD_ID)).orElse(null);
                                }
                                checkNotNull(masterCardIdOrRecordId, "unable to retrieve master card: card not found for type = %s key attrs =< %s > with values =< %s >", config.masterCardClassId, Joiner.on(",").join(config.masterCardKeyAttr), config.masterCardKeySource.stream().map(globalMetadata::get).collect(joining(",")));
                                logger.info("add template filter from shape master card = {} to template = {} using reference attr = {}", config.masterCardClassId, t, attr);
                                CmdbFilter filter = AttributeFilterConditionImpl.eq(attr.getName(), masterCardIdOrRecordId).toAttributeFilter().toCmdbFilters();
                                b.withFilter(filter.and(t.getFilter()));
                            } else {
                                checkArgument(t.hasMergeMode(EM_LEAVE_MISSING, EM_NO_MERGE), "missing reference attr for master card filter, for template with active merge mode = %s", t);
                                logger.info("skip master card filter for template = {} (no unique reference attr found)", t);
                            }
                        }
                    }).build(), () -> {
                        TemplateRecordsHelper helper = new TemplateRecordsHelper(t);
                        logger.info("load records for template = {} with layer =< {} > code metadata =< {} >", t, helper.layer, Joiner.on(", ").join(helper.codeAttrs));
                        Map<String, String> attributeMapping = map(t.getColumns().stream().collect(toImmutableMap(EtlTemplateColumnConfig::getAttributeName, EtlTemplateColumnConfig::getColumnName))).with(CM_IMPORT_RECORD_ID, CM_IMPORT_RECORD_ID);
                        logger.debug("using column mapping = \n\n{}\n", mapToLoggableStringLazy(attributeMapping));
                        CadRelativePositionHelper relativePositionHelper = new CadRelativePositionHelper(t);
                        return helper.getRecordStreamForTemplate()
                                .map(r -> map(attributeMapping).mapValues(r::get)
                                .accept(m -> relativePositionHelper.handleRelativePositionAttrs((CadEntity) checkNotNull(r.get(CAD_ENTITY)), m::put))).collect(toImmutableList());
                    })).collect(toImmutableList());
                    cardImportResult = importService.importDataWithTemplates(data);
                } catch (Exception ex) {
                    logger.error(marker(), "error preparing data for template processing", ex);
                    cardImportResult = new EtlProcessingResultImpl(0, 0, 0, 0, 0, singletonList(new EtlProcessingResultErrorImpl(0l, 0l, emptyMap(), exceptionToUserMessage(ex), exceptionToMessage(ex))));
                }

                logger.info("completed data import for document = {} : {}", document, cardImportResult.getResultDescription());
            } else {
                logger.info("no template configured, skip card import");
                cardImportResult = emptyResult();
            }

            if (config.enableShapeImport) {
                EtlProcessingResult shapeImportResult;
                try {
                    checkArgument(gisService.isGeoserverEnabled(), "geoserver is not enabled");

                    logger.debug("shabe import begin, selecting target card");
                    Card shapeTargetCard = checkNotNull(dao.select(ATTR_ID).from(config.shapeImportClassId).accept(q -> {
                        config.getShapeImportKeySourceAndAttrs().forEach(p -> q.where(p.getRight(), EQ, globalMetadata.get(p.getLeft())));
                    }).getCardOrNull(), "unable to retrieve master card: card not found for key attrs =< %s > with values =< %s >", Joiner.on(",").join(config.shapeImportKeyAttr), config.shapeImportKeySource.stream().map(globalMetadata::get).collect(joining(",")));
//                long cardId = toLong(api.getConfig("shape_import_key_source"));//TODO improve this
                    //insert into "_EtlGate" ("Code","AllowPublicAccess","Handlers") values ('MyGate',TRUE,'[{"type":"cad","shape_import_enabled":true,"shape_import_target_class":"MyClass","shape_import_target_card":1198}]');
                    //insert into "_EtlGate" ("Code","AllowPublicAccess","Handlers") values ('MyGate',TRUE,'[{"type":"cad","shape_import_enabled":true,"shape_import_target_class":"MyClass","shape_import_target_card":1198,"shape_import_target_reference_system":"EPSG:3857"}]');
// insert into "_EtlGate" ("Code","AllowPublicAccess","Handlers") values ('MyGate',TRUE,'[{"type":"cad","shape_import_enabled":true,"shape_import_target_class":"MyClass","shape_import_target_card":10102,"shape_import_target_attr":"MyLayer"}]');
//update "_EtlGate" set "Status" = 'N' where "Status" = 'A';
//cmdbuild r postToGate MyGate ~/svn/cmdbuild/utils/cad/src/test/resources/test_file_2.dwg
//                GisAttribute gisAttribute = gisService.getLayerByClassAndName(classId, attrName);
//                gisService.getG
//                GeoserverLayer geoserverLayer = getOnlyElement(gisService.getGeoServerLayersForCard(classId, cardid), null);//TODO improve this
//                if (geoserverLayer == null) {
////                    geoserverLayer = GeoserverLayerImpl.builder()
////                            .withOwnerClass(classId)
////                            .withOwnerCard(cardid)
////                            .with
//////                            .withLayerName("test_layer_name")//TODO
//////                            .withGeoserverName("_")//TODO improve this
//////                            .withType("shape")//TODO improve this, use enum
//////                            .withVisibility(singleton(classId))//TODO check this
//////                            .withMinimumZoom(5)
////                            //TODO handle zoom and other layer metadata
////                            .build();
//                }
                    Predicate<DxfEntity> filter = config.includeLayers.isEmpty() && config.excludeLayers.isEmpty() ? Predicates.alwaysTrue() : (e) -> (config.includeLayers.isEmpty() || config.includeLayers.contains(e.getLayer().trim().toLowerCase())) && (config.excludeLayers.isEmpty() || !config.excludeLayers.contains(e.getLayer().trim().toLowerCase()));
                    logger.info("build shapefile from layers =< {} >", config.includeLayers);
                    BigByteArray shapeFile = DxfToShapefileHelper.withDocument(document)
                            .withEntityFilter(filter)
                            .withTargetReferenceSystem(config.targetReferenceSystem)
                            .withTransformationRules(isBlank(config.transformationRules) ? null : parseTransformationRules(config.transformationRules))
                            .toShapeFile();
                    logger.info("load shapefile on geoserver");
                    boolean hasPreviousShape = gisService.getGeoserverLayerByCodeOrNull(config.shapeImportClassId, config.shapeAttrName, shapeTargetCard.getId()) != null;
                    if (config.replaceExisting && hasPreviousShape) {//TODO improve this, move in gisAttribute config (??)
                        gisService.deleteGeoServerLayer(config.shapeImportClassId, config.shapeAttrName, shapeTargetCard.getId());
                    }
                    gisService.setGeoserverLayer(config.shapeImportClassId, config.shapeAttrName, shapeTargetCard.getId(), newDataHandler(shapeFile));
                    shapeImportResult = new EtlProcessingResultImpl(hasPreviousShape ? 0 : 1, hasPreviousShape ? 1 : 0, 0, 0, 1, emptyList());
                } catch (Exception ex) {
                    logger.error(marker(), "error importing shape from cad file", ex);//TODO throw exception ??
                    shapeImportResult = new EtlProcessingResultImpl(0, 0, 0, 0, 0, list(new EtlProcessingResultErrorImpl(0l, 0l, emptyMap(), exceptionToUserMessage(ex), exceptionToMessage(ex))));//TODO improve this, record info

                }
                cardImportResult = cardImportResult.and(shapeImportResult);
            }

            return new EtlHandlerContextImpl(cardImportResult, api.getMeta());
        }

        private class TemplateRecordsHelper {

            private final String layer;
            private final Set<String> codeAttrs;

            public TemplateRecordsHelper(EtlTemplate template) {
                layer = checkNotBlank(template.getSource(), "missing source for template = {}", template);
                codeAttrs = template.getImportKeyAttributes().stream().map(template::getColumnByAttrName).map(EtlTemplateColumnConfig::getColumnName).collect(toImmutableSet());
            }

            private Stream<Map<String, Object>> getRecordStreamForTemplate() {
                return records.stream().filter(r -> equal(r.get(CAD_LAYER), layer) && codeAttrs.stream().allMatch(codeAttr -> isNotBlank((String) r.get(codeAttr))));
            }

        }

        @Nullable
        private Attribute getAttrForMasterCardFilterOrNull(String targetClassName) {
            Classe target = dao.getClasse(targetClassName);
            logger.info("add template filter from master card of type = {}", config.masterCardClassId);
            Classe masterClassType = dao.getClasse(config.masterCardClassId);
            List<Attribute> attrs = target.getActiveServiceAttributes().stream().filter(a -> a.isOfType(FOREIGNKEY, REFERENCE)).filter(a -> equal(referenceHelper.getTargetClassForAttribute(a), masterClassType)).collect(toList());
            if (attrs.size() > 1) {
                logger.info("unable to get unique reference attr from class = {} to master card of type = {}", targetClassName, config.masterCardClassId);
                return null;
            } else {
                return getOnlyElement(attrs, null);
            }
        }

        private class CadRelativePositionHelper {

            private final EtlTemplate template;
            private final Classe classe;

            public CadRelativePositionHelper(EtlTemplate template) {
                this.template = checkNotNull(template);
                classe = dao.getClasse(template.getTargetName());
            }

            public void handleRelativePositionAttrs(CadEntity cadEntity, BiConsumer<String, String> consumer) {
                template.getColumns().stream().filter(c -> equal(c.getColumnName(), CAD_IMPORT_RELATIVE_LOCATION_COLUMN_NAME)).forEach(column -> {
                    Classe target = referenceHelper.getTargetClassForAttribute(classe.getAttribute(column.getAttributeName()));
                    Set<String> values = api.getTemplates().stream()
                            .filter(t -> equal(t.getTargetName(), target.getName()))
                            .flatMap(t -> new TemplateRecordsHelper(t).getRecordStreamForTemplate())
                            .filter(r -> ((CadEntity) r.get(CAD_ENTITY)).contains(cadEntity))
                            .map(r -> toStringNotBlank(r.get(CM_IMPORT_RECORD_ID)))
                            .collect(toImmutableSet());
                    if (values.isEmpty()) {
                        logger.debug("no relative position card found");
                    } else if (values.size() == 1) {
                        logger.debug("found relative position card = {}", getOnlyElement(values));
                        consumer.accept(column.getAttributeName(), getOnlyElement(values));
                    } else {
                        logger.warn("more than one value found for relative position, unable to select one (values = {})", values);
                    }
                });
            }
        }
    }

    private class CadImportConfig {

        private final String shapeImportClassId, shapeAttrName, transformationRules, targetReferenceSystem, masterCardClassId;
        private final boolean replaceExisting, enableAutoMasterCardFilter, enableShapeImport;//note: it is necessary to force this if crs changes ! (test & confirm)
        private final Set<String> includeLayers, excludeLayers;
        private final List<String> shapeImportKeySource, shapeImportKeyAttr, masterCardKeySource, masterCardKeyAttr;

        public CadImportConfig(EtlLoaderApi api) {
            enableShapeImport = toBooleanOrDefault(api.getConfig("shape_import_enabled"), false);
            shapeImportClassId = api.getConfig("shape_import_target_class");
            shapeAttrName = api.getConfig("shape_import_target_attr");
            shapeImportKeySource = toListOfStrings(api.getConfig("shape_import_key_source"));
            shapeImportKeyAttr = toListOfStrings(api.getConfig("shape_import_key_attr"));
            transformationRules = unpackIfPacked(api.getConfig("shape_import_transformation_rules"));
            targetReferenceSystem = firstNotBlank(api.getConfig("shape_import_target_reference_system"), "EPSG:4326");
            replaceExisting = toBooleanOrDefault(api.getConfig("shape_import_replace_existing"), true);//note: it is necessary to force this if crs changes ! (test & confirm)
            includeLayers = list(toListOfStrings(api.getConfig("shape_import_source_layers_include"))).map(String::toLowerCase).toSet().immutable();
            excludeLayers = list(toListOfStrings(api.getConfig("shape_import_source_layers_exclude"))).map(String::toLowerCase).toSet().immutable();
            if (enableShapeImport) {
                checkNotBlank(shapeImportClassId, "missing target shape class");
                checkNotBlank(shapeAttrName, "missing target cad (shapefile) attr name");
                checkNotEmpty(shapeImportKeySource, "missing shape import key source");
                checkNotEmpty(shapeImportKeyAttr, "missing shape import key attr");
                checkArgument(shapeImportKeySource.size() == shapeImportKeyAttr.size(), "mismatching shape import key source/attrs config");
            }
            MasterCardFilterMode masterCardFilterMode = parseEnumOrDefault(api.getConfig("master_card_filter_mode"), MCFM_FROMSHAPE);
            switch (masterCardFilterMode) {
                case MCFM_DISABLED:
                    enableAutoMasterCardFilter = false;
                    masterCardClassId = null;
                    masterCardKeySource = null;
                    masterCardKeyAttr = null;
                    break;
                case MCFM_CUSTOM:
                    enableAutoMasterCardFilter = true;
                    masterCardClassId = api.getConfig("master_card_target_class");
                    masterCardKeySource = toListOfStrings(api.getConfig("master_card_key_source"));
                    masterCardKeyAttr = toListOfStrings(api.getConfig("master_card_key_attr"));
                    break;
                case MCFM_FROMSHAPE:
                    enableAutoMasterCardFilter = enableShapeImport;
                    masterCardClassId = shapeImportClassId;
                    masterCardKeySource = shapeImportKeySource;
                    masterCardKeyAttr = shapeImportKeyAttr;
                    break;
                default:
                    throw unsupported("unsupported master card filter mode = %s", masterCardFilterMode);
            }
            if (enableAutoMasterCardFilter) {
                checkNotBlank(masterCardClassId, "missing target master card class");
                checkNotEmpty(masterCardKeySource, "missing master card import key source");
                checkNotEmpty(masterCardKeyAttr, "missing master card import key attr");
                checkArgument(masterCardKeySource.size() == masterCardKeyAttr.size(), "mismatching master card import key source/attrs config");
            }
        }

        public List<Pair<String, String>> getShapeImportKeySourceAndAttrs() {
            return zip(shapeImportKeySource, shapeImportKeyAttr, Pair::of);
        }

        public List<Pair<String, String>> getMasterCardKeySourceAndAttrs() {
            return zip(masterCardKeySource, masterCardKeyAttr, Pair::of);
        }

    }

    public enum MasterCardFilterMode {
        MCFM_DISABLED, MCFM_FROMSHAPE, MCFM_CUSTOM
    }

    public static CadPolyline toCadPolyline(Polygon polygon) {
        return new CadPolyline(polygon.getPoints().stream().map(p -> new CadPoint(p.getX(), p.getY())).collect(toImmutableList()));
    }

    public static String buildBoundingBoxStr(double x1, double y1, double x2, double y2) {
        return format("%s,%s,%s,%s", x1, y1, x2, y2);//TODO check this
    }

}
