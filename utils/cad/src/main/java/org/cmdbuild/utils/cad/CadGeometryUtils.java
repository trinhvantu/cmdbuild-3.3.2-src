/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad;

import static com.google.common.collect.Iterables.getOnlyElement;
import static java.lang.Math.PI;
import static java.lang.Math.abs;
import static java.lang.Math.cos;
import static java.lang.Math.max;
import static java.lang.Math.min;
import static java.lang.Math.round;
import static java.lang.Math.sin;
import static java.lang.Math.toIntExact;
import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Iterator;
import java.util.List;
import org.cmdbuild.utils.cad.dxfparser.model.DxfArc;
import org.cmdbuild.utils.cad.model.CadPoint;
import static org.cmdbuild.utils.cad.model.CadPoint.point;
import org.cmdbuild.utils.cad.model.CadPolyline;
import org.cmdbuild.utils.cad.model.CadRectangle;
import static org.cmdbuild.utils.cad.model.CadRectangle.rectangle;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.lazyString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CadGeometryUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public static CadPolyline arcToPolyline(DxfArc arc) {
        return arcToPolyline(arc, max(1, toIntExact(round(16 * arc.getAngleWidth() / 360))));
    }

    public static CadPolyline arcToPolyline(DxfArc arc, int n) {
        int start = toIntExact((round(arc.getStartAngle()) + 360) % 360),
                end = toIntExact((round(arc.getEndAngle()) + 360) % 360);
        if (start > end) {
            int x = start;
            start = end;
            end = x;
        }
        LOGGER.trace("convert arc = {} to polilyne with {} points", arc, n);
        List<CadPoint> points = list();
        double step = (end - start) / (double) n;
        for (int i = 0; i <= n; i++) {
            double a = (PI / 2) - (start + i * step) * 2 * PI / 360,
                    x = arc.getCenter().getX() + cos(a) * arc.getRadius(),
                    y = arc.getCenter().getY() + sin(a) * arc.getRadius();
            LOGGER.trace("a = {} x = {} y = {}", a, x, y);
            points.add(point(x, y));
        }
        return new CadPolyline(points);
    }

    public static CadRectangle getBoundingBox(CadPolyline polilyne) {
        return getBoundingBox(polilyne.getVertexes());
    }

    public static CadRectangle getBoundingBox(Iterable<CadPoint> points) {
        return getBoundingBox(points.iterator());
    }

    public static CadRectangle getBoundingBox(Iterator<CadPoint> points) {
        CadPoint point = points.next();
        double minX = point.getX(), minY = point.getY(), maxX = point.getX(), maxY = point.getY();
        while (points.hasNext()) {
            point = points.next();
            minX = min(minX, point.getX());
            minY = min(minY, point.getY());
            maxX = max(maxX, point.getX());
            maxY = max(maxY, point.getY());
        }
        return rectangle(minX, minY, maxX, maxY);

    }

    public static double getSurfaceArea(CadPolyline polyline) {
        return getSurfaceArea(polyline.getVertexes());
    }

    public static double getSurfaceArea(List<CadPoint> vertexes) {
        return abs(getSurfaceAreaSigned(vertexes));
    }

    public static CadPoint getCenter(CadPolyline polyline) {
        return getCenter(polyline.getVertexes());
    }

    public static CadPoint getCenter(List<CadPoint> vertexes) {
        if (vertexes.size() == 1) {
            return getOnlyElement(vertexes);
        } else {
//        double x = 0, y = 0, area6 = getSurfaceAreaSigned(vertexes) * 6;
//        List<CadPoint> list = list(vertexes).with(vertexes.get(0));
//        for (int i = 0; i < list.size() - 1; i++) {
//            x += (list.get(i).getX() + list.get(i + 1).getX()) * (list.get(i).getX() * list.get(i + 1).getY() - list.get(i + 1).getX() * list.get(i).getY());
//            y += (list.get(i).getY() + list.get(i + 1).getY()) * (list.get(i).getX() * list.get(i + 1).getY() - list.get(i + 1).getX() * list.get(i).getY());
//        }
//        CadPoint center = point(x / area6, y / area6);
            BigDecimal x = BigDecimal.ZERO, y = BigDecimal.ZERO, area6 = BigDecimal.valueOf(getSurfaceAreaSigned(vertexes)).multiply(BigDecimal.valueOf(6));
            List<CadPoint> list = list(vertexes).with(vertexes.get(0));
            for (int i = 0; i < list.size() - 1; i++) {
//            x += (list.get(i).getX() + list.get(i + 1).getX()) * (list.get(i).getX() * list.get(i + 1).getY() - list.get(i + 1).getX() * list.get(i).getY());

                BigDecimal xi = BigDecimal.valueOf(list.get(i).getX()),
                        xi1 = BigDecimal.valueOf(list.get(i + 1).getX()),
                        yi = BigDecimal.valueOf(list.get(i).getY()),
                        yi1 = BigDecimal.valueOf(list.get(i + 1).getY());

                x = x.add(xi.add(xi1).multiply(xi.multiply(yi1).subtract(xi1.multiply(yi))));

//            y += (list.get(i).getY() + list.get(i + 1).getY()) * (list.get(i).getX() * list.get(i + 1).getY() - list.get(i + 1).getX() * list.get(i).getY());
                y = y.add(yi.add(yi1).multiply(xi.multiply(yi1).subtract(xi1.multiply(yi))));

            }
            CadPoint center = point(x.divide(area6, RoundingMode.HALF_UP).doubleValue(), y.divide(area6, RoundingMode.HALF_UP).doubleValue());
            LOGGER.debug("center of {} is {}", lazyString(() -> new CadPolyline(vertexes)), center);
            return center;
        }
    }

