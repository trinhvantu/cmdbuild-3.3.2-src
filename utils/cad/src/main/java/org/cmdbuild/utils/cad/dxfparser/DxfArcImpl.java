/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.dxfparser;

import static com.google.common.base.Preconditions.checkNotNull;
import org.cmdbuild.utils.cad.dxfparser.model.DxfArc;
import org.cmdbuild.utils.cad.dxfparser.model.DxfExtendedData;
import org.cmdbuild.utils.cad.model.CadPoint;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

public class DxfArcImpl implements DxfArc {

    private final CadPoint center;
    private final double startAngle;
    private final double endAngle;
    private final double radius;
    private final String layer;
    private final DxfExtendedData xdata;

    public DxfArcImpl(CadPoint center, Double startAngle, Double endAngle, Double radius, String layer, DxfExtendedData xdata) {
        this.center = checkNotNull(center);
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.radius = radius;
        this.layer = checkNotBlank(layer);
        this.xdata = checkNotNull(xdata);
    }

    @Override
    public CadPoint getCenter() {
        return center;
    }

    @Override
    public double getStartAngle() {
        return startAngle;
    }

    @Override
    public double getEndAngle() {
        return endAngle;
    }

    @Override
    public double getRadius() {
        return radius;
    }

    @Override
    public String getLayer() {
        return layer;
    }

    @Override
    public String getType() {
        return "ARC";
    }

    @Override
    public DxfExtendedData getXdata() {
        return xdata;
    }

    @Override
    public String toString() {
        return "DxfArc{" + "center=" + center + ", startAngle=" + startAngle + ", endAngle=" + endAngle + ", radius=" + radius + '}';
    }

}
