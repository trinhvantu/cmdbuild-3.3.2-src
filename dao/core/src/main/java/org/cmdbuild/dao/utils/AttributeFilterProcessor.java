/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.utils;

import com.google.common.base.Function;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Splitter;
import static com.google.common.collect.Iterables.getOnlyElement;
import static com.google.common.collect.Streams.stream;
import java.lang.invoke.MethodHandles;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import static java.util.stream.Collectors.toList;
import java.util.stream.Stream;
import javax.annotation.Nullable;
import org.cmdbuild.dao.entrytype.attributetype.CardAttributeType;
import static org.cmdbuild.dao.utils.AttributeConversionUtils.rawToSystem;
import org.cmdbuild.data.filter.AttributeFilter;
import org.cmdbuild.data.filter.AttributeFilterCondition;
import static org.cmdbuild.data.filter.AttributeFilterConditionOperator.EQUAL;
import org.cmdbuild.data.filter.beans.AttributeFilterConditionImpl;
import static org.cmdbuild.utils.date.CmDateUtils.isAnyDateType;
import static org.cmdbuild.utils.date.CmDateUtils.toDateTime;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmConvertUtils.convert;
import static org.cmdbuild.utils.lang.CmConvertUtils.extractCmPrimitiveIfAvailable;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrEmpty;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.cmdbuild.utils.object.CmBeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AttributeFilterProcessor<T> {

    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    private final KeyToValueFunction<T> keyToValueFunction;
    private final ConditionEvaluatorFunction conditionEvaluatorFunction;
    private final AttributeFilter attributeFilter;

    private AttributeFilterProcessor(AttributeFilterProcessorBuilder builder) {
        this.keyToValueFunction = checkNotNull(builder.keyToValueFunction);
        this.conditionEvaluatorFunction = checkNotNull(builder.conditionEvaluatorFunction);
        this.attributeFilter = checkNotNull(builder.attributeFilter);
    }

    public List<T> filter(Iterable<T> list) {
        return stream(list)
                .filter(this::match)
                .collect(toList());
    }

    public boolean match(T item) {
        return match(attributeFilter, item);
    }

    private boolean match(AttributeFilter filter, T item) {
        switch (filter.getMode()) {
            case NOT:
                return !match(filter.getOnlyElement(), item);
            case AND:
                return filter.getElements().stream().allMatch((f) -> match(f, item));
            case OR:
                return filter.getElements().stream().anyMatch((f) -> match(f, item));
            case SIMPLE:
                return match(filter.getCondition(), item);
            default:
                throw new IllegalStateException("unsupported filter mode = " + filter.getMode());
        }
    }

    private boolean match(AttributeFilterCondition condition, T item) {
        Object value = keyToValueFunction.apply(condition.getKey(), item);
        return conditionEvaluatorFunction.evaluate(condition, value);
    }

    public static interface ConditionEvaluatorFunction<E> {

        boolean evaluate(AttributeFilterCondition condition, E value);

    }

    public static interface KeyToValueFunction<T> {

        Object apply(String key, T object);
    }

    public KeyToValueFunction<T> getKeyToValueFunction() {
        return keyToValueFunction;
    }

    public ConditionEvaluatorFunction getConditionEvaluatorFunction() {
        return conditionEvaluatorFunction;
    }

    public static <T> AttributeFilterProcessorBuilder<T> builder() {
        return new AttributeFilterProcessorBuilder<>();
    }

    public static class AttributeFilterProcessorBuilder<T> implements Builder<AttributeFilterProcessor<T>, AttributeFilterProcessorBuilder<T>> {

        private KeyToValueFunction keyToValueFunction = DefaultBeanKeyToValueFunction.INSTANCE;
        private ConditionEvaluatorFunction conditionEvaluatorFunction = new DefaultConditionEvaluatorFunction();
        private AttributeFilter attributeFilter;

        public AttributeFilterProcessorBuilder withKeyToValueFunction(KeyToValueFunction<T> keyToValueFunction) {
            this.keyToValueFunction = keyToValueFunction;
            return this;
        }

        public AttributeFilterProcessorBuilder withConditionEvaluatorFunction(ConditionEvaluatorFunction conditionEvaluatorFunction) {
            this.conditionEvaluatorFunction = conditionEvaluatorFunction;
            return this;
        }

        public AttributeFilterProcessorBuilder withFilter(AttributeFilter attributeFilter) {
            this.attributeFilter = attributeFilter;
            return this;
        }

        public AttributeFilterProcessorBuilder withAttributeTypeFunction(Function<String, CardAttributeType> attributeTypeFunction) {
            this.conditionEvaluatorFunction = new DefaultConditionEvaluatorFunction(attributeTypeFunction);
            return this;
        }

        @Override
        public AttributeFilterProcessor build() {
            return new AttributeFilterProcessor(this);
        }

        public <T> List<T> filter(List<T> list) {
            return build().filter(list);
        }

    }

    public static enum MapKeyToValueFunction implements KeyToValueFunction {

        INSTANCE;

        @Override
        public Object apply(String key, Object object) {
            Map<String, Object> map = (Map) object;
            if (map.containsKey(key)) {
                return map.get(key);
            } else if (key.contains(".")) {
                List<String> list = Splitter.on(".").limit(2).omitEmptyStrings().trimResults().splitToList(key);
                if (list.size() > 1) {
                    Object inner = map.get(list.get(0));
                    if (inner != null && inner instanceof Map) {
                        return apply(list.get(1), inner);
                    }
                }
            }
            return null;
        }
    }

    public static enum DefaultBeanKeyToValueFunction implements KeyToValueFunction {

        INSTANCE;

        @Override
        public Object apply(String key, Object object) {
            return CmBeanUtils.getBeanPropertyValue(object, key);
        }

    }

    public static class DefaultConditionEvaluatorFunction implements ConditionEvaluatorFunction {

        private final Function<String, CardAttributeType> attributeTypeFunction;

        public DefaultConditionEvaluatorFunction() {
            attributeTypeFunction = (x) -> null;
        }

        public DefaultConditionEvaluatorFunction(Function<String, CardAttributeType> attributeTypeFunction) {
            this.attributeTypeFunction = checkNotNull(attributeTypeFunction);
        }

        @Override
        public boolean evaluate(AttributeFilterCondition condition, Object value) {
            CardAttributeType type = attributeTypeFunction.apply(condition.getKey());
            List<Object> values;
            if (type != null) {
                values = ((Stream<Object>) condition.getValues().stream().map(v -> rawToSystem(type, v))).collect(toList());
            } else {
                values = (List) condition.getValues();
            }
            switch (condition.getOperator()) {
                case NOTEQUAL:
                    return !evaluate(AttributeFilterConditionImpl.copyOf(condition).withOperator(EQUAL).build(), value);
                case EQUAL:
                    return equal(value, getOnlyElement(values)) || equal(toPrimitiveStringOrNull(value), toPrimitiveStringOrNull(getOnlyElement(values)));
                case IN:
                    return values.contains(value) || values.contains(toPrimitiveStringOrNull(value));
                case BETWEEN:
                    if (isNullOrBlank(value)) {
                        return false;
                    } else {//TODO improve this, replace switch with type-aware comparison
                        if (value instanceof Number) {
                            BigDecimal first = convert(values.get(0), BigDecimal.class), last = convert(values.get(1), BigDecimal.class), number = convert(value, BigDecimal.class);
                            LOGGER.trace("check that {} is between {} and {}", value, first, last);
                            return first.compareTo(number) <= 0 && number.compareTo(last) <= 0;
                        } else if (isAnyDateType(value)) {
                            long first = toDateTime(values.get(0)).toEpochSecond(), last = toDateTime(values.get(1)).toEpochSecond(), instant = toDateTime(value).toEpochSecond();
                            LOGGER.trace("check that {} is between {} and {}", value, first, last);
                            return first <= instant && instant <= last;
                        } else {
                            String first = toStringOrEmpty(values.get(0)), last = toStringOrEmpty(values.get(1)), word = toStringOrEmpty(value);
                            LOGGER.trace("check that < {} > is between < {} > and < {} >", value, first, last);
                            return first.compareTo(word) <= 0 && word.compareTo(last) <= 0;
                        }
                    }
                default:
                    throw new IllegalArgumentException("unsupported operator = " + condition.getOperator());
            }
        }

        @Nullable
        private String toPrimitiveStringOrNull(@Nullable Object value) {
            if (value == null) {
                return null;
            } else {
                return toStringOrNull(extractCmPrimitiveIfAvailable(value));
            }
        }

    }
}
