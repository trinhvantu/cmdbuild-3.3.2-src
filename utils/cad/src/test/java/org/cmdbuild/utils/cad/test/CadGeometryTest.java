/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.test;

import static org.cmdbuild.utils.cad.CadGeometryUtils.arcToPolyline;
import static org.cmdbuild.utils.cad.CadGeometryUtils.getCenter;
import static org.cmdbuild.utils.cad.CadGeometryUtils.getSurfaceArea;
import org.cmdbuild.utils.cad.dxfparser.DxfArcImpl;
import org.cmdbuild.utils.cad.dxfparser.model.DxfExtendedData;
import static org.cmdbuild.utils.cad.geo.GeoUtils.translateCoordinates;
import org.cmdbuild.utils.cad.model.CadPoint;
import static org.cmdbuild.utils.cad.model.CadPoint.point;
import org.cmdbuild.utils.cad.model.CadPolyline;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import org.junit.Ignore;
import org.junit.Test;
import static org.mockito.Mockito.mock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CadGeometryTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private static final double EXPECTED_COORDS_PRECISION = 0.00000001d;

    @Test
    public void testArcToPolilyne() {
        CadPolyline polyline = arcToPolyline(new DxfArcImpl(point(10, 10), 90d, 270d, 5d, "_", mock(DxfExtendedData.class)));
        assertEquals(9, polyline.getVertexes().size());
        assertPointEquals(15, 10, polyline.getVertexes().get(0));
        assertPointEquals(10, 5, polyline.getVertexes().get(4));
        assertPointEquals(5, 10, polyline.getVertexes().get(8));
    }

    @Test
    public void testSurfaceArea() {
        assertEquals(4d, getSurfaceArea(list(point(0, 0), point(2, 0), point(2, 2), point(0, 2))), 0d);
        assertEquals(4d, getSurfaceArea(list(point(0, 0), point(2, 0), point(2, -2), point(0, -2))), 0d);
        assertEquals(2d, getSurfaceArea(list(point(1, 1), point(3, 1), point(2, 3))), 0d);
        assertEquals(2d, getSurfaceArea(list(point(-1, -1), point(-3, -1), point(-2, -3))), 0d);
    }

    @Test
    public void testSurfaceCenter() {
        assertEquals(point(1, 1), getCenter(list(point(0, 0), point(2, 0), point(2, 2), point(0, 2))));
        assertEquals(point(1, -1), getCenter(list(point(0, 0), point(2, 0), point(2, -2), point(0, -2))));
        assertEquals(point(1, 1), getCenter(list(point(1, 0), point(2, 1), point(1, 2), point(0, 1))));
        assertEquals(point(5, 2), getCenter(list(point(0, 0), point(10, 0), point(10, 4), point(0, 4))));
        assertEquals(point(5, 2), getCenter(list(point(0, 0), point(5, 0), point(10, 0), point(10, 4), point(0, 4))));
        assertEquals(point(5, 2), getCenter(list(point(0, 0), point(5, -1), point(10, 0), point(10, 4), point(5, 5), point(0, 4))));
    }

    @Test
    public void testSurfaceCenter2() {
        assertEquals(point(497.0, 769.5), getCenter(list(point(494, 770), point(499, 772), point(500, 769), point(495, 767), point(494, 770))));
        assertEquals(point(1826497.0, 5114769.5), getCenter(list(point(1826494, 5114770), point(1826499, 5114772), point(1826500, 5114769), point(1826495, 5114767), point(1826494, 5114770))));
        assertEquals(point(1826497.6443894939, 5114770.004723317), getCenter(list(point(1826494.411900759, 5114770.752614592), point(1826499.869885937, 5114772.465519025), point(1826500.876914242, 5114769.256731966), point(1826495.418718099, 5114767.544013962), point(1826494.411900759, 5114770.752614592))));
    }

    @Test
    public void testLatLgtTranslation() {
        CadPoint geoPoint = translateCoordinates(point(1826509.784953265, 5114776.001876457), "EPSG:3003", "EPSG:4326");
        assertPointEquals(13.22466120611643, 46.10824249099204, geoPoint);
        geoPoint = translateCoordinates(point(2382803.698433392, 5107621.183275111), "EPSG:3004", "EPSG:4326");
        assertPointEquals(13.22461708981794, 46.108208077422404, geoPoint);

//        geoPoint = translateCoordinates(point(1826505.319974108, 5114760.736766426), "EPSG:3003", "EPSG:4326");
    }

    @Test
    public void testContains1() {
        assertTrue(new CadPolyline(point(0, 0), point(2, 0), point(2, 2), point(0, 2)).contains(point(1, 1)));
        assertFalse(new CadPolyline(point(0, 0), point(2, 0), point(2, 2), point(0, 2)).contains(point(1, 3)));
        assertFalse(new CadPolyline(point(0, 0), point(2, 0), point(2, 2), point(0, 2)).contains(point(3, 3)));
        assertFalse(new CadPolyline(point(0, 0), point(2, 0), point(2, 2), point(0, 2)).contains(point(3, 1)));
        assertFalse(new CadPolyline(point(0, 0), point(2, 0), point(2, 2), point(0, 2)).contains(point(-1, -1)));
        assertFalse(new CadPolyline(point(0, 0), point(2, 0), point(2, 2), point(0, 2)).contains(point(-1, 1)));
        assertFalse(new CadPolyline(point(0, 0), point(2, 0), point(2, 2), point(0, 2)).contains(point(1, -1)));
    }

    @Test
    @Ignore //TODO fix this
    public void testContains2() {
        assertTrue(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(1, 1)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(0, 0)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(0, 2)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(2, 0)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(2, 2)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(1, 3)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(3, 1)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(-1, 1)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(1, -1)));
        assertFalse(new CadPolyline(point(1, 0), point(2, 1), point(1, 2), point(0, 1)).contains(point(-1, -1)));
    }