//    private final static double GEOCALC_SAMPLE_DISTANCE_LAT = 1d, GEOCALC_SAMPLE_DISTANCE_LGT = 1d;
//
//    public static AffineTransform buildTransformationForGeoreferenceMapping(DxfGeoreferenceInfo georeference) {
//        double scaleX = 1, scaleY = 1;
//
//        GeodeticCalculator geoCalc = new GeodeticCalculator();
//        double geocalcScaleLatY = geoCalc.calculateGeodeticMeasurement(Ellipsoid.WGS84, new GlobalPosition(georeference.getLatY(), georeference.getLgtX(), 0), new GlobalPosition(georeference.getLatY() + GEOCALC_SAMPLE_DISTANCE_LAT, georeference.getLgtX(), 0)).getPointToPointDistance() / GEOCALC_SAMPLE_DISTANCE_LAT;
//        double geocalcScaleLgtX = geoCalc.calculateGeodeticMeasurement(Ellipsoid.WGS84, new GlobalPosition(georeference.getLatY(), georeference.getLgtX(), 0), new GlobalPosition(georeference.getLatY(), georeference.getLgtX() + GEOCALC_SAMPLE_DISTANCE_LGT, 0)).getPointToPointDistance() / GEOCALC_SAMPLE_DISTANCE_LGT;
//
//        LOGGER.debug("calculate lgtX scale = {} deg/m", geocalcScaleLgtX);
//        LOGGER.debug("calculate latY scale = {} deg/m", geocalcScaleLatY);
//
//        scaleX *= geocalcScaleLgtX;
//        scaleY *= geocalcScaleLatY;
//
//        scaleX *= georeference.getScale();//TODO check this
//        scaleY *= georeference.getScale();//TODO check this
//
//        AffineTransform transform = new AffineTransform();
//        transform.translate(georeference.getLgtX(), georeference.getLatY());
//        transform.scale(scaleX, scaleY);
//        transform.rotate(Math.PI / 2 - georeference.getNorthDirection());
//        transform.translate(-georeference.getReferenceX(), -georeference.getReferenceY());
//        return transform;
//    }
    private static double getSurfaceAreaSigned(List<CadPoint> vertexes) {
        if (vertexes.size() == 1) {
            return 0;
        } else {
//        double sum = 0;
//        List<CadPoint> list = list(vertexes).with(vertexes.get(0));
//        for (int i = 0; i < list.size() - 1; i++) {
//            sum += list.get(i).getX() * list.get(i + 1).getY() - list.get(i + 1).getX() * list.get(i).getY();
//        }
//        sum = sum / 2;
            BigDecimal sum = BigDecimal.ZERO;
            List<CadPoint> list = list(vertexes).with(vertexes.get(0));
            for (int i = 0; i < list.size() - 1; i++) {
                BigDecimal xi = BigDecimal.valueOf(list.get(i).getX()),
                        xi1 = BigDecimal.valueOf(list.get(i + 1).getX()),
                        yi = BigDecimal.valueOf(list.get(i).getY()),
                        yi1 = BigDecimal.valueOf(list.get(i + 1).getY());
//            sum += list.get(i).getX() * list.get(i + 1).getY() - list.get(i + 1).getX() * list.get(i).getY();
                sum = sum.add(xi.multiply(yi1).subtract(xi1.multiply(yi)));
            }
            sum = sum.divide(BigDecimal.valueOf(2), RoundingMode.HALF_UP);
            LOGGER.debug("surface of {} is {}", lazyString(() -> new CadPolyline(list)), sum);
            return sum.doubleValue();
        }
    }

    public static boolean contains(CadPolyline polyline, CadPoint point) {
        if (polyline instanceof CadRectangle) {
            return contains((CadRectangle) polyline, point);
        } else {
            return contains(getBoundingBox(polyline), point);//TODO improve this
        }//        int count = 0;
//        List<Pair<CadPoint, CadPoint>> lines = IntStream.range(0, polyline.getVertexes().size()).mapToObj(i -> Pair.of(polyline.getVertexes().get(i), polyline.getVertexes().get(i < polyline.getVertexes().size() - 1 ? i + 1 : 0))).collect(toImmutableList());
//        for (Pair<CadPoint, CadPoint> line : lines) {
//            if (!equal(point, line.getLeft())
//                    && max(line.getLeft().getY(), line.getRight().getY()) >= point.getY()
//                    && min(line.getLeft().getY(), line.getRight().getY()) <= point.getY()
//                    && ((point.getX() <= line.getRight().getX() && point.getX() <= line.getLeft().getX())
//                    || ((line.getRight().getX() != line.getLeft().getX()) && (line.getRight().getX() - line.getLeft().getX()) * point.getY() / (line.getRight().getY() - line.getLeft().getY()) >= point.getX()))) {
//                count++;
//            }
//        }
//        return count % 2 == 1;
    }

    public static boolean contains(CadRectangle rectangle, CadPoint point) {
        return isBetween(point.getX(), rectangle.getX1(), rectangle.getX2()) && isBetween(point.getY(), rectangle.getY1(), rectangle.getY2());
    }

    public static boolean isBetween(double x, double a, double b) {
        return (a <= x && x <= b) || (b <= x && x <= a);
    }
}
