/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.service.rest.common.serializationhelpers;

import com.google.common.base.Function;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Predicates;
import com.google.common.collect.ImmutableList;
import static com.google.common.collect.ImmutableList.toImmutableList;
import com.google.common.collect.ImmutableSet;
import static com.google.common.collect.Lists.transform;
import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import com.vladsch.flexmark.util.data.MutableDataSet;
import static java.lang.String.format;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Predicate;
import static java.util.stream.Collectors.toList;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.dao.beans.CMRelation;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.DatabaseRecord;
import org.cmdbuild.common.beans.IdAndDescription;
import org.cmdbuild.common.beans.LookupValue;
import static org.cmdbuild.dao.beans.RelationDirectionUtils.serializeRelationDirection;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDCLASS;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDTENANT;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import static org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl.emptyOptions;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.AttributeMetadata;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_DELETE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_UPDATE;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.EntryType;
import static org.cmdbuild.dao.entrytype.TextContentSecurity.TCS_HTML_SAFE;
import org.cmdbuild.dao.entrytype.attributetype.CardAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.ReferenceAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.TextAttributeType;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildReferenceAttrName;
import org.cmdbuild.gis.CmGeometry;
import org.cmdbuild.gis.utils.GisUtils;
import static org.cmdbuild.service.rest.common.utils.WsSerializationUtils.serializeGeometry;
import static org.cmdbuild.service.rest.common.serializationhelpers.CardWsSerializationHelperv3.ExtendedCardOptions.INCLUDE_MODEL;
import static org.cmdbuild.service.rest.common.serializationhelpers.CardWsSerializationHelperv3.ExtendedCardOptions.SKIP_SYSTEM_ATTRS;
import static org.cmdbuild.service.rest.common.serializationhelpers.WsAttributeConverterUtilsv3.toClient;
import org.cmdbuild.translation.ObjectTranslationService;
import static org.cmdbuild.utils.date.CmDateUtils.toIsoDateTime;
import org.cmdbuild.utils.html.HtmlSanitizerUtils;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import org.cmdbuild.utils.lang.CmMapUtils.FluentMap;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import org.cmdbuild.utils.lang.CmMapUtils;
import static org.cmdbuild.utils.lang.CmMapUtils.mapOf;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullNorBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrEmpty;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import org.cmdbuild.widget.WidgetService;
import org.cmdbuild.widget.model.Widget;
import org.cmdbuild.widget.model.WidgetData;

@Component
public class CardWsSerializationHelperv3 {

    private final List<String> CARD_ATTR_EXT_META = ImmutableList.of("_changed", "_previous");
    private final Set<String> SPECIAL_ATTRS = ImmutableSet.of(ATTR_IDTENANT, ATTR_IDCLASS, ATTR_ID);//TODO improve this

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DaoService dao;
    private final ObjectTranslationService translationService;
    private final ClassSerializationHelper classSerializationHelper;
    private final AttributeTypeConversionService attributeTypeConversionService;
    private final WidgetService widgetService;

    public CardWsSerializationHelperv3(DaoService dao, ObjectTranslationService translationService, ClassSerializationHelper classSerializationHelper, AttributeTypeConversionService attributeTypeConversionService, WidgetService widgetService) {
        this.dao = checkNotNull(dao);
        this.translationService = checkNotNull(translationService);
        this.classSerializationHelper = checkNotNull(classSerializationHelper);
        this.attributeTypeConversionService = checkNotNull(attributeTypeConversionService);
        this.widgetService = checkNotNull(widgetService);
    }

    public enum ExtendedCardOptions {
        NONE, INCLUDE_MODEL, SKIP_SYSTEM_ATTRS
    }

    public Consumer<FluentMap<String, Object>> serializeWidgets(Card card) {
        return m -> {
            List<WidgetData> classWidgets = widgetService.getAllWidgetsForClass(card.getType());
            List<Widget> cardWidgets = widgetService.widgetDataToWidget(classWidgets, card.toMap());
            m.put("_widgets", cardWidgets.stream().map(classSerializationHelper::serializeWidget).collect(toList()));
        };
    }

