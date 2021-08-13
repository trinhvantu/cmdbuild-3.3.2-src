package org.cmdbuild.gis;

import java.util.Collection;
import java.util.List;
import javax.annotation.Nullable;
import org.cmdbuild.navtree.NavTreeNode;

public interface GisValueRepository {

    void createGisTable(GisAttribute layerMetadata);

    void deleteGisTable(String targetClassName, String geoAttributeName);

    void setGisValue(GisAttribute layerMetaData, String value, long ownerCardId);

    GisValue getGisValueOrNull(GisAttribute layerMetaData, long ownerCardId);

    List<GisValue> readGeoFeatures(GisAttribute layerMetaData, String bbox);

    void deleteGisValue(GisAttribute layerMetaData, long ownerCardId);

    void checkGisSchemaAndCreateIfMissing();

    List<GisValue> getGisValues(Iterable<Long> layers, String bbox);

    GisValuesAndNavTree getGeoValuesAndNavTree(Iterable<Long> layers, String bbox, NavTreeNode navTreeDomains);

    @Nullable
    Area getAreaForValues(Collection<Long> attrs);

    boolean isGisSchemaOk();

}
