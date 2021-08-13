package org.cmdbuild.gis;

import java.time.ZonedDateTime;
import javax.annotation.Nullable;

public interface GeoserverLayer {

    final String GEOSERVER_LAYER_ATTR_ATTRIBUTE_NAME = "Attribute", GEOSERVER_LAYER_ATTR_OWNER_CLASS = "OwnerClass", GEOSERVER_LAYER_ATTR_OWNER_CARD = "OwnerCard";

    @Nullable
    Long getId();

    String getOwnerClass();

    String getAttributeName();

    long getOwnerCard();

    String getGeoserverStore();

    String getGeoserverLayer();

    ZonedDateTime getBeginDate();

    default boolean hasId() {
        return getId() != null;
    }
}