    public FluentMap<String, Object> serializeMinimalRelation(CMRelation relation) {
        return map("_id", relation.getId(),
                "_type", relation.getType().getName(),
                "_user", relation.getUser(),
                "_beginDate", toIsoDateTime(relation.getBeginDate()),
                "_sourceType", relation.getSourceCard().getClassName(),
                "_sourceId", relation.getSourceId(),
                "_sourceDescription", relation.getSourceDescription(),//TODO translation
                "_sourceCode", relation.getSourceCode(),
                "_destinationType", relation.getTargetCard().getClassName(),
                "_destinationId", relation.getTargetId(),
                "_destinationCode", relation.getTargetCode(),
                "_destinationDescription", relation.getTargetDescription(),//TODO translation
                "_direction", serializeRelationDirection(relation.getDirection()),
                "_is_direct", relation.isDirect(),
                "_can_update", relation.getType().hasServicePermission(CP_UPDATE),
                "_can_delete", relation.getType().hasServicePermission(CP_DELETE)
        );
    }

    public CmMapUtils.FluentMap<String, Object> serializeDetailedRelation(CMRelation relation) {
        return serializeMinimalRelation(relation).accept((map) -> {
            addCardValuesAndDescriptionsAndExtras(relation, map::put);
        });
    }

    public FluentMap<String, Object> serializeCard(Card card, ExtendedCardOptions... extendedCardOptions) {
        return serializeCard(card, emptyOptions(), set(extendedCardOptions));
    }

    public FluentMap<String, Object> serializeCard(Card card, DaoQueryOptions queryOptions, ExtendedCardOptions... extendedCardOptions) {
        return serializeCard(card, queryOptions, set(extendedCardOptions));

    }

    public FluentMap<String, Object> serializeCard(Card card, Set<ExtendedCardOptions> extendedCardOptions) {
        return serializeCard(card, emptyOptions(), extendedCardOptions);

    }

    public FluentMap<String, Object> serializeCard(Card card, DaoQueryOptions queryOptions, Set<ExtendedCardOptions> extendedCardOptions) {
        try {
            return mapOf(String.class, Object.class).accept((m) -> {
                if (!extendedCardOptions.contains(SKIP_SYSTEM_ATTRS)) {
                    m.put("_id", card.getId(),
                            "_type", card.getType().getName(),
                            //                            "_type_description", card.getType().getDescription(),
                            //                            "_type_description_translation", translationService.translateClassDescription(card.getType()),
                            "_user", card.getUser(),
                            "_beginDate", toIsoDateTime(card.getBeginDate()));
                    if (card.getType().hasMultitenantEnabled()) {
                        m.put("_tenant", card.getTenantId());
                    }
                }
            }).filterKeys(k -> !queryOptions.hasAttrs() || queryOptions.getAttrs().contains(card.getType().getAliasToAttributeMap().getOrDefault(k, (String) k))).accept((m) -> {
                addCardValuesAndDescriptionsAndExtras(card, a -> !queryOptions.hasAttrs() || queryOptions.getAttrs().contains(a.getName()), m::put);
                if (extendedCardOptions.contains(INCLUDE_MODEL)) {
                    m.put("_model", classSerializationHelper.buildBasicResponse(card.getType())
                            .with("attributes", list(transform(card.getType().getServiceAttributes(), attributeTypeConversionService::serializeAttributeType))));
                }
            });
        } catch (Exception ex) {
            throw runtime(ex, "error serializing card = %s", card);
        }
    }

    public void addCardValuesAndDescriptionsAndExtras(DatabaseRecord card, BiConsumer<String, Object> adder) {
        addCardValuesAndDescriptionsAndExtras(card, Predicates.alwaysTrue(), adder);
    }

    public void addCardValuesAndDescriptionsAndExtras(DatabaseRecord card, Predicate<Attribute> attrFilter, BiConsumer<String, Object> adder) {
        addCardValuesAndDescriptionsAndExtras(card.getType().getServiceAttributes().stream().filter(attrFilter).collect(toImmutableList()), card::get, adder);
    }

    public void addCardValuesAndDescriptionsAndExtras(Collection<Attribute> attributes, Function<String, Object> getter, BiConsumer<String, Object> adder) {
        attributes.stream()
                .filter(Attribute::isActive)
                .filter(Attribute::hasServiceReadPermission)
                .filter(a -> !SPECIAL_ATTRS.contains(a.getName()))//TODO improve this
                .forEach((a) -> {
                    addCardValuesAndDescriptionsAndExtras(a, getter, adder);
                });
    }

    public FluentMap<String, Object> serializeAttributeValue(EntryType classe, String attributeName, Object value) {
        return serializeAttributeValue(classe, attributeName, map(attributeName, value));
    }

