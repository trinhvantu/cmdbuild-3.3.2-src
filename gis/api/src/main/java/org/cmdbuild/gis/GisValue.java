package org.cmdbuild.gis;

public interface GisValue<T extends CmGeometry> {

    String getLayerName();

    String getOwnerClassId();

    long getOwnerCardId();

    T getGeometry();

    default GisValueType getType() {
        return getGeometry().getType();
    }

    default <E> E getGeometry(Class<E> type) {
        return (E) getGeometry();
    }

}
