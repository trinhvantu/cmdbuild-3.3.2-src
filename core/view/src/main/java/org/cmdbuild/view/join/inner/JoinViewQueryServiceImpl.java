/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.view.join.inner;

import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.base.Splitter;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Iterables.getLast;
import static com.google.common.collect.Iterables.getOnlyElement;
import static java.lang.Long.parseLong;
import static java.lang.String.format;
import java.util.Collection;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import org.apache.commons.lang3.tuple.Pair;
import static org.cmdbuild.common.Constants.LOOKUP_CLASS_NAME;
import org.cmdbuild.common.utils.PagedElements;
import static org.cmdbuild.common.utils.PagedElements.paged;
import org.cmdbuild.dao.DaoException;
import org.cmdbuild.dao.beans.AttributeMetadataImpl;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.CardImpl;
import org.cmdbuild.dao.beans.IdAndDescriptionImpl;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_CODE;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import org.cmdbuild.dao.entrytype.Attribute;
import static org.cmdbuild.dao.entrytype.AttributeGroupData.ATTRIBUTE_GROUP_DEFAULT_DISPLAY_MODE;
import org.cmdbuild.dao.entrytype.AttributeGroupImpl;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.INHERITED;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.SHOW_IF_EXPR;
import static org.cmdbuild.dao.entrytype.AttributeMetadata.UNIQUE;
import org.cmdbuild.dao.entrytype.AttributeWithoutOwner;
import org.cmdbuild.dao.entrytype.AttributeWithoutOwnerImpl;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.ClasseImpl;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.EntryType;
import static org.cmdbuild.dao.entrytype.EntryTypeType.ET_OTHER;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.FOREIGNKEY;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.LOOKUP;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.REFERENCE;
import org.cmdbuild.dao.entrytype.attributetype.ForeignKeyAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.LookupAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.ReferenceAttributeType;
import org.cmdbuild.dao.postgres.q3.AliasBuilder;
import org.cmdbuild.dao.postgres.q3.QueryBuilderHelper;
import org.cmdbuild.dao.postgres.q3.QueryBuilderUtilsService;
import org.cmdbuild.dao.postgres.q3.RefAttrHelperService;
import static org.cmdbuild.dao.postgres.utils.QueryBuilderUtils.whereElementsToWhereExprBlankIfEmpty;
import org.cmdbuild.dao.postgres.utils.RelationDirectionQueryHelper;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildCodeAttrName;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildDescAttrName;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.entryTypeToSqlExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.quoteSqlIdentifier;
import org.cmdbuild.data.filter.AttributeFilter;
import static org.cmdbuild.data.filter.AttributeFilterConditionOperator.ISNULL;
import org.cmdbuild.data.filter.CmdbFilter;
import static org.cmdbuild.data.filter.FilterType.ATTRIBUTE;
import static org.cmdbuild.data.filter.FilterType.FULLTEXT;
import org.cmdbuild.data.filter.beans.AttributeFilterConditionImpl;
import org.cmdbuild.data.filter.beans.AttributeFilterImpl;
import org.cmdbuild.data.filter.beans.CmdbFilterImpl;
import org.cmdbuild.lookup.LookupRepository;
import static org.cmdbuild.utils.encode.CmEncodeUtils.decodeString;
import static org.cmdbuild.utils.encode.CmEncodeUtils.encodeString;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.zip;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLongOrNull;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmMapUtils.mapOf;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNullOrLtEqZero;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrEmpty;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowConsumer;
import org.cmdbuild.view.View;
import static org.cmdbuild.view.ViewConst.CLASS_IS_DUMMY_FOR_VIEW;
import static org.cmdbuild.view.ViewService.ATTR_DESCR_INHERITED_FROM;
import static org.cmdbuild.view.ViewService.JOIN_VIEW_ATTR_JOIN_ID;
import static org.cmdbuild.view.ViewType.VT_JOIN;
import org.cmdbuild.view.join.JoinElement;
import org.cmdbuild.view.join.JoinType;
import static org.cmdbuild.view.join.JoinType.JT_INNER_JOIN;
import static org.cmdbuild.view.join.JoinType.JT_LEFT_JOIN;
import org.cmdbuild.view.join.JoinViewConfig;
import static org.cmdbuild.view.join.utils.JoinViewUtils.buildAttributeExpr;
import static org.cmdbuild.view.join.utils.JoinViewUtils.parseAttributeExpr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class JoinViewQueryServiceImpl implements JoinViewQueryService {

    private final static String TABLE_ALIAS = "TABLE_ALIAS", REF_TABLE_ALIAS = "REF_TABLE_ALIAS", ATTR_ALIAS = "ATTR_ALIAS", ATTR_DESCR_ALIAS = "ATTR_DESCR_ALIAS", ATTR_CODE_ALIAS = "ATTR_CODE_ALIAS", JOIN_MASTER = "JOIN_MASTER";

    private final static EnumMap<JoinType, String> JOIN_EXPR_MAP = new EnumMap<>((Map) map(JT_INNER_JOIN, "JOIN", JT_LEFT_JOIN, "LEFT JOIN"));

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final DaoService dao;
    private final RefAttrHelperService refAttrHelperService;
    private final QueryBuilderUtilsService queryService;
    private final LookupRepository lookupService;

    public JoinViewQueryServiceImpl(DaoService dao, RefAttrHelperService refAttrHelperService, QueryBuilderUtilsService queryService, LookupRepository lookupService) {
        this.dao = checkNotNull(dao);
        this.refAttrHelperService = checkNotNull(refAttrHelperService);
        this.queryService = checkNotNull(queryService);
        this.lookupService = checkNotNull(lookupService);
    }

    @Override
    public PagedElements<Card> getCards(View view, DaoQueryOptions queryOptions) {
        return new JoinViewQueryHelper(view).getCards(queryOptions);
    }

    @Override
    public Card getCard(View view, String cardId) {
        return new JoinViewQueryHelper(view).getCard(cardId);
    }

    @Override
    public Collection<Attribute> getAttributesForView(View view) {
        return new JoinViewQueryHelper(view).buildDummyViewClass().getAllAttributes();
    }

    @Override
    public void validateViewConfig(View view) {
        new JoinViewQueryHelper(view).validateConfig();
    }

    private class JoinViewQueryHelper {

        private final View view;
        private final JoinViewConfig config;

        private final AliasBuilder aliasBuilder = new AliasBuilder();

        private final Map<String, EntryType> tablesByAlias;

        public JoinViewQueryHelper(View view) {
            checkArgument(view.isOfType(VT_JOIN));
            this.view = checkNotNull(view);
            this.config = view.getJoinConfig();

            tablesByAlias = mapOf(String.class, EntryType.class).with(config.getMasterClassAlias(), dao.getClasse(config.getMasterClass())).accept(m -> {
                config.getJoinElements().forEach(j -> {
                    Domain domain = dao.getDomain(j.getDomain()).getThisDomainWithDirection(j.getDirection());
                    m.put(j.getDomainAlias(), domain);
                    Classe target = dao.getClasse(firstNotBlank(j.getTargetType(), domain.getTargetClassName()));
                    checkArgument(domain.isDomainForTargetClasse(target), "invalid target class = %s for domain = %s", target, domain);
                    m.put(j.getTargetAlias(), target);
                });
            }).immutableCopy();
        }

        public Card getCard(String cardId) {
            List<Long> ids = Splitter.on("_").splitToList(decodeString(checkNotBlank(cardId))).stream().map(v -> "NULL".equalsIgnoreCase(v) ? null : parseLong(v)).collect(toList());
            checkArgument(ids.size() == config.getJoinElements().size() + 1, "invalid join card id");
            logger.debug("get join card for ids = {}", ids);
            AttributeFilter filter = AttributeFilterImpl.and(zip(ids, list(config.getMasterClassAlias()).with(list(config.getJoinElements()).map(JoinElement::getTargetAlias)), Pair::of).stream().map(p -> {
                String attr = format("%s.Id", p.getRight());
                if (p.getLeft() == null) {
                    return AttributeFilterConditionImpl.builder().withOperator(ISNULL).withKey(attr).build().toAttributeFilter();
                } else {
                    return AttributeFilterConditionImpl.eq(attr, p.getLeft()).toAttributeFilter();
                }
            }).collect(toImmutableList()));
            return getOnlyElement(getCards(DaoQueryOptionsImpl.build(CmdbFilterImpl.builder().withAttributeFilter(filter).build())).elements());
        }

        public PagedElements<Card> getCards(DaoQueryOptions queryOptions) {
            return new QueryHelper().getCards(queryOptions);
        }

        public Classe buildDummyViewClass() {
            AtomicInteger attrGroupIndex = new AtomicInteger(0);
            return ClasseImpl.builder().withName(view.getName())
                    .withMetadata(m -> m.withOther(map(CLASS_IS_DUMMY_FOR_VIEW, key(view.isShared() ? "shared" : toStringNotBlank(view.getUserId()), view.getName()))))
                    .withAttributes(getAttributes())
                    .withAttributeGroups(list(config.getAttributeGroups()).map(g -> AttributeGroupImpl.builder()
                    .withOwnerType(ET_OTHER)
                    .withName(g.getName())
                    .withDescription(g.getDescription())
                    .withOwnerName(view.getName())
                    .withIndex(attrGroupIndex.incrementAndGet())
                    .withConfig(map(ATTRIBUTE_GROUP_DEFAULT_DISPLAY_MODE, g.getDefaultDisplayMode()))
                    .build())).build();
        }

        public void validateConfig() {
            buildDummyViewClass();
            //TODO other validation ??
        }

        private class QueryHelper {

            private final List<JoinTable> join = list();

            private PagedElements<Card> getCards(DaoQueryOptions queryOptions) {
                CmdbFilter filter = config.getFilter().and(queryOptions.getFilter());

                join.add(new JoinTable(dao.getClasse(config.getMasterClass()),
                        aliasBuilder.buildAliasAndStore(config.getMasterClassAlias(), TABLE_ALIAS, config.getMasterClassAlias()),
                        JT_INNER_JOIN, JOIN_MASTER));

                config.getJoinElements().forEach(j -> {
                    Domain domain = getTableByAlias(j.getDomainAlias());
                    RelationDirectionQueryHelper helper = RelationDirectionQueryHelper.forDirection(j.getDirection());
                    String domAlias = aliasBuilder.buildAliasAndStore(j.getDomainAlias(), TABLE_ALIAS, j.getDomainAlias());
                    join.add(new JoinTable(domain,
                            domAlias,
                            j.getJoinType(),
                            format("%s.\"Id\" = %s.%s AND %s.\"Status\" = 'A'", getLast(join).getAlias(), domAlias, helper.getSourceCardIdExpr(), domAlias)));
                    Classe target = getTableByAlias(j.getTargetAlias());
                    String tarAlias = aliasBuilder.buildAliasAndStore(j.getTargetAlias(), TABLE_ALIAS, j.getTargetAlias());
                    join.add(new JoinTable(target,
                            tarAlias,
                            j.getJoinType(),
                            format("%s.%s = %s.\"Id\" AND %s.\"Status\" = 'A'", domAlias, helper.getTargetCardIdExpr(), tarAlias, tarAlias)));
                });

                Classe classe = buildDummyViewClass();

                filter = filter.mapNames(a -> a.matches(".+[.].+") ? a : config.getAttribute(a).getExpr());

                List<String> attributes = list();

                attributes.add(format("FORMAT('%s', %s) %s",
                        join.stream().filter(j -> j.getTable().isClasse()).map(j -> "%s").collect(joining("_")),
                        join.stream().filter(j -> j.getTable().isClasse()).map(j -> equal(j.getJoinType(), JT_LEFT_JOIN) ? format("COALESCE(%s.\"Id\"::varchar, 'NULL')", j.getAlias()) : format("%s.\"Id\"", j.getAlias())).collect(joining(", ")),
                        aliasBuilder.buildAliasAndStore(JOIN_VIEW_ATTR_JOIN_ID, JOIN_VIEW_ATTR_JOIN_ID)));

                config.getAttributes().forEach(a -> {
                    Attribute attribute = getTableByAlias(a.getExprAlias()).getAttribute(a.getExprAttr());
                    String attrAlias = aliasBuilder.buildAliasAndStore(attribute.getName(), ATTR_ALIAS, a.getName()),
                            tableAlias = aliasBuilder.getAlias(TABLE_ALIAS, a.getExprAlias());
                    attributes.add(format("%s.%s %s", tableAlias, quoteSqlIdentifier(attribute.getName()), attrAlias));
                    switch (attribute.getType().getName()) {
                        case REFERENCE:
                        case FOREIGNKEY:
                            String referencedTableAlias = addJoinFOrReferenceReturnTargetTableAlias(tableAlias, refAttrHelperService.getTargetClassForAttribute(attribute), attribute);
                            attributes.add(format("%s.\"Description\" %s", referencedTableAlias, aliasBuilder.buildAliasAndStore(buildDescAttrName(attribute.getName()), ATTR_DESCR_ALIAS, a.getExpr())));
                            if (refAttrHelperService.getTargetClassForAttribute(attribute).hasAttribute(ATTR_CODE)) {
                                attributes.add(format("%s.\"Code\" %s", referencedTableAlias, aliasBuilder.buildAliasAndStore(buildCodeAttrName(attribute.getName()), ATTR_CODE_ALIAS, a.getExpr())));
                            }
                            break;
                        case LOOKUP:
                            String looAlias = addJoinFOrReferenceReturnTargetTableAlias(tableAlias, dao.getClasse(LOOKUP_CLASS_NAME), attribute);
                            attributes.add(format("%s.\"Description\" %s", looAlias, aliasBuilder.buildAliasAndStore(buildDescAttrName(attribute.getName()), ATTR_DESCR_ALIAS, a.getExpr())));
                            attributes.add(format("%s.\"Code\" %s", looAlias, aliasBuilder.buildAliasAndStore(buildCodeAttrName(attribute.getName()), ATTR_CODE_ALIAS, a.getExpr())));
                            break;
                    }
                });

                String query = format("SELECT %s FROM %s", Joiner.on(", ").join(attributes), join.stream().map(j -> {
                    if (equal(j.getOnExpr(), JOIN_MASTER)) {
                        return format("%s %s", entryTypeToSqlExpr(j.getTable()), j.getAlias());
                    } else {
                        return format("%s %s %s ON %s", checkNotNull(JOIN_EXPR_MAP.get(j.getJoinType())), entryTypeToSqlExpr(j.getTable()), j.getAlias(), j.getOnExpr());
                    }
                }).collect(joining(" ")));

                QueryBuilderHelper helper = queryService.helper().withAliasBuilder(aliasBuilder)
                        .withAddFromToIdentifiers(true)
                        .withAttributeByExprSupplier(a -> {
                            Matcher matcher = Pattern.compile("^(.+)[.](.+)$").matcher(a);
                            checkArgument(matcher.matches(), "invalid join attr value pattern =< %s >", a);
                            return getTableByAlias(matcher.group(1)).getAttributeOrNull(matcher.group(2));
                        })
                        .withJoinElementAliasSupplier(j -> aliasBuilder.getAlias(TABLE_ALIAS, j))
                        .withJoinIdByExprSupplier(a -> {
                            Matcher matcher = Pattern.compile("^(.+)[.](.+)$").matcher(a);
                            checkArgument(matcher.matches(), "invalid join attr value pattern =< %s >", a);
                            return matcher.group(1);
                        })
                        .withFrom(classe).withFromAlias("_").build();//TODO check this

                filter.checkHasOnlySupportedFilterTypes(FULLTEXT, ATTRIBUTE);
                query += whereElementsToWhereExprBlankIfEmpty(helper.buildWheresForFilter(filter));

                if (!queryOptions.getSorter().isNoop()) {//TODO duplicate code, merge with helper (??)
                    query += " ORDER BY " + queryOptions.getSorter().mapNames(a -> a.matches(".+[.].+") ? a : config.getAttribute(a).getExpr()).getElements().stream().map(s -> {
                        Pair<String, String> pair = parseAttributeExpr(s.getProperty());
                        String tableAlias = pair.getLeft(), attributeName = pair.getRight();
                        Attribute attribute = getTableByAlias(tableAlias).getAttributeOrNull(attributeName);
                        String expr;
                        switch (attribute.getType().getName()) {
                            case FOREIGNKEY:
                            case REFERENCE:
                            case LOOKUP:
                                expr = format("%s.\"Description\"", aliasBuilder.getAlias(REF_TABLE_ALIAS, tableAlias, attribute.getName()));
                                break;
                            default:
                                expr = format("%s.%s", aliasBuilder.getAlias(TABLE_ALIAS, tableAlias), quoteSqlIdentifier(attribute.getName()));
                        }
                        return format("%s %s", expr, s.getDirection().toSql());
                    }).collect(joining(", "));
                }

                String pagedQuery = query;
                if (queryOptions.hasOffset()) {
                    pagedQuery += format(" OFFSET %s", queryOptions.getOffset());
                }
                if (queryOptions.hasLimit()) {
                    pagedQuery += format(" LIMIT %s", queryOptions.getLimit());
                }

                List<Card> cards = dao.getJdbcTemplate().query(pagedQuery, (r, i) -> CardImpl.builder().withType(classe).accept(b -> {
                    try {
                        config.getAttributes().forEach(rethrowConsumer(a -> {
                            Attribute attribute = classe.getAttribute(a.getName());
                            Object value = r.getObject(aliasBuilder.getAlias(ATTR_ALIAS, a.getName()));
                            switch (attribute.getType().getName()) {
                                case FOREIGNKEY:
                                case REFERENCE:
                                    String code = refAttrHelperService.getTargetClassForAttribute(attribute).hasAttribute(ATTR_CODE) ? toStringOrEmpty(r.getObject(aliasBuilder.getAlias(ATTR_CODE_ALIAS, a.getExpr()))) : null,
                                     description = toStringOrEmpty(r.getObject(aliasBuilder.getAlias(ATTR_DESCR_ALIAS, a.getExpr())));
                                    value = new IdAndDescriptionImpl(toLongOrNull(value), description, code);
                                    break;
                                case LOOKUP:
                                    value = isNullOrLtEqZero(toLongOrNull(value)) ? null : lookupService.getOneByTypeAndId(attribute.getType().as(LookupAttributeType.class).getLookupTypeName(), toLong(value));
                            }
                            b.withAttribute(attribute.getName(), value);
                        }));
                        b.withAttribute(JOIN_VIEW_ATTR_JOIN_ID, encodeString(r.getString(aliasBuilder.getAlias(JOIN_VIEW_ATTR_JOIN_ID))));
                    } catch (Exception ex) {
                        throw new DaoException(ex, "error reading join view query record");
                    }
                }).build());

                long total;
                if (queryOptions.isPagedAndHasFullPage(cards.size())) {
                    total = dao.getJdbcTemplate().queryForObject(format("SELECT COUNT(*) FROM ( %s ) %s", query, aliasBuilder.buildAlias("x")), Long.class);
                } else {
                    total = cards.size() + queryOptions.getOffset();
                }

                return paged(cards, total);
            }

            private String addJoinFOrReferenceReturnTargetTableAlias(String sourceTableAlias, Classe target, Attribute attribute) {
                checkArgument(attribute.isOfType(REFERENCE, FOREIGNKEY, LOOKUP), "invalid attribute type for reference join");
                String targetTableAlias = aliasBuilder.buildAliasAndStore(target.getName(), REF_TABLE_ALIAS, sourceTableAlias, attribute.getName());
                join.add(new JoinTable(target, targetTableAlias, JT_LEFT_JOIN, format("%s.%s = %s.\"Id\" AND %s.\"Status\" = 'A'", sourceTableAlias, quoteSqlIdentifier(attribute.getName()), targetTableAlias, targetTableAlias)));
                return targetTableAlias;
            }

        }

        public List<AttributeWithoutOwner> getAttributes() {
            return config.getAttributes().stream().map(a -> {
                Attribute attr = getTableByAlias(a.getExprAlias()).getAttribute(a.getExprAttr());

                return AttributeWithoutOwnerImpl.copyOf(attr).accept(b -> {
                    if (attr.getType().isOfType(REFERENCE)) {
                        ReferenceAttributeType reference = attr.getType().as(ReferenceAttributeType.class);
                        b.withType(new ForeignKeyAttributeType(dao.getDomain(reference.getDomainName()).getThisDomainWithDirection(reference.getDirection()).getTargetClass())).build();
                    }
                })
                        .withName(a.getName()).withMeta(AttributeMetadataImpl.builder()
                        .withMetadata(map(attr.getMetadata().getAll()).withoutKeys(INHERITED, UNIQUE, SHOW_IF_EXPR))
                        .withDescription(a.hasDescription() ? a.getDescription() : attr.getDescription())
                        .withShowInGrid(a.getShowInGrid())
                        .withShowInReducedGrid(a.getShowInReducedGrid())
                        .withGroup(a.getGroup())
                        .accept(b -> {
                            if (a.hasDescription()) {
                                b.withDescription(a.getDescription());
                            } else {
                                b.withDescription(attr.getDescription()).withMetadata(ATTR_DESCR_INHERITED_FROM, buildAttributeExpr(attr.getOwner().getName(), attr.getName()));
                            }
                        })
                        .build()).build();
            }).collect(toImmutableList());
        }

        private <T extends EntryType> T getTableByAlias(String alias) {
            return checkNotNull((T) tablesByAlias.get(checkNotBlank(alias)), "table not found for alias =< %s >", alias);
        }
    }

    private static class JoinTable {

        private final EntryType table;
        private final String tableAlias, onExpr;
        private final JoinType joinType;

        public JoinTable(EntryType table, String tableAlias, JoinType joinType, String onExpr) {
            this.table = checkNotNull(table);
            this.tableAlias = checkNotBlank(tableAlias);
            this.onExpr = checkNotBlank(onExpr);
            this.joinType = checkNotNull(joinType);
        }

        public <T extends EntryType> T getTable() {
            return (T) table;
        }

        public String getAlias() {
            return tableAlias;
        }

        public String getOnExpr() {
            return onExpr;
        }

        public JoinType getJoinType() {
            return joinType;
        }

    }

}
