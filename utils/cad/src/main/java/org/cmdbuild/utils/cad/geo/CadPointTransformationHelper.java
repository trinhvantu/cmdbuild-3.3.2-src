/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.geo;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import com.google.common.collect.ImmutableList;
import static com.google.common.collect.Lists.reverse;
import java.awt.geom.AffineTransform;
import static java.lang.Double.parseDouble;
import static java.lang.Math.PI;
import static java.lang.String.format;
import java.lang.invoke.MethodHandles;
import static java.util.Arrays.asList;
import java.util.List;
import java.util.function.Function;
import static java.util.function.Function.identity;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.joining;
import javax.annotation.Nullable;
import org.cmdbuild.utils.cad.dxfparser.model.DxfDocument;
import org.cmdbuild.utils.cad.dxfparser.model.DxfGenericObject;
import org.cmdbuild.utils.cad.dxfparser.model.DxfValue;
import static org.cmdbuild.utils.cad.geo.GeoUtils.translateCoordinates;
import org.cmdbuild.utils.cad.model.CadPoint;
import static org.cmdbuild.utils.cad.model.CadPoint.point;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.abbreviate;
import static org.cmdbuild.utils.xml.CmXmlUtils.applyXpath;
import static org.cmdbuild.utils.xml.CmXmlUtils.isXml;
import static org.cmdbuild.utils.xml.CmXmlUtils.prettifyIfXml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CadPointTransformationHelper {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final List<PointTransformationRule> transformationRules;
    private final Function<CadPoint, CadPoint> function;

    public CadPointTransformationHelper(PointTransformationRule... transformationRules) {
        this(asList(transformationRules));
    }

    public CadPointTransformationHelper(List<PointTransformationRule> transformationRules) {
        this.transformationRules = ImmutableList.copyOf(transformationRules);

        Function<CadPoint, CadPoint> fun = null;

        AffineTransform transform = new AffineTransform();
        for (PointTransformationRule rule : transformationRules) {
            if (rule.isTranslation()) {
                transform.translate(rule.getTranslation().getX(), rule.getTranslation().getY());
            }
            if (rule.isRotation()) {
                transform.rotate(rule.getRotationAngle(), rule.getRotationCenter().getX(), rule.getRotationCenter().getY());
            }
            //TODO handle scaling
            if (rule.isCrs() && !equal(rule.getSourceCoordinateReferenceSystem(), rule.getTargetCoordinateReferenceSystem())) {
                if (!transform.isIdentity()) {
                    fun = append(fun, transform);
                    transform = new AffineTransform();
                }
                fun = append(fun, rule.getSourceCoordinateReferenceSystem(), rule.getTargetCoordinateReferenceSystem());
            }
        }
        if (!transform.isIdentity()) {
            fun = append(fun, transform);
        }
        this.function = firstNotNull(fun, identity());
    }

    public List<PointTransformationRule> getTransformationRules() {
        return transformationRules;
    }

    public CadPointTransformationHelper appendRule(PointTransformationRule rule) {
        return new CadPointTransformationHelper(list(transformationRules).with(rule));
    }

    public CadPointTransformationHelper prependRule(PointTransformationRule rule) {
        return new CadPointTransformationHelper(list(rule).with(transformationRules));
    }

    private static Function<CadPoint, CadPoint> append(Function<CadPoint, CadPoint> fun, AffineTransform t) {
        if (fun == null) {
            return p -> p.transform(t);
        } else {
            return p -> fun.apply(p).transform(t);
        }
    }

    private static Function<CadPoint, CadPoint> append(Function<CadPoint, CadPoint> fun, String sourceReferenceCoordinateSystem, String targetReferenceCoordinateSystem) {
        if (fun == null) {
            return p -> translateCoordinates(p, sourceReferenceCoordinateSystem, targetReferenceCoordinateSystem);
        } else {
            return p -> translateCoordinates(fun.apply(p), sourceReferenceCoordinateSystem, targetReferenceCoordinateSystem);
        }
    }

    public static CadPointTransformationHelper fromDocument(DxfDocument document) {
        return fromDocument(document, null);
    }

    public static CadPointTransformationHelper fromDocument(DxfDocument document, @Nullable String targetCoordinateSystem) {
        try {
            DxfGenericObject geodata = document.getObjectByType("GEODATA");

            int cxType = geodata.getValue(70).getValueAsInt();
//        /**
//         * < pre>
//         * 70 Tipi di coordinate di progettazione:
//         * 0 - Sconosciuto
//         * 1 - Griglia locale
//         * 2 - Griglia proiettata
//         * 3 - Geografico (latitudine/longitudine)
//         *
//         * 40	Scala unità orizzontale, fattore che converte le coordinate di progettazione orizzontali in metri tramite moltiplicazione.
//         * 41	Scala unità verticale, fattore che converte le coordinate di progettazione verticali in metri tramite moltiplicazione.   
//         *
//         * 95
//         * Metodo di valutazione della scala:
//         * 1 - Nessuno
//         * 2 - Fattore di scala specificato dall'utente
//         * 3 - Scala griglia in corrispondenza del punto di riferimento
//         * 4 - Prismoidale
//         * </pre>
//         */

//$LATITUDE
// 40
//46.10826
//  9
//$LONGITUDE
// 40
//13.224656
            checkArgument(cxType == 1, "unsupported geodata cx type = %s", cxType);

            String geodataPayload = geodata.getValues().stream().filter(g -> g.getGroupCode() == 303 || g.getGroupCode() == 301).map(DxfValue::getValue).collect(joining("")).replaceAll(Pattern.quote("^J"), "");
            LOGGER.debug("geodata payload = \n\n{}\n", prettifyIfXml(geodataPayload));

            checkArgument(isXml(geodataPayload), "unsupported geodata payload format, payload =< %s >", abbreviate(geodataPayload));
            String sourceCoordinateSystem = "EPSG:" + checkNotBlank(applyXpath(geodataPayload, map("g", "http://www.osgeo.org/mapguide/coordinatesystem"), "/g:Dictionary/g:Alias[@type='CoordinateSystem']/@id"));
            LOGGER.debug("coordinate system =< {} >", sourceCoordinateSystem);

            CadPoint referencePointInLocalCoordinateSystem = point(geodata.getValue(10).getValueAsDouble(), geodata.getValue(20).getValueAsDouble());

//            CadPoint referencePointInSourceCoordinateSystem = point(geodata.getValue(11).getValueAsDouble(), geodata.getValue(21).getValueAsDouble()); //TODO there is an error in reference point from cad (off by a small distance)
            CadPoint rawLatLgxValues = point(parseDouble(document.getHeaderVariables().get("$LONGITUDE").getStringValue()), parseDouble(document.getHeaderVariables().get("$LATITUDE").getStringValue()));
            CadPoint referencePointInSourceCoordinateSystem = translateCoordinates(rawLatLgxValues, "EPSG:4326", sourceCoordinateSystem);

            List<PointTransformationRule> transformationRules = list();

            double north = parseDouble(document.getHeaderVariables().get("$NORTHDIRECTION").getStringValue());

            if (north != 0) {
                double theta = north;
                LOGGER.debug("add rotation transform for angle = {} (north is {} )", theta, north * 180 / PI);
                transformationRules.add(PointTransformationRuleImpl.rotation(theta, referencePointInSourceCoordinateSystem.getX(), referencePointInSourceCoordinateSystem.getY()));
            }

            CadPoint offset = referencePointInSourceCoordinateSystem.getOffsetFrom(referencePointInLocalCoordinateSystem);
            if (!offset.isZero()) {
                transformationRules.add(PointTransformationRuleImpl.translation(offset));
            }

            LOGGER.debug("local point = {}, src cs point = {}, offset = {}", referencePointInLocalCoordinateSystem, referencePointInSourceCoordinateSystem, offset);

            targetCoordinateSystem = firstNotBlank(targetCoordinateSystem, sourceCoordinateSystem);

            transformationRules.add(PointTransformationRuleImpl.rcs(sourceCoordinateSystem, targetCoordinateSystem));

            return new CadPointTransformationHelper(transformationRules);

        } catch (Exception ex) {
            throw runtime(ex);
        }
    }

    @Override
    public String toString() {
        return "CadPointTransformationHelper{" + transformationRules.stream().map(r -> {
            if (r.isTranslation()) {
                return format("offset %s", r.getTranslation());
            } else if (r.isRotation()) {
                return format("rotate %s around %s", r.getRotationAngle(), r.getRotationCenter());
            } else if (r.isScaling()) {
                return format("scale %s around %s", r.getScaling(), r.getScalingCenter());
            } else if (r.isCrs()) {
                return format("crs %s to %s", r.getSourceCoordinateReferenceSystem(), r.getTargetCoordinateReferenceSystem());
            } else {
                return "(identity)";
            }
        }).collect(joining(", ")) + '}';
    }

//    public CadPointTransformationHelper(DxfDocument document) {
//        this(document, null);
//    }
//
//    public CadPointTransformationHelper(DxfDocument document, @Nullable String targetCoordinateSystem) {
//        try {
//            DxfGenericObject geodata = document.getObjectByType("GEODATA");
//
//            int cxType = geodata.getValue(70).getValueAsInt();
////        /**
////         * < pre>
////         * 70 Tipi di coordinate di progettazione:
////         * 0 - Sconosciuto
////         * 1 - Griglia locale
////         * 2 - Griglia proiettata
////         * 3 - Geografico (latitudine/longitudine)
////         *
////         * 40	Scala unità orizzontale, fattore che converte le coordinate di progettazione orizzontali in metri tramite moltiplicazione.
////         * 41	Scala unità verticale, fattore che converte le coordinate di progettazione verticali in metri tramite moltiplicazione.   
////         *
////         * 95
////         * Metodo di valutazione della scala:
////         * 1 - Nessuno
////         * 2 - Fattore di scala specificato dall'utente
////         * 3 - Scala griglia in corrispondenza del punto di riferimento
////         * 4 - Prismoidale
////         * </pre>
////         */
//
////$LATITUDE
//// 40
////46.10826
////  9
////$LONGITUDE
//// 40
////13.224656
//            checkArgument(cxType == 1, "unsupported geodata cx type = %s", cxType);
//
//            String coodinateSystemXml = geodata.getValues().stream().filter(g -> g.getGroupCode() == 303 || g.getGroupCode() == 301).map(DxfValue::getValue).collect(joining("")).replaceAll(Pattern.quote("^J"), "");
//            LOGGER.debug("geo xml = \n\n{}\n", prettifyIfXml(coodinateSystemXml));
//
//            sourceCoordinateSystem = "EPSG:" + checkNotBlank(applyXpath(coodinateSystemXml, map("g", "http://www.osgeo.org/mapguide/coordinatesystem"), "/g:Dictionary/g:Alias[@type='CoordinateSystem']/@id"));
//            LOGGER.debug("coordinate system =< {} >", sourceCoordinateSystem);
//
//            CadPoint referencePointInLocalCoordinateSystem = point(geodata.getValue(10).getValueAsDouble(), geodata.getValue(20).getValueAsDouble());
//
////            CadPoint rawLatLgxValues = point(geodata.getValue(11).getValueAsDouble(), geodata.getValue(21).getValueAsDouble()); TODO there is an error in reference point from cad (off by a small distance), so we can't use these
//            CadPoint rawLatLgxValues = point(parseDouble(document.getHeaderVariables().get("$LONGITUDE").getStringValue()), parseDouble(document.getHeaderVariables().get("$LATITUDE").getStringValue()));
//
//            CadPoint referencePointInSourceCoordinateSystem = translateCoordinates(rawLatLgxValues, "EPSG:4326", sourceCoordinateSystem);
//
//            transform = new AffineTransform();
//
//            double north = parseDouble(document.getHeaderVariables().get("$NORTHDIRECTION").getStringValue());
//
//            if (north != 0) {
//                double theta = north;
//                LOGGER.debug("add rotation transform for angle = {} (north is {} )", theta, north * 180 / PI);
//                transform.rotate(theta, referencePointInSourceCoordinateSystem.getX(), referencePointInSourceCoordinateSystem.getY());
//            }
//
//            CadPoint offset = referencePointInSourceCoordinateSystem.getOffsetFrom(referencePointInLocalCoordinateSystem);
//            transform.translate(offset.getX(), offset.getY());
//
//            LOGGER.debug("local point = ({}, {}), src cs point = {}, offset = {}", referencePointInLocalCoordinateSystem, referencePointInSourceCoordinateSystem, offset);
//
//            this.targetCoordinateSystem = firstNotBlank(targetCoordinateSystem, sourceCoordinateSystem);
//
//        } catch (Exception ex) {
//            throw runtime(ex);
//        }
//    }
    public String getDocumentCoordinateSystem() {
        return transformationRules.stream().filter(r -> isNotBlank(r.getSourceCoordinateReferenceSystem())).findFirst().get().getSourceCoordinateReferenceSystem();
    }
//

    public String getTargetCoordinateSystem() {
        return reverse(transformationRules).stream().filter(r -> isNotBlank(r.getTargetCoordinateReferenceSystem())).findFirst().get().getTargetCoordinateReferenceSystem();
    }

    public CadPoint cadPointToGeoPoint(CadPoint cadPoint) {
        LOGGER.trace("converting source point = {}", cadPoint);
        CadPoint geoPoint = function.apply(cadPoint);
        LOGGER.trace("target point = {}", geoPoint);
        return geoPoint;
    }
}
