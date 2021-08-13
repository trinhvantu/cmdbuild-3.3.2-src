package org.cmdbuild.service.rest.v2.utils;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import org.cmdbuild.common.beans.IdAndDescription;

import static org.cmdbuild.dao.utils.AttributeConversionUtils.rawToSystem;
import org.cmdbuild.dao.entrytype.attributetype.CardAttributeType;
import org.cmdbuild.utils.date.CmDateUtils;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import static org.cmdbuild.utils.date.CmDateUtils.systemZoneId;

public class WsAttributeConverterUtilsv2 {

    public static Object toClient(CardAttributeType<?> attributeType, Object value) {
        switch (attributeType.getName()) {
            case DATE:
                return CmDateUtils.toIsoDate(value);
            case TIME:
                return CmDateUtils.toIsoTime(value);
            case TIMESTAMP:
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                ZonedDateTime date = toDateTime(value);
                return date != null ? date.withZoneSameInstant(systemZoneId()).format(formatter) : null;
            case REFERENCE:
            case FOREIGNKEY:
            case LOOKUP:
                return Optional.ofNullable((IdAndDescription) rawToSystem(attributeType, value)).map(IdAndDescription::getId).orElse(null);
            default:
                return value;
        }
    }

}