//    @Test
//    public void testGeoreferencePoint1() {
//        CadPoint cadPoint = point(1826494.5439573862, 5114779.883680188);//R01
//        DxfGeoreferenceInfo georeference = new DxfGeoreferenceInfoImpl(1826509.784953265, 5114776.001876457, 2382803.698433392, 5107621.183275111, PI / 2, 1, "EPSG:3004");
//        GeoReferenceHelper helper = new GeoReferenceHelper(georeference);
//        CadPoint gisPoint = helper.cadPointToGeoPoint(cadPoint);
//        logger.info("translate point {} -> {}", cadPoint, gisPoint);
//        assertPointEquals(13.224419953868079, 46.108243000184075, gisPoint);
//    }
//
//    @Test
//    public void testGeoreferencePoint2() {
//        CadPoint cadPoint = point(1826497.6443894939, 5114770.004723317);//  [R05] 
//        DxfGeoreferenceInfo georeference = new DxfGeoreferenceInfoImpl(1826509.784953265, 5114776.001876457, 2382803.698433392, 5107621.183275111, PI / 2, 1, "EPSG:3004");
//        GeoReferenceHelper helper = new GeoReferenceHelper(georeference);
//        CadPoint gisPoint = helper.cadPointToGeoPoint(cadPoint);
//        logger.info("translate point {} -> {}", cadPoint, gisPoint);
//        assertPointEquals(13.224460056921714, 46.10815412348654, gisPoint);
//    }
//    @Test
//    public void testLatLgtTranslation() {
////        DxfValue{groupCode=10, value=1826509.784953265}
////	DxfValue{groupCode=20, value=5114776.001876457}
////	DxfValue{groupCode=30, value=0.0}
////	DxfValue{groupCode=11, value=2382803.698433392}
////	DxfValue{groupCode=21, value=5107621.183275111}
////DxfValue{groupCode=302, value=<georss:point>46.1083 13.2247</georss:point>}		
//
////$LATITUDE                 (org.cmdbuild.utils.cad.dxfparser.model.DxfVariableImpl) = DxfVariable{key=$LATITUDE, values=[DxfValue{groupCode=40, value=46.10826}]} 
////		$LONGITUDE                (org.cmdbuild.utils.cad.dxfparser.model.DxfVariableImpl) = DxfVariable{key=$LONGITUDE, values=[DxfValue{groupCode=40, value=13.224656}]} 
////        CadPoint cadPoint = point(1826509.784953265, 5114776.001876457);
////[R01] position = (1826497.8336046669, 5114789.096052096)
////        CadPoint cadPoint = point(1826497.8336046669, 5114789.096052096);
//        CadPoint cadPoint = point(2382803.698433392, 5107621.183275111);
////        CadPoint cadPoint = point(5107621.183275111, 2382803.698433392);
//
//        CadPoint geoPoint = translateCoordinates(cadPoint, "EPSG:3004", "EPSG:4326");
////        CadPoint geoPoint = translateCoordinates(cadPoint, "EPSG:MonteMario_1.Italy-2", "EPSG:4326");
//        assertPointEquals(13.22461708981794, 46.108208077422404, geoPoint);
//    }
    private static void assertPointEquals(double expectedX, double expectedY, CadPoint point) {
        assertEquals(expectedX, point.getX(), EXPECTED_COORDS_PRECISION);
        assertEquals(expectedY, point.getY(), EXPECTED_COORDS_PRECISION);
    }

//    private String lat
}
