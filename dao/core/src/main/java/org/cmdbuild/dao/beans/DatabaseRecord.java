package org.cmdbuild.dao.beans;

import static com.google.common.collect.Streams.stream;
import java.time.ZonedDateTime;
import java.util.Map;
import java.util.Map.Entry;
import javax.annotation.Nullable;
import org.cmdbuild.dao.entrytype.Attribute;

import org.cmdbuild.utils.lang.CmMapUtils;
import org.cmdbuild.dao.entrytype.EntryType;

public interface DatabaseRecord extends DatabaseRecordValues {

    EntryType getType();

    @Nullable
    Long getId();

    String getUser();

    @Nullable
    ZonedDateTime getBeginDate();

    @Nullable
    ZonedDateTime getEndDate();

    Iterable<Entry<String, Object>> getRawValues();

    @Nullable
    default Long getCurrentId() {
        return null;//TODO
    }

    @Nullable
    default Long getTenantId() {
        return null;//TODO implement everywhere, remove default from here
    }

    default Map<String, Object> getAllValuesAsMap() {
        return stream(getRawValues()).collect(CmMapUtils.toMap(Entry::getKey, Entry::getValue));
    }

    default boolean hasValueForAttribute(Attribute a) {
        return hasValue(a.getName());
    }

    default boolean hasValue(String key) {
        return getAllValuesAsMap().containsKey(key);
    }

}
