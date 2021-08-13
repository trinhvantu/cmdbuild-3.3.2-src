/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.dxfparser.model;

import static java.lang.Math.abs;
import static org.cmdbuild.utils.cad.CadGeometryUtils.arcToPolyline;
import org.cmdbuild.utils.cad.model.CadPoint;
import org.cmdbuild.utils.cad.model.CadPolyline;

public interface DxfArc extends DxfEntity {

    CadPoint getCenter();

    double getStartAngle();

    double getEndAngle();

    double getRadius();

    default double getAngleWidth() {
        return abs(getEndAngle() - getStartAngle());
    }

    @Override
    default boolean isClosedPerimeter() {
        return false;
    }

    @Override
    default CadPolyline getPerimeter() {
        return arcToPolyline(this);
    }

}
