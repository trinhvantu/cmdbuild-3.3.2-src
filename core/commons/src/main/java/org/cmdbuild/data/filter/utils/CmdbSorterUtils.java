/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.data.filter.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import static com.google.common.base.Preconditions.checkArgument;
import java.io.IOException;
import static java.util.Collections.emptyList;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.data.filter.CmdbSorter;
import org.cmdbuild.data.filter.SorterElement;
import org.cmdbuild.data.filter.SorterElementDirection;
import org.cmdbuild.data.filter.beans.CmdbSorterImpl;
import org.cmdbuild.data.filter.beans.SorterElementImpl;
import static org.cmdbuild.logic.mapping.json.Constants.DIRECTION_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.PROPERTY_KEY;
import org.cmdbuild.utils.json.CmJsonUtils;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmStringUtils.abbreviate;
import org.json.JSONArray;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.illegalArgument;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;

public class CmdbSorterUtils {

    private final static ObjectMapper MAPPER = CmdbFilterUtils.MAPPER;

    private static final CmdbSorter NOOP_SORTER = new CmdbSorterImpl(emptyList());

    public static CmdbSorter noopSorter() {
        return NOOP_SORTER;
    }

    public static CmdbSorter parseSorter(@Nullable String json) {
        if (isBlank(json)) {
            return NOOP_SORTER;
        } else {
            return fromJson(json);
        }
    }

    public static CmdbSorter fromJson(JSONArray jsonArray) {
        try {
            String json = MAPPER.writeValueAsString(jsonArray);
            return fromJson(json);
        } catch (IOException ex) {
            throw illegalArgument(ex);
        }
    }

    public static CmdbSorter fromJson(String json) {
        try {
            List<Map<String, String>> elements = CmJsonUtils.fromJson(json, CmJsonUtils.LIST_OF_MAP_OF_STRINGS);
            return new CmdbSorterImpl(list(elements).map(e -> {
                String property = firstNotBlank(e.get(PROPERTY_KEY), e.get("attribute"));
                String direction = checkNotBlank(e.get(DIRECTION_KEY)).trim().toLowerCase().replaceAll("ascending", "asc").replaceAll("descending", "desc");
                return new SorterElementImpl(property, parseEnum(direction, SorterElementDirection.class));
            }));
        } catch (Exception ex) {
            throw illegalArgument(ex, "error deserializing json sorter =< %s >", abbreviate(json));
        }
    }

    public static String serializeSorter(@Nullable CmdbSorter sorter) {
        try {
            return MAPPER.writeValueAsString(firstNotNull(sorter, NOOP_SORTER).getElements().stream().map((e) -> map(PROPERTY_KEY, e.getProperty(), DIRECTION_KEY, e.getDirection().name())).collect(toList()));
        } catch (JsonProcessingException ex) {
            throw runtime(ex);
        }
    }

}
