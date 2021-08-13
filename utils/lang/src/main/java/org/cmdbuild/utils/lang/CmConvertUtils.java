/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.lang;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import static com.google.common.base.MoreObjects.firstNonNull;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Splitter;
import static com.google.common.base.Strings.nullToEmpty;
import static com.google.common.collect.Iterables.getOnlyElement;
import static com.google.common.collect.MoreCollectors.toOptional;
import static com.google.common.collect.Streams.stream;
import com.google.gson.Gson;
import static java.lang.Math.toIntExact;
import static java.lang.String.format;
import java.lang.invoke.MethodHandles;
import java.lang.reflect.Array;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.time.ZonedDateTime;
import java.util.Collection;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import java.util.stream.Stream;
import javax.annotation.Nullable;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.commons.lang3.StringUtils.trim;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import org.apache.commons.lang3.tuple.Pair;
import org.cmdbuild.utils.date.CmDateUtils;
import org.cmdbuild.utils.json.CmJsonUtils;
import static org.cmdbuild.utils.json.CmJsonUtils.fromJson;
import static org.cmdbuild.utils.json.CmJsonUtils.hasJsonBeanAnnotation;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmNullableUtils.getClassOfNullable;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.abbreviate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmMapUtils.toImmutableMap;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmStringUtils.toUpperCaseOrNull;
import org.springframework.core.annotation.AnnotationUtils;

