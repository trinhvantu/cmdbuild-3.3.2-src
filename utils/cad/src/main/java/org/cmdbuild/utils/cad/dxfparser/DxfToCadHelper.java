/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.cad.dxfparser;

import com.google.common.base.Joiner;
import java.util.List;
import java.util.Map;
import static org.cmdbuild.utils.cad.CadGeometryUtils.getBoundingBox;
import static org.cmdbuild.utils.cad.CadGeometryUtils.getCenter;
import static org.cmdbuild.utils.cad.CadGeometryUtils.getSurfaceArea;
import org.cmdbuild.utils.cad.dxfparser.model.DxfDocument;
import org.cmdbuild.utils.cad.dxfparser.model.DxfEntity;
import org.cmdbuild.utils.cad.model.CadEntity;
import org.cmdbuild.utils.cad.model.CadEntityImpl;
import org.cmdbuild.utils.cad.model.CadPolyline;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.cmdbuild.utils.cad.geo.CadPointTransformationHelper;
import org.cmdbuild.utils.cad.model.CadPoint;
import org.cmdbuild.utils.cad.model.CadRectangle;

public class DxfToCadHelper {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DxfDocument document;
//    private final DxfGeoreferenceInfo georeference;
    private final CadPointTransformationHelper helper;

    private final List<CadEntity> entities = list();

    public DxfToCadHelper(DxfDocument document, String targetCoordinateSystem) {
        this.document = document;
//        checkArgument(document.hasGeoreferenceInfo(), "unable to process dxf document: georeference info not available");
//        georeference = document.getGeoreferenceInfo();
        helper = CadPointTransformationHelper.fromDocument(document, targetCoordinateSystem);
    }

    public List<CadEntity> extractCadEntities() {
        logger.debug("extracting cad entities");
        document.getEntities().forEach(this::handleDxfEntity);
        logger.debug("found {} cad entities", entities.size());
        return entities;
    }

    private void handleDxfEntity(DxfEntity dxf) {
        try {
            logger.debug("processing dxf entity = {}", dxf);
            if (dxf.hasXdata()) {
                Map<String, String> metadata = map(dxf.getXdata().getXdata()).mapValues(l -> Joiner.on(",").join(l));
                CadPolyline cadPerimeter = dxf.getPerimeter();
                logger.debug("found cad entity = {} with perimeter = {}", dxf, cadPerimeter);
                double cadArea = getSurfaceArea(cadPerimeter);
                CadPoint cadCenter = getCenter(cadPerimeter);
                CadPolyline gisPerimeter = new CadPolyline(list(cadPerimeter.getVertexes()).map(helper::cadPointToGeoPoint));
                CadPoint gisCenter = helper.cadPointToGeoPoint(cadCenter);
                CadRectangle gisBoundingBox = getBoundingBox(gisPerimeter);
//                double gisArea = cadArea * georeference.getScale();//TODO check this
                CadEntity cad = CadEntityImpl.builder()
                        .withLayer(dxf.getLayer())
                        .withMetadata(metadata)
                        .withBoundingBox(gisBoundingBox)
                        .withPosition(gisCenter)
                        .withSurface(cadArea)
                        .withPerimeter(gisPerimeter)
                        .build();
                logger.debug("processed cad entity = {}", cad);
                entities.add(cad);
            }
        } catch (Exception ex) {
            logger.error(marker(), "error processing dxf entity = {}", dxf, ex);
        }
    }

}
