/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.json;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.collect.MoreCollectors.onlyElement;
import com.google.gson.JsonElement;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import static java.lang.String.format;
import java.lang.invoke.MethodHandles;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import static java.util.Arrays.stream;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import org.apache.commons.lang3.EnumUtils;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CmJsonUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public final static TypeReference<List<Map<String, String>>> LIST_OF_MAP_OF_STRINGS = new TypeReference<List<Map<String, String>>>() {
    };
    public final static TypeReference<List<Map<String, Object>>> LIST_OF_MAP_OF_OBJECTS = new TypeReference<List<Map<String, Object>>>() {
    };
    public final static TypeReference<Map<String, String>> MAP_OF_STRINGS = new TypeReference<Map<String, String>>() {
    };
    public final static TypeReference<List<String>> LIST_OF_STRINGS = new TypeReference<List<String>>() {
    };

    public final static TypeReference<Map<String, Object>> MAP_OF_OBJECTS = new TypeReference<Map<String, Object>>() {
    };

    private final static ObjectMapper OBJECT_MAPPER = createObjectMapper(false), OBJECT_MAPPER_PRETTY = createObjectMapper(true);

    public static <T> T fromHjson(String json, Class<T> classe) {
        return fromJson(org.hjson.JsonValue.readHjson(json).toString(), classe);
    }

    public static <T> T fromHjson(String json, TypeReference<T> type) {
        return fromJson(org.hjson.JsonValue.readHjson(json).toString(), type);
    }

    public static <T> T fromHjson(byte[] json, Class<T> classe) {
        return fromHjson(new ByteArrayInputStream(json), classe);
    }

    public static <T> T fromHjson(byte[] json, TypeReference<T> type) {
        return fromHjson(new ByteArrayInputStream(json), type);
    }

    public static <T> T fromHjson(InputStream in, Class<T> classe) {
        try {
            return fromJson(org.hjson.JsonValue.readHjson(new InputStreamReader(in)).toString(), classe);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromHjson(InputStream in, TypeReference<T> type) {
        try {
            return (T) fromJson(org.hjson.JsonValue.readHjson(new InputStreamReader(in)).toString(), type);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromJson(String json, Class<T> classe) {
        try {
            if (hasJsonBeanAnnotation(classe)) {
                classe = getJsonBeanTargetClass(classe);
            }
            return OBJECT_MAPPER.readValue(json, classe);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromJson(String json, Type type) {//TODO add test for this
        try {
            return OBJECT_MAPPER.readValue(json, new TypeReference<List<String>>() {//dummy types
                @Override
                public Type getType() {
                    return type;//actual type
                }

            });
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromJson(byte[] json, Class<T> classe) {
        try {
            if (hasJsonBeanAnnotation(classe)) {
                classe = getJsonBeanTargetClass(classe);
            }
            return OBJECT_MAPPER.readValue(json, classe);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromJson(byte[] json, TypeReference<T> type) {
        try {
            T value = OBJECT_MAPPER.readValue(json, type);
            return value;
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromJson(InputStream in, TypeReference<T> type) {
        try {
            return OBJECT_MAPPER.readValue(in, type);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromJson(String json, TypeReference<T> type) {
        try {
            return OBJECT_MAPPER.readValue(json, type);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromJson(JsonNode record, Class<T> classe) {
        try {
            if (hasJsonBeanAnnotation(classe)) {
                classe = getJsonBeanTargetClass(classe);
            }
            return OBJECT_MAPPER.readValue(record.traverse(), classe);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static <T> T fromJson(JsonNode record, TypeReference<T> type) {
        try {
            return OBJECT_MAPPER.readValue(record.traverse(), type);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    @Nullable
    public static String nullableToJson(@Nullable Object value) {
        return value == null ? null : toJson(value);
    }

    @Nullable
    public static String nullableToJson(@Nullable JsonNode value) {
        return value == null || value.isNull() ? null : toJson(value);
    }

    public static boolean isJson(String value) {
        return isNotBlank(value) && (value.startsWith("{") || value.startsWith("["));//TODO improve this
    }

    public static String toJson(Object value) {
        try {
            return OBJECT_MAPPER.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static String toPrettyJson(Object value) {
        try {
            return OBJECT_MAPPER_PRETTY.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            throw new RuntimeException(ex);
        }
    }

    @Nullable
    public static String toString(@Nullable JsonElement value) {
        if (value == null || value.isJsonNull()) {
            return null;
        } else if (value.isJsonPrimitive()) {
            return value.getAsString();
        } else {
            return value.toString();
        }
    }

    @Nullable
    public static String prettifyIfJson(@Nullable String mayBeJson) {
        if (isNotBlank(mayBeJson) && mayBeJson.matches("^[\\{\\[].*")) {//TODO better json check
            return prettifyJsonSafe(mayBeJson);
        } else {
            return mayBeJson;
        }
    }

    @Nullable
    public static String prettifyJsonSafe(@Nullable String mayBeJson) {
        if (isNotBlank(mayBeJson)) {
            try {
                Object object = fromJson(mayBeJson, Object.class);
                return OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(object);
            } catch (Exception ex) {
                LOGGER.warn("unable to prettify (maybe) json = {}", mayBeJson);
                LOGGER.debug("unable to prettify json", ex);
                return mayBeJson;
            }
        } else {
            return mayBeJson;
        }
    }

    @Nullable
    public static Object prettifyIfJsonLazy(@Nullable String mayBeJson) {
        return new Object() {

            @Override
            public String toString() {
                return String.valueOf(prettifyIfJson(mayBeJson));
            }

        };
    }

    public static <T> boolean hasJsonBeanAnnotation(Class<T> targetClass) {
        return targetClass.isAnnotationPresent(JsonBean.class)
                || targetClass.isAnnotationPresent(JsonDeserialize.class)
                || stream(targetClass.getConstructors()).anyMatch(c -> Arrays.stream(c.getAnnotations()).anyMatch(JsonCreator.class::isInstance) || Arrays.stream(c.getParameterAnnotations()).flatMap(Arrays::stream).anyMatch(JsonProperty.class::isInstance));
    }

    public static boolean hasJsonBeanAnnotation(Type targetType) {//TODO improve this
        return ((targetType instanceof Class) && hasJsonBeanAnnotation((Class) targetType))
                || ((targetType instanceof ParameterizedType) && hasJsonBeanAnnotation(((ParameterizedType) targetType).getActualTypeArguments()[0]));
    }

    public static boolean hasJsonBeanAnnotation(Method method) {
        return method.getAnnotation(JsonBean.class) != null;
    }

    public static <T> Class<T> getJsonBeanTargetClass(Class<T> targetInterfaceOrMode) {
        JsonBean annotation = targetInterfaceOrMode.getAnnotation(JsonBean.class);
        Class targetClass = annotation == null || (annotation.value() == null || equal(annotation.value(), Object.class)) ? targetInterfaceOrMode : annotation.value();
        checkArgument(targetInterfaceOrMode.isAssignableFrom(targetClass), "invalid jsonbean class = %s for target interface = %s", targetClass.getName(), targetInterfaceOrMode.getName());
        return targetClass;
    }

    private static ObjectMapper createObjectMapper(boolean pretty) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
        mapper.configure(JsonParser.Feature.ALLOW_COMMENTS, true);
        mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);

        SimpleModule myModule = new SimpleModule();
        myModule.addSerializer(Enum.class, new MyEnumSerializer());
        myModule.addDeserializer(Enum.class, new MyEnumDeserializer());
        mapper.registerModule(myModule);

        if (pretty) {
            mapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        }
        return mapper;
    }

    public static ObjectMapper getObjectMapper() {
        return OBJECT_MAPPER;
    }

    private static class MyEnumSerializer<E extends Enum> extends JsonSerializer<E> {

        @Override
        public void serialize(E value, JsonGenerator gen, SerializerProvider serializers) throws IOException, JsonProcessingException {
            if (value == null) {
                gen.writeNull();
            } else {
                gen.writeString(value.name().toLowerCase().replaceFirst("^[^_]+_(.+)", "$1"));
            }
        }
    }

    private static class MyEnumDeserializer<E extends Enum> extends StdDeserializer<E> implements ContextualDeserializer {

        private final Class<E> targetClass;

        public MyEnumDeserializer() {
            super(Enum.class);
            targetClass = null;
        }

        public MyEnumDeserializer(Class<E> targetClass) {
            super(Enum.class);
            this.targetClass = targetClass;
        }

        @Override
        public E deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
            String token = p.getValueAsString();
            try {
                if (isBlank(token)) {
                    return null;
                } else {
                    String value = token.toLowerCase().replaceFirst("^[^_]+_(.+)", "$1").trim();
                    List<E> list = EnumUtils.getEnumList(targetClass);
                    return list.stream().filter(e -> equal(e.name().toLowerCase().replaceFirst("^[^_]+_(.+)", "$1"), value)).collect(onlyElement());
                }
            } catch (Exception ex) {
                throw new RuntimeException(format("unable to parse enum class %s from value =< %s >", targetClass, token), ex);
            }
        }

        @Override
        public JsonDeserializer<?> createContextual(DeserializationContext context, BeanProperty property) throws JsonMappingException {
            Class<Enum> classe = (Class<Enum>) context.getContextualType().getRawClass();
            return new MyEnumDeserializer(classe);
        }

    }

}