    public FluentMap<String, Object> serializeAttributeValue(EntryType classe, String attributeName, Map<String, Object> data) {
        return mapOf(String.class, Object.class).accept(m -> {
            Attribute attribute = classe.getAttribute(attributeName);
            addCardValuesAndDescriptionsAndExtras(attribute, data::get, m::put);
        });
    }

    public void addCardValuesAndDescriptionsAndExtras(Attribute attribute, Function<String, Object> getter, BiConsumer<String, Object> adder) {
        addCardValuesAndDescriptionsAndExtras(attribute.getName(), attribute.getType(), attribute.getMetadata(), getter, adder);
    }

    public void addCardValuesAndDescriptionsAndExtras(String name, CardAttributeType type, Function<String, Object> getter, BiConsumer<String, Object> adder) {
        addCardValuesAndDescriptionsAndExtras(name, type, null, getter, adder);
    }

    public void addCardValuesAndDescriptionsAndExtras(String name, CardAttributeType<?> type, @Nullable AttributeMetadata attributeMetadata, Function<String, Object> getter, BiConsumer<String, Object> adder) {
        Object rawValue = "<undefined>";
        try {
            rawValue = getter.apply(name);
            Object value = toClient(type, rawValue);
            if (attributeMetadata != null && attributeMetadata.isPassword()) {
                adder.accept(format("_%s_has_value", name), isNotBlank(toStringOrNull(value)));
                return; //skip password attrs
            }
            if (attributeMetadata != null && attributeMetadata.hasTextContentSecurity(TCS_HTML_SAFE)) {
                value = HtmlSanitizerUtils.sanitizeHtml(toStringOrNull(value));
            }
            adder.accept(name, value);
            switch (type.getName()) {
                case REFERENCE:
                    Domain domain = dao.getDomain(type.as(ReferenceAttributeType.class).getDomainName()).getThisDomainWithDirection(type.as(ReferenceAttributeType.class).getDirection());
                    domain.getActiveServiceAttributes().stream().filter(Attribute::showInGrid).forEach(a -> {
                        String key = buildReferenceAttrName(name, a.getName());
                        addCardValuesAndDescriptionsAndExtras(key, a.getType(), a.getMetadata(), getter, adder);
                    });
                case FOREIGNKEY:
                case LOOKUP:
                    if (rawValue instanceof IdAndDescription) {
                        adder.accept(format("_%s_code", name), ((IdAndDescription) rawValue).getCode());
                        adder.accept(format("_%s_description", name), ((IdAndDescription) rawValue).getDescription());
                    }
                    if (rawValue instanceof LookupValue) {
                        LookupValue lookup = ((LookupValue) rawValue);
                        if (lookup.hasCode()) {
                            adder.accept(format("_%s_description_translation", name), translationService.translateLookupDescriptionSafe(lookup.getLookupType(), lookup.getCode(), lookup.getDescription()));
                        }
                    }
                    break;
                case TEXT:
                    switch (((TextAttributeType) type).getLanguage()) {
                        case TAL_HTML:
                            adder.accept(format("_%s_html", name), toStringOrEmpty(value));
                            break;
                        case TAL_MARKDOWN:
                            adder.accept(format("_%s_html", name), markdownToHtml(toStringOrEmpty(value)));
                            break;
                        //TODO handle others
                    }
                    break;
                case GEOMETRY:
                    if (isNotNullNorBlank(value)) {
                        CmGeometry geometry = GisUtils.parseGeometry(toStringNotBlank(value));
                        adder.accept(format("_%s_%s", name, serializeEnum(geometry.getType())), serializeGeometry(geometry));
                    }
            }
            CARD_ATTR_EXT_META.stream().map((e) -> format("_%s%s", name, e)).forEach((n) -> {
                Object v = getter.apply(n);
                if (v != null) {
                    adder.accept(n, v);
                }
            });
        } catch (Exception ex) {
            throw runtime(ex, "error processing attr = %s of type = %s with value = %s", name, type, rawValue);
        }
    }

    private static String markdownToHtml(@Nullable String value) {
        if (isBlank(value)) {
            return value;
        } else {
            MutableDataSet options = new MutableDataSet();
            com.vladsch.flexmark.util.ast.Document document = Parser.builder(options).build().parse(value);
            return HtmlRenderer.builder(options).build().render(document);
        }
    }
}
