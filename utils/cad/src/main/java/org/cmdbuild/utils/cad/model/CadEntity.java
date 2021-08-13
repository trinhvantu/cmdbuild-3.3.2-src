/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.model;

import java.util.Map;

public interface CadEntity {

    String getLayer();

    Map<String, String> getMetadata();

    CadPoint getPosition();

    CadPolyline getPerimeter();

    CadRectangle getBoundingBox();

    double getSurface();

    default boolean contains(CadEntity other) {
        return getPerimeter().contains(other.getPerimeter());
    }

}
