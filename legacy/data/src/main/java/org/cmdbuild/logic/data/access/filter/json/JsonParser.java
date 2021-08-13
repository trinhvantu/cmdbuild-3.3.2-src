package org.cmdbuild.logic.data.access.filter.json;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import static com.google.common.collect.FluentIterable.from;
import static com.google.common.collect.Iterables.get;
import static com.google.common.collect.Iterables.size;
import static org.cmdbuild.logic.data.access.filter.model.Elements.all;
import static org.cmdbuild.logic.data.access.filter.model.Elements.attribute;
import static org.cmdbuild.logic.data.access.filter.model.Elements.not;
import static org.cmdbuild.logic.data.access.filter.model.Elements.oneOf;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.and;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.contains;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.endsWith;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.equalTo;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.greaterThan;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.in;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.isNull;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.lessThan;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.like;
import static org.cmdbuild.logic.data.access.filter.model.Predicates.startsWith;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.AND_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.ATTRIBUTE_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.FULL_TEXT_QUERY_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.FUNCTION_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.NOT_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.OPERATOR_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.OR_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.RELATION_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.SIMPLE_KEY;
import static org.cmdbuild.logic.mapping.json.Constants.Filters.VALUE_KEY;

import java.io.IOException;

import org.apache.commons.lang3.Validate;
import org.cmdbuild.common.utils.UnsupportedProxyFactory;
import org.cmdbuild.logic.data.access.filter.model.BuildableFilter;
import org.cmdbuild.logic.data.access.filter.model.BuildableFilter.Builder;
import org.cmdbuild.logic.data.access.filter.model.Element;
import org.cmdbuild.logic.data.access.filter.model.Filter;
import org.cmdbuild.logic.data.access.filter.model.Parser;
import org.cmdbuild.logic.mapping.json.Constants.FilterOperator;

import com.google.common.base.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Deprecated
public class JsonParser implements Parser {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	private final Function<JsonNode, Element> TO_ELEMENT = (final JsonNode input) -> parseAttribute(input);

	private final String json;

	public JsonParser(final String json) {
		this.json = json;
	}

	@Override
	public Filter parse() {
		try {
			return parse0();
		} catch (final JsonProcessingException e) {
			throw new RuntimeException(e);
		} catch (final IOException e) {
			throw new RuntimeException(e);
		}
	}

	private Filter parse0() throws IOException, JsonProcessingException {
		final Builder builder = BuildableFilter.newInstance();
		final ObjectMapper mapper = new ObjectMapper();
		final JsonNode root = mapper.readTree(json);
		if (root.has(ATTRIBUTE_KEY)) {
			final JsonNode node = root.get(ATTRIBUTE_KEY);
			builder.withAttribute(parseAttribute(node));
		}
		if (root.has(FULL_TEXT_QUERY_KEY)) {
			final JsonNode node = root.get(FULL_TEXT_QUERY_KEY);
			builder.withFullTextQuery(parseFullTextQuery(node));
		}
		if (root.has(RELATION_KEY)) {
			logger.warn("not supported");
			// TODO
		}
		if (root.has(FUNCTION_KEY)) {
			logger.warn("not supported");
			// TODO
		}
		return builder.build();
	}

	private Element parseAttribute(final JsonNode node) {
		logger.debug("parsing node '{}'", node);
		final Element output;
		if (node.has(SIMPLE_KEY)) {
			final JsonNode simple = node.get(SIMPLE_KEY);
			final String name = simple.get(ATTRIBUTE_KEY).asText();
			final String operator = simple.get(OPERATOR_KEY).asText();
			final Iterable<Object> values = from(simple.get(VALUE_KEY)) //
					.transform((final JsonNode input) -> input.isTextual() ? input.asText() : input.asLong());
			output = ElementFactory.of(operator).create(name, values);
		} else if (node.has(AND_KEY)) {
			final JsonNode and = node.get(AND_KEY);
			final Iterable<Element> elements = from(and) //
					.transform(TO_ELEMENT);
			output = all(elements);
		} else if (node.has(OR_KEY)) {
			final JsonNode or = node.get(OR_KEY);
			final Iterable<Element> elements = from(or) //
					.transform(TO_ELEMENT);
			output = oneOf(elements);
		} else if (node.has(NOT_KEY)) {
			final JsonNode not = node.get(NOT_KEY);
			output = not(parseAttribute(not));
		} else {
			logger.error("unknown content for node");
			output = UnsupportedProxyFactory.of(Element.class).create();
		}
		return output;
	}

	private static enum ElementFactory {
		BEGIN(FilterOperator.BEGIN.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, startsWith(firstOf(values)));
			}

		}, //
		BETWEEN(FilterOperator.BETWEEN.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, and(greaterThan(firstOf(values)), lessThan(secondOf(values))));
			}

		},
		CONTAIN(FilterOperator.CONTAIN.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, contains(firstOf(values)));
			}

		},
		END(FilterOperator.END.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, endsWith(firstOf(values)));
			}

		}, //
		EQUAL(FilterOperator.EQUAL.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, equalTo(firstOf(values)));
			}

		}, //
		GREATER_THAN(FilterOperator.GREATER_THAN.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, greaterThan(firstOf(values)));
			}

		}, //
		IN(FilterOperator.IN.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, in(values));
			}

		}, //
		LIKE(FilterOperator.LIKE.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, like(firstOf(values)));
			}

		}, //
		LOWER_THAN(FilterOperator.LESS_THAN.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, lessThan(firstOf(values)));
			}

		},
		// NET_CONTAINS("net_contains"), //
		// NET_CONTAINED("net_contained"), //
		// NET_CONTAINS_OR_EQUAL("net_containsorequal"), //
		// NET_CONTAINED_OR_EQUAL("net_containedorequal"), //
		// NET_RELATIONED("net_relation"), //
		NOT_BEGIN(FilterOperator.NOT_BEGIN.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return not(BEGIN.create(name, values));
			}

		},
		NOT_CONTAIN(FilterOperator.NOT_CONTAIN.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return not(CONTAIN.create(name, values));
			}

		},
		NOT_END(FilterOperator.NOT_END.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return not(END.create(name, values));
			}

		}, //
		NOT_EQUAL(FilterOperator.NOT_EQUAL.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return not(EQUAL.create(name, values));
			}

		}, //
		NOT_NULL(FilterOperator.NOT_NULL.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return not(NULL.create(name, values));
			}

		}, //
		NULL(FilterOperator.NULL.toString()) {

			@Override
			public Element create(String name, final Iterable<Object> values) {
				return attribute(name, isNull());
			}

		}, //
		;

		private static Object firstOf(final Iterable<Object> values) {
			Validate.isTrue(size(values) > 0, "missing value");
			return get(values, 0);
		}

		private static Object secondOf(final Iterable<Object> values) {
			Validate.isTrue(size(values) > 1, "missing value");
			return get(values, 1);
		}

		public static ElementFactory of(final String operator) {
			for (final ElementFactory value : values()) {
				if (value.text.equals(operator.toLowerCase())) {
					return value;
				}
			}
			Validate.isTrue(false, "operator '%s' not found", operator);
			return null;
		}

		private final String text;

		private ElementFactory(final String text) {
			this.text = text;
		}

		public abstract Element create(String name, Iterable<Object> values);

	}

	private String parseFullTextQuery(final JsonNode node) {
		final String value = node.asText();
		return value;
	}

}
