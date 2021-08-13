/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.geo;

import com.google.common.base.Predicates;
import static com.google.common.collect.Iterables.getOnlyElement;
import java.io.File;
import java.io.IOException;
import java.util.function.Predicate;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.io.FileUtils.deleteQuietly;
import org.cmdbuild.utils.cad.dxfparser.CadException;
import org.cmdbuild.utils.cad.dxfparser.model.DxfDocument;
import org.cmdbuild.utils.cad.dxfparser.model.DxfEntity;
import org.cmdbuild.utils.cad.dxfparser.model.DxfPolilyne;
import org.cmdbuild.utils.io.BigByteArray;
import static org.cmdbuild.utils.io.CmIoUtils.tempDir;
import static org.cmdbuild.utils.io.CmZipUtils.dirToZip;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.geotools.data.DefaultTransaction;
import org.geotools.data.Transaction;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.data.simple.SimpleFeatureStore;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.geotools.referencing.CRS;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.List;
import static java.util.function.Predicate.not;
import static org.cmdbuild.utils.cad.geo.GeoUtils.serializeTransformationRules;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;

public class DxfToShapefileHelper {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DxfDocument document;
    private final Predicate<DxfEntity> entityFilter;
    private final CadPointTransformationHelper helper;

    private DxfToShapefileHelper(DxfToShapefileHelperBuilder builder) {
        this.document = checkNotNull(builder.document);
        this.entityFilter = firstNotNull(builder.entityFilter, Predicates.alwaysTrue());
        helper = builder.transformationRules == null ? CadPointTransformationHelper.fromDocument(document, builder.targetReferenceSystem) : new CadPointTransformationHelper(builder.transformationRules);
    }

    public DxfDocument getDocument() {
        return document;
    }

    public Predicate<DxfEntity> getEntityFilter() {
        return entityFilter;
    }

    public BigByteArray toShapeFile() {
        try {
            logger.debug("start conversion of dxf content to shape file, using helper = {}", helper);
            logger.debug("transformation rules = {}", serializeTransformationRules(helper.getTransformationRules()));
            String targetReferenceSystem = helper.getTargetCoordinateSystem();
            CoordinateReferenceSystem crs = CRS.decode(targetReferenceSystem);

            SimpleFeatureTypeBuilder builder = new SimpleFeatureTypeBuilder();
            builder.setName("MyFeature");
            builder.setCRS(crs);
            builder.add("the_geom", LineString.class);
            SimpleFeatureType MY_FEATURE_TYPE = builder.buildFeatureType();

            DefaultFeatureCollection featureCollection = new DefaultFeatureCollection();
            GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory(null);

            document.getEntities().stream().filter(entityFilter).filter(DxfPolilyne.class::isInstance).map(DxfPolilyne.class::cast).filter(not(DxfPolilyne::isPoint)).map(e -> {
                logger.trace("add feature from entity = {}", e);
                SimpleFeatureBuilder featureBuilder = new SimpleFeatureBuilder(MY_FEATURE_TYPE);
                LineString lineString = geometryFactory.createLineString(list(e.getPolilyne().getVertexes()).accept(l -> {
                    if (e.isClosedPerimeter()) {
                        l.add(e.getPolilyne().getVertexes().iterator().next());
                    }
                }).stream().map(helper::cadPointToGeoPoint).map(p -> new Coordinate(p.getX(), p.getY())).collect(toList()).toArray(new Coordinate[]{}));
                featureBuilder.add(lineString);
                return featureBuilder.buildFeature(null);
            }).forEach(featureCollection::add);

            logger.debug("processed {} features; build shape file", featureCollection.size());

            File dir = tempDir(), file = new File(dir, "file.shp");
            try {
                ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();
                ShapefileDataStore dataStore = (ShapefileDataStore) dataStoreFactory.createNewDataStore(map(
                        "url", file.toURI().toURL(),
                        "create spatial index", Boolean.TRUE
                ));
                dataStore.createSchema(MY_FEATURE_TYPE);
                dataStore.forceSchemaCRS(crs);
                try (Transaction transaction = new DefaultTransaction("create")) {
                    String typeName = getOnlyElement(list(dataStore.getTypeNames()));
                    SimpleFeatureStore featureStore = (SimpleFeatureStore) dataStore.getFeatureSource(typeName);
                    featureStore.setTransaction(transaction);
                    featureStore.addFeatures(featureCollection);
                    transaction.commit();
                }

                return new BigByteArray(dirToZip(dir));
            } finally {
                deleteQuietly(dir);
            }
        } catch (FactoryException | IOException ex) {
            throw new CadException(ex);
        }
    }

    public static DxfToShapefileHelperBuilder builder() {
        return new DxfToShapefileHelperBuilder();
    }

    public static DxfToShapefileHelperBuilder withDocument(DxfDocument dxfDocument) {
        return builder().withDocument(dxfDocument);
    }

    public static BigByteArray toShapeFile(DxfDocument dxfDocument) {
        return withDocument(dxfDocument).toShapeFile();
    }

    public static class DxfToShapefileHelperBuilder implements Builder<DxfToShapefileHelper, DxfToShapefileHelperBuilder> {

        private DxfDocument document;
        private Predicate<DxfEntity> entityFilter;
        private String targetReferenceSystem;
        private List<PointTransformationRule> transformationRules;

        public DxfToShapefileHelperBuilder withDocument(DxfDocument document) {
            this.document = document;
            return this;
        }

        public DxfToShapefileHelperBuilder withEntityFilter(Predicate<DxfEntity> entityFilter) {
            this.entityFilter = entityFilter;
            return this;
        }

        public DxfToShapefileHelperBuilder withTransformationRules(List<PointTransformationRule> transformationRules) {
            this.transformationRules = transformationRules;
            return this;
        }

        public DxfToShapefileHelperBuilder withTargetReferenceSystem(String targetReferenceSystem) {
            this.targetReferenceSystem = targetReferenceSystem;
            return this;
        }

        @Override
        public DxfToShapefileHelper build() {
            return new DxfToShapefileHelper(this);
        }

        public BigByteArray toShapeFile() {
            return build().toShapeFile();
        }

    }
}