public class CmConvertUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final static String MAPPING_PARAM_SEPARATOR = "&#124;";

    @Nullable
    public static Boolean toBooleanOrNull(@Nullable Object value) {
        return convert(value, Boolean.class);
    }

    @Nullable
    public static BigDecimal toBigDecimalOrNull(@Nullable Object value) {
        return convert(value, BigDecimal.class);
    }

    @Nullable
    public static Number toNumberOrNull(@Nullable Object value) {
        return toBigDecimalOrNull(value);//TODO improve this
    }

    public static Number toNumber(Object value) {
        return checkNotNull(toNumberOrNull(value));
    }

    @Nullable
    public static Integer toIntegerOrNull(@Nullable Object value) {
        return convert(value, Integer.class);
    }

    @Nullable
    public static Double toDoubleOrNull(@Nullable Object value) {
        return convert(value, Double.class);
    }

    @Nullable
    public static Float toFloatOrNull(@Nullable Object value) {
        return convert(value, Float.class);
    }

    public static double toDouble(Object value) {
        return checkNotNull(toDoubleOrNull(value));
    }

    public static double toDoubleOrZero(@Nullable Object value) {
        return firstNotNull(convert(value, Double.class), 0d);
    }

    @Nullable
    public static Long toLongOrNull(@Nullable Object value) {
        return convert(value, Long.class);
    }

    public static boolean isNotDecimal(Number number) {
        return Math.floor(number.doubleValue()) == number.doubleValue();
    }

    public static long toLong(Object value) {
        return checkNotNull(toLongOrNull(value));
    }

    public static int toInt(Object value) {
        return checkNotNull(toIntegerOrNull(value));
    }

    public static boolean isBoolean(@Nullable Object value) {
        return CmStringUtils.toStringOrEmpty(value).toLowerCase().matches("true|false");
    }

    public static boolean toBoolean(Object value) {
        return convert(value, Boolean.class);
    }

    public static List<String> toListOfStrings(@Nullable String value) {
        return Splitter.on(",").omitEmptyStrings().trimResults().splitToList(nullToEmpty(value));
    }

    public static boolean toBooleanOrDefault(@Nullable Object value, boolean defaultValue) {
        if (isNullOrBlank(value)) {
            return defaultValue;
        } else {
            return convert(value, Boolean.class);
        }
    }

    @Nullable
    public static Integer toIntegerOrDefault(@Nullable String value, @Nullable Integer defaultValue) {
        if (isBlank(value)) {
            return defaultValue;
        } else {
            return Integer.valueOf(value);
        }
    }

    public static int toIntOrZero(@Nullable String value) {
        return toIntegerOrDefault(value, 0);
    }

    @Nullable
    public static Long toLongOrDefault(@Nullable String value, @Nullable Long defaultValue) {
        if (isBlank(value)) {
            return defaultValue;
        } else {
            return Long.valueOf(value);
        }
    }

    public static long toLongOrZero(@Nullable String value) {
        return toLongOrDefault(value, 0l);
    }

    public static <T> T convert(@Nullable Object value, Class<T> targetClass, T defaultValue) {
        return firstNonNull(convert(value, targetClass), defaultValue);
    }

    @Nullable
    public static <T> T convert(@Nullable Object value, Class<T> targetClass) {
        try {
            if (targetClass.equals(Iterable.class) || targetClass.equals(Collection.class) || targetClass.equals(List.class)) {
                if (value == null) {
                    return targetClass.cast((T) emptyList());
                } else if (value instanceof Iterable) {
                    return targetClass.cast((T) list((Iterable) value));
                } else if (value.getClass().isArray()) {
                    return targetClass.cast(arrayToList(value));
                } else if (value instanceof java.sql.Array) {
                    try (ResultSet resultSet = ((java.sql.Array) value).getResultSet()) {
                        List list = list();
                        while (resultSet.next()) {
                            list.add(resultSet.getObject(2)); // 1 is index, 2 is value
                        }
                        return (T) list;
                    }
                } else if (value instanceof String) {
                    return (T) Splitter.on(",").omitEmptyStrings().splitToList((String) value);
                } else {
                    throw error(value, targetClass);
                }
            } else if (targetClass.equals(Set.class)) {
                return targetClass.cast((Set) set(convert(value, Iterable.class)));
            } else if (value == null) {
                return null;
            } else if (targetClass.isInstance(value)) {
                return targetClass.cast(value);
            } else if (targetClass.isArray()) {
                List list = (List) convert(value, List.class).stream().map((v) -> convert(v, targetClass.getComponentType())).collect(toList());
                return targetClass.cast(list.toArray((Object[]) Array.newInstance(targetClass.getComponentType(), list.size())));
            } else if (isPrimitiveOrWrapper(targetClass) && hasToPrimitiveConversion(value)) {
                return convert(extractBestCmPrimitiveIfAvailable(value, targetClass), targetClass);
            } else {
//				Function customConverter = getCustomConverterOrNull(getClassOfNullable(value), targetClass);//TODO use all hierarchy
//				if (customConverter != null) {
//					return targetClass.cast(customConverter.apply(value));
//				} else {

                T res = convertIfDateTimeOrReturnNull(value, targetClass);
                if (res != null) {
                    return res;
                } else {
                    return convert(value.toString(), targetClass);
                }
//				}
            }
        } catch (Exception ex) {
            throw new IllegalArgumentException(format("error converting value = %s of type = %s to type = %s", abbreviate(value), getClassOfNullable(value).getName(), targetClass), ex);
        }
    }

    @Nullable
    public static Object extractBestCmPrimitiveIfAvailable(@Nullable Object value, Class targetClass) {
        List<Pair<ToPrimitive, Method>> map = getToPrimitiveMethods(value);
        if (!map.isEmpty()) {
            Optional<Method> method = map.stream().map(Pair::getRight).filter(m -> targetClass.isAssignableFrom(m.getReturnType())).findFirst();
            if (method.isPresent()) {
                return CmReflectionUtils.executeMethod(value, method.get());
            } else {
                return extractCmPrimitiveIfAvailable(value);
            }
        }
        return value;
    }

    public static boolean hasToPrimitiveConversion(@Nullable Object value) {
        return !getToPrimitiveMethods(value).isEmpty();
    }

    @Nullable
    public static Object extractCmPrimitiveIfAvailable(@Nullable Object value) {
        List<Pair<ToPrimitive, Method>> map = getToPrimitiveMethods(value);
        if (!map.isEmpty()) {
            if (map.size() == 1) {
                return CmReflectionUtils.executeMethod(value, getOnlyElement(map).getValue());
            } else {
                Method method = map.stream().filter(p -> p.getKey().primary()).map(Pair::getValue).collect(onlyElement());
                return CmReflectionUtils.executeMethod(value, method);
            }
        }
        return value;
    }

    public static boolean primitiveEquals(@Nullable Object a, @Nullable Object b) {
        return equal(extractCmPrimitiveIfAvailable(a), extractCmPrimitiveIfAvailable(b));
    }

    private static List<Pair<ToPrimitive, Method>> getToPrimitiveMethods(@Nullable Object value) {
        if (value == null || isPrimitiveOrWrapper(value) || isArrayOfPrimitiveOrWrapper(value)) {
            return emptyList();
        } else {
            return (List) list().accept(list -> {
                list(value.getClass().getMethods()).forEach(method -> {
                    ToPrimitive annotation = AnnotationUtils.findAnnotation(method, ToPrimitive.class);
                    if (annotation != null) {
                        checkArgument(method.getParameterCount() == 0, "invalid annotation @ToPrimitive for method = %s", method);
                        list.add(Pair.of(annotation, method));
                    }
                });
            });
        }
    }

    public static boolean isPrimitiveOrWrapper(Object value) {
        return isPrimitiveOrWrapper(value.getClass());
    }

    public static boolean isArrayOfPrimitiveOrWrapper(Object value) {
        return isArrayOfPrimitiveOrWrapper(value.getClass());
    }

    public static boolean isArrayOfPrimitiveOrWrapper(Class myClass) {
        return myClass.isArray() && isPrimitiveOrWrapper(myClass.getComponentType());
    }

    public static boolean isPrimitiveOrWrapper(Class myClass) {
        return myClass.isPrimitive()
                || myClass == Double.class
                || myClass == Float.class
                || myClass == Long.class
                || myClass == Integer.class
                || myClass == Short.class
                || myClass == Character.class
                || myClass == Byte.class
                || myClass == Boolean.class
                || myClass == String.class;
    }

    @Nullable
    public static <T> T convert(@Nullable String value, Class<T> targetClass) {
        try {
            if (targetClass.equals(String.class)) {
                return targetClass.cast(value);
            } else if (Iterable.class.isAssignableFrom(targetClass)) {
                List<String> list = toListOfStrings(value);
                return convert(list, targetClass);
            } else if (StringUtils.isBlank(value)) {
                return null;
            } else if (targetClass.equals(Integer.class) || targetClass.equals(int.class)) {
                return (T) (Integer) toIntExact(toLong(value));
            } else if (targetClass.equals(Long.class) || targetClass.equals(long.class)) {
                return (T) toLong(value);
            } else if (targetClass.equals(BigDecimal.class) || targetClass.equals(Number.class)) {
                return (T) new BigDecimal(value);
            } else if (targetClass.equals(Double.class) || targetClass.equals(double.class)) {
                return (T) Double.valueOf(value);
            } else if (targetClass.equals(Float.class) || targetClass.equals(float.class)) {
                return (T) Float.valueOf(value);
            } else if (targetClass.equals(Character.class) || targetClass.equals(char.class)) {
                checkArgument(value.length() == 1);
                return (T) (Character) value.charAt(0);
            } else if (targetClass.equals(Boolean.class) || targetClass.equals(boolean.class)) {
                if (isNumber(value)) {
                    return (T) (Boolean) (toInt(value) != 0);
                } else {
                    return (T) Boolean.valueOf(value);
                }
            } else if (targetClass.isEnum()) {
                return (T) parseEnum(value, (Class) targetClass);
            } else if (!isPrimitiveOrWrapper(targetClass) && hasJsonBeanAnnotation(targetClass)) {
                return (T) convertStringToBeanWithModel(value, targetClass);
            } else {
                T res = convertIfDateTimeOrReturnNull(value, targetClass);
                if (res != null) {
                    return res;
                } else {
                    throw new IllegalArgumentException("unsupported conversion");
                }
            }
        } catch (Exception ex) {
            throw runtime(ex, "error converting value =< %s > to type = %s", abbreviate(value), targetClass);
        }
    }

    @Nullable
    public static <T extends Enum<T>> T parseEnumOrNull(@Nullable String value, Class<T> enumClass) {
        return isNullOrBlank(value) ? null : parseEnum(value, enumClass);
    }

    @Nullable
    public static <T extends Enum<T>> T parseEnumInvalidToNull(@Nullable String value, Class<T> enumClass) {
        try {
            return parseEnumOrNull(value, enumClass);
        } catch (Exception ex) {
            return null;
        }
    }

    @Deprecated
    public static <T extends Enum<T>> T parseEnumOrDefault(@Nullable String value, Class<T> enumClass, T defaultValue) {
        return parseEnumOrDefault(value, defaultValue);
    }

    public static <T extends Enum<T>> T parseEnumOrDefault(@Nullable String value, T defaultValue) {
        return isNullOrBlank(value) ? defaultValue : (T) parseEnum(value, defaultValue.getClass());
    }

    public static <T extends Enum<T>> T parseEnum(String value, Class<T> enumClass) {
        checkNotBlank(value);
        T enumValue = getEnumCaseInsensitiveOrNull(value, enumClass);
        if (enumValue == null) {
            String sample = EnumUtils.getEnumMap(enumClass).keySet().iterator().next();
            Matcher matcher = Pattern.compile("^([A-Z]+_).*").matcher(sample);
            if (matcher.matches()) {
                String prefix = matcher.group(1);
                enumValue = getEnumCaseInsensitiveOrNull(prefix + value, enumClass);
            }
        }
        return checkNotNull(enumValue, "enum value not found for name = %s, valid values = %s", value, EnumUtils.getEnumList(enumClass));
    }

    @Nullable
    public static <T extends Enum<T>> String serializeEnum(@Nullable T value) {
        return value == null ? null : value.name().toLowerCase().replaceFirst("^[^_]+_", "");
    }

    @Nullable
    public static <T extends Enum<T>> String serializeEnumUpper(@Nullable T value) {
        return toUpperCaseOrNull(serializeEnum(value));
    }

    @Nullable
    private static <T extends Enum<T>> T getEnumCaseInsensitiveOrNull(String value, Class<T> enumClass) {
        T enumValue = EnumUtils.getEnum(enumClass, value);
        if (enumValue == null) {
            enumValue = ((Map<String, T>) EnumUtils.getEnumMap(enumClass)).entrySet().stream().filter((e) -> e.getKey().equalsIgnoreCase(value)).collect(toOptional()).map(Entry::getValue).orElse(null);
        }
        return enumValue;
    }

    @Nullable
    public static <T> T convert(@Nullable Object value, Type type) {
        if (value == null) {
            return null;
        } else if (type instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) type;
            Class outer = (Class) parameterizedType.getRawType();
            if (List.class.isAssignableFrom(outer) || Collection.class.isAssignableFrom(outer) || Iterable.class.isAssignableFrom(outer)) {
                Class inner = (Class) parameterizedType.getActualTypeArguments()[0];
                Stream stream;
                if (hasJsonBeanAnnotation(inner) && value instanceof String) {
                    ArrayNode jsonArray = fromJson((String) value, ArrayNode.class);
                    stream = stream(jsonArray).map(j -> convertStringToBeanWithModel(j, inner));
                } else {
                    stream = convert(value, List.class).stream().map((e) -> convert(e, inner));
                }
                if (Set.class.isAssignableFrom(outer)) {
                    return (T) stream.collect(toSet());
                } else {
                    return (T) stream.collect(toList());
                }
            } else if (Map.class.isAssignableFrom(outer)) {
                return (T) convertToMap(value, type);
            } else {
                throw new IllegalArgumentException("unsupported conversion of parametrized type = " + type);
            }

        } else {
            return (T) convert(value, (Class) type);
        }
    }

    public static Class getFirstTypeArgOfParametrizedType(Type type) {
        if (type instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) type;
            Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
            return actualTypeArguments.length > 0 && actualTypeArguments[0] instanceof Class ? (Class) actualTypeArguments[0] : Object.class;
        } else {
            return Object.class;
        }
    }

    @Nullable
    private static Map convertToMap(@Nullable Object value, Type type) {
        try {
            checkArgument(Map.class.isAssignableFrom((Class<?>) (((ParameterizedType) type).getRawType())));
            if (value == null) {
                return null;
            } else if (value instanceof Map) {
                return (Map) value;//TODO convert keys
            } else if (value instanceof String && isJsonMap((String) value)) {
                return new Gson().fromJson((String) value, type);
            } else {
                throw new IllegalArgumentException("unsupported conversion");
            }
        } catch (Exception ex) {
            throw new IllegalArgumentException(format("error converting value = %s to type = %s", abbreviate(value), type), ex);
        }
    }

    private static boolean isJsonMap(String value) {
        return isNotBlank(value) && value.startsWith("{") && value.endsWith("}");
    }

    @Nullable
    private static <T> T convertIfDateTimeOrReturnNull(Object value, Class<T> targetClass) {
        if (Date.class.equals(targetClass)) {
            return targetClass.cast(CmDateUtils.toJavaDate(value));
        } else if (ZonedDateTime.class.equals(targetClass)) {
            return targetClass.cast(CmDateUtils.toDateTime(value));
        } else if (java.sql.Timestamp.class.equals(targetClass)) {
            return targetClass.cast(CmDateUtils.toSqlTimestamp(value));
        } else if (java.sql.Time.class.equals(targetClass)) {
            return targetClass.cast(CmDateUtils.toSqlTime(value));
        } else if (java.sql.Date.class.equals(targetClass)) {
            return targetClass.cast(CmDateUtils.toSqlDate(value));
        } else {
            return null;
        }
    }

    private static Long toLong(String value) {
        BigDecimal num = new BigDecimal(trim(value));
        Long res;
        try {
            res = num.longValueExact();
        } catch (ArithmeticException ex) {
            try {
                res = num.longValue();
                LOGGER.warn("error converting value = {} to int/long, unable to execute exact conversion (had to truncate or something)", value);
                LOGGER.debug("error converting numeric value", ex);
            } catch (Exception exx) {
                throw ex;
            }
        }
        return res;
    }

    private static RuntimeException error(Object value, Class targetClass) {
        return new IllegalArgumentException(format("unsupported conversion of value %s to type = %s", abbreviate(value), targetClass));
    }

    private static <T> List<T> arrayToList(Object value) {
        List<T> list = list();
        for (int i = 0; i < Array.getLength(value); i++) {
            list.add((T) Array.get(value, i));
        }
        return list;
    }

    public static <T> T defaultValue(Class<T> targetClass) {
        if (targetClass.equals(String.class)) {
            return targetClass.cast("");
        } else if (targetClass.equals(Integer.class) || targetClass.equals(int.class)) {
            return targetClass.cast(0);
        } else if (targetClass.equals(Long.class) || targetClass.equals(long.class)) {
            return targetClass.cast(0l);
        } else if (targetClass.equals(BigDecimal.class) || targetClass.equals(Number.class)) {
            return targetClass.cast(BigDecimal.ZERO);
        } else if (targetClass.equals(Double.class) || targetClass.equals(double.class)) {
            return targetClass.cast(0d);
        } else if (targetClass.equals(Float.class) || targetClass.equals(float.class)) {
            return targetClass.cast(0f);
        } else if (targetClass.equals(Boolean.class) || targetClass.equals(boolean.class)) {
            return targetClass.cast(false);
        } else {
            return null;
        }
    }

    public static Map<String, Object> parseMappingParams(@Nullable String value) {
        if (isBlank(value)) {
            return emptyMap();
        } else {
            return Splitter.on(MAPPING_PARAM_SEPARATOR).splitToList(value).stream().map(l -> {
                Matcher matcher = Pattern.compile("\\s*([^=]+?)\\s*=\\s*(.*?)\\s*").matcher(l);
                checkArgument(matcher.matches(), "invalid mapping param syntax for part = %s value = %s", l, value);
                return Pair.of(checkNotBlank(matcher.group(1)), matcher.group(2));
            }).collect(toImmutableMap(Pair::getKey, Pair::getValue));
        }
    }

    private static <T> T convertStringToBeanWithModel(String value, Class<T> targetInterfaceOrMode) {
        return (T) targetInterfaceOrMode.cast(CmJsonUtils.fromJson(value, targetInterfaceOrMode));
    }

    private static <T> T convertStringToBeanWithModel(JsonNode value, Class<T> targetInterfaceOrMode) {
        return (T) targetInterfaceOrMode.cast(CmJsonUtils.fromJson(value, targetInterfaceOrMode));
    }

}
