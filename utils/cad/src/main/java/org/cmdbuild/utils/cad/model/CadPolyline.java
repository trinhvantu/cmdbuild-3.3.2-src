/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.model;

import com.google.common.base.Joiner;
import static com.google.common.base.Preconditions.checkArgument;
import com.google.common.collect.ImmutableList;
import java.util.List;
import org.cmdbuild.utils.cad.CadGeometryUtils;

public class CadPolyline {

    private final List<CadPoint> vertexes;

    public CadPolyline(CadPoint... vertexes) {
        this(ImmutableList.copyOf(vertexes));
    }

    public CadPolyline(List<CadPoint> vertexes) {
        this.vertexes = ImmutableList.copyOf(vertexes);
        checkArgument(!vertexes.isEmpty(), "invalid polyline: vertex list is empty");
    }

    public List<CadPoint> getVertexes() {
        return vertexes;
    }

    @Override
    public String toString() {
        return "CadPolyline{" + Joiner.on(", ").join(vertexes) + '}';
    }

    public boolean contains(CadPoint point) {
        return CadGeometryUtils.contains(this, point);
    }

    public boolean contains(CadPolyline perimeter) {
        return perimeter.getVertexes().stream().allMatch(this::contains);
    }

    public boolean isPoint() {
        return vertexes.size() == 1;
    }

}
