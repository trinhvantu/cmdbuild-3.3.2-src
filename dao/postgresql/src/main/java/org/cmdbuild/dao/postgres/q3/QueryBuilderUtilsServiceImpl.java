/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.q3;

import org.cmdbuild.dao.postgres.q3.beans.WhereElement;
import org.cmdbuild.dao.postgres.q3.beans.SelectHolder;
import org.cmdbuild.dao.postgres.q3.beans.SelectElement;
import org.cmdbuild.dao.postgres.q3.beans.SelectArg;
import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Predicates.notNull;
import static com.google.common.base.Strings.nullToEmpty;
import static com.google.common.collect.ImmutableList.toImmutableList;
import com.google.common.collect.ImmutableMap;
import static com.google.common.collect.Iterables.getOnlyElement;
import static java.lang.String.format;
import java.util.Collection;
import static java.util.Collections.singleton;
import static java.util.Collections.singletonList;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import javax.annotation.Nullable;
import javax.inject.Provider;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.cmdbuild.auth.user.OperationUser;
import org.cmdbuild.auth.user.OperationUserSupplier;
import org.cmdbuild.common.beans.LookupValue;
import org.cmdbuild.cql.compiler.impl.CqlQueryImpl;
import org.cmdbuild.cql.compiler.impl.FieldImpl;
import org.cmdbuild.cql.compiler.impl.GroupImpl;
import org.cmdbuild.cql.compiler.impl.WhereImpl;
import org.cmdbuild.cql.compiler.where.Field;
import static org.cmdbuild.dao.DaoConst.NULL;
import org.cmdbuild.dao.DaoException;
import org.cmdbuild.dao.beans.RelationDirection;
import static org.cmdbuild.dao.beans.RelationDirection.RD_DIRECT;
import static org.cmdbuild.dao.beans.RelationDirection.RD_INVERSE;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_DESCRIPTION;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import org.cmdbuild.dao.driver.repository.ClasseReadonlyRepository;
import org.cmdbuild.dao.driver.repository.DomainRepository;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.EntryType;
import org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName;
import org.cmdbuild.dao.entrytype.attributetype.LookupAttributeType;
import org.cmdbuild.dao.function.StoredFunction;
import org.cmdbuild.dao.postgres.utils.SqlType;
import org.cmdbuild.dao.postgres.utils.SqlTypeName;
import static org.cmdbuild.dao.postgres.utils.SqlTypeName._bytea;
import static org.cmdbuild.dao.postgres.utils.SqlTypeName._int4;
import static org.cmdbuild.dao.postgres.utils.SqlTypeName._int8;
import static org.cmdbuild.dao.postgres.utils.SqlTypeName._varchar;
import static org.cmdbuild.dao.postgres.utils.QueryBuilderUtils.compactWhereElements;
import static org.cmdbuild.dao.postgres.utils.QueryBuilderUtils.compileCql;
import static org.cmdbuild.dao.postgres.utils.QueryBuilderUtils.getFulltextQueryParts;
import org.cmdbuild.dao.postgres.utils.SqlQueryUtils;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.Q3_MASTER;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.addSqlCastIfRequired;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.attributeTypeToSqlType;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildDescAttrName;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildLookupDescExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildReferenceDescExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.entryTypeToSqlExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.escapeLikeExpression;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.functionCallSqlExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.quoteSqlIdentifier;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.systemToSqlExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.wrapExprWithBrackets;
import static org.cmdbuild.dao.postgres.utils.SqlTypeName._regclass;
import org.cmdbuild.data.filter.AttributeFilter;
import org.cmdbuild.data.filter.AttributeFilterCondition;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.CmdbSorter;
import org.cmdbuild.data.filter.CompositeFilter;
import static org.cmdbuild.data.filter.CompositeFilter.CompositeFilterMode.CFM_AND;
import static org.cmdbuild.data.filter.CompositeFilter.CompositeFilterMode.CFM_NOT;
import static org.cmdbuild.data.filter.CompositeFilter.CompositeFilterMode.CFM_OR;
import org.cmdbuild.data.filter.FulltextFilter;
import org.cmdbuild.data.filter.FunctionFilter;
import org.cmdbuild.data.filter.RelationFilter;
import org.cmdbuild.data.filter.RelationFilterCardInfo;
import org.cmdbuild.data.filter.RelationFilterRule;
import org.cmdbuild.data.filter.SorterElementDirection;
import static org.cmdbuild.data.filter.utils.CmdbSorterUtils.serializeSorter;
import org.cmdbuild.lookup.LookupRepository;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotEmpty;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.cmdbuild.dao.driver.repository.StoredFunctionRepository;
import org.cmdbuild.dao.entrytype.AttributeImpl;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.FOREIGNKEY;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.LOOKUP;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.REFERENCE;
import static org.cmdbuild.dao.postgres.q3.QueryBuilderServiceImpl.JOIN_ID_DEFAULT;
import org.cmdbuild.dao.postgres.utils.RelationDirectionQueryHelper;
import org.cmdbuild.data.filter.AttributeFilterConditionOperator;
import static org.cmdbuild.data.filter.AttributeFilterConditionOperator.DESCRIPTION_BEGIN;
import static org.cmdbuild.data.filter.AttributeFilterConditionOperator.DESCRIPTION_CONTAINS;
import static org.cmdbuild.data.filter.AttributeFilterConditionOperator.DESCRIPTION_END;
import static org.cmdbuild.data.filter.AttributeFilterConditionOperator.DESCRIPTION_NOTBEGIN;
import static org.cmdbuild.data.filter.AttributeFilterConditionOperator.DESCRIPTION_NOTCONTAIN;
import static org.cmdbuild.data.filter.AttributeFilterConditionOperator.DESCRIPTION_NOTEND;
import org.cmdbuild.data.filter.RelationFilterRule.RelationFilterDirection;
import static org.cmdbuild.utils.lang.CmPreconditions.firstNotBlank;

@Component
public class QueryBuilderUtilsServiceImpl implements QueryBuilderUtilsService {

    private final static String ATTRIBUTE_EXPR = "cm_query_builder_helper_attribute_expr";

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final StoredFunctionRepository functionRepository;
    private final Provider<OperationUserSupplier> operationUserSupplier;//TODO: refactor and remove this; user supplier should not be accessed from dao
    private final RefAttrHelperService refAttrHelperService;
    private final ClasseReadonlyRepository classeRepository;
    private final DomainRepository domainRepository;
    private final Provider<LookupRepository> lookupRepository;//TODO improve this

    public QueryBuilderUtilsServiceImpl(Provider<LookupRepository> lookupRepository, DomainRepository domainRepository, ClasseReadonlyRepository classeRepository, Provider<OperationUserSupplier> operationUserSupplier, StoredFunctionRepository functionRepository, RefAttrHelperService refAttrHelperService) {
        this.operationUserSupplier = checkNotNull(operationUserSupplier);
        this.functionRepository = checkNotNull(functionRepository);
        this.refAttrHelperService = checkNotNull(refAttrHelperService);
        this.domainRepository = checkNotNull(domainRepository);
        this.classeRepository = checkNotNull(classeRepository);
        this.lookupRepository = checkNotNull(lookupRepository);
    }

    @Override
    public QueryBuilderHelperBuilder helper() {
        return new QueryBuilderHelperBuilder();
    }

    protected class QueryBuilderHelperImpl implements QueryBuilderHelper {

        private final AliasBuilder aliasBuilder;
        private final boolean addFromToIdentifiers;
        private final EntryType from;
        private final String fromAlias;
        private final Function<String, String> joinElementAliasSupplier, joinIdByExprSupplier;
        private final Function<String, Attribute> attributeByExprSupplier;

        private QueryBuilderHelperImpl(QueryBuilderHelperBuilder builder) {
            this.addFromToIdentifiers = firstNotNull(builder.addFromToIdentifiers, false);
            this.fromAlias = checkNotBlank(builder.fromAlias);
            this.from = checkNotNull(builder.from);
            this.aliasBuilder = checkNotNull(builder.aliasBuilder);
            this.joinElementAliasSupplier = firstNotNull(builder.joinElementAliasSupplier, (x) -> null);
            this.joinIdByExprSupplier = firstNotNull(builder.joinIdByExprSupplier, (x) -> null);
            this.attributeByExprSupplier = firstNotNull(builder.attributeByExprSupplier, from::getAttributeOrNull);
        }

        @Override
        public SelectElement processSelectArg(SelectArg arg) {
            logger.trace("process select arg = {}", arg);
            switch (arg.getType()) {
                case ST_EXPR: {
                    String expr = (String) arg.getExpr();
                    if (arg.enableExprMarkerProcessing()) {
                        logger.trace("executing explicit alias processing for expr =< {} >", expr);
                        expr = expr.replace(Q3_MASTER, fromAlias);
                        logger.trace("executed explicit alias processing for expr, output =< {} >", expr);
                    } else if (addFromToIdentifiers) {
                        if (arg.enableSmartAliasProcessing()) {
                            logger.trace("executing smart alias processing for expr =< {} >", expr);
                            //smart alias processing of expr; note: kinda weak
                            Matcher matcher = Pattern.compile("\"([^\"]+)\"").matcher(expr);
                            StringBuffer stringBuffer = new StringBuffer();
                            while (matcher.find()) {
                                matcher.appendReplacement(stringBuffer, Matcher.quoteReplacement(getAliasForJoinElement(arg.getJoinFrom()) + ".") + "$0");
                            }
                            matcher.appendTail(stringBuffer);
                            expr = stringBuffer.toString();
                            logger.trace("executed smart alias processing for expr, output =< {} >", expr);
                        } else {
                            expr = format("%s.%s", getAliasForJoinElement(arg.getJoinFrom()), expr);
                        }
                    }
                    return SelectElement.builder()
                            .withAlias(arg.hasAlias() ? arg.getAlias() : aliasBuilder.buildAlias(arg.getName()))
                            .withExpr(expr)
                            .withJoinFrom(arg.getJoinFrom())
                            .withName(arg.getName())
                            .withParams(arg.getParams())
                            .build();
                }
                case ST_FILTER: {
                    logger.trace("processing select arg of type filter = {}", arg.getExpr());
                    List<WhereElement> wheres = buildWheresForFilter(arg.getFilter());
                    String expr;
                    if (wheres.isEmpty()) {
                        expr = "TRUE";
                    } else {
                        WhereElement whereElement = compactWhereElements(wheres);
                        expr = wrapExprWithBrackets(whereElement.getExpr());
                        expr = format("COALESCE(%s, FALSE)", expr);
                    }
                    logger.trace("using filter expr = {}", expr);

                    return SelectElement.builder()
                            .withName(arg.getName())
                            .withExpr(expr)
                            .withAlias(arg.hasAlias() ? arg.getAlias() : aliasBuilder.buildAlias(arg.getName()))
                            //							.withParams(whereElement.getParams())
                            .build();
                }
                default:
                    throw new DaoException("unsupported select arg type = %s (%s)", arg.getType());
            }
        }

        @Override
        public List<WhereElement> buildWheresForFilter(CmdbFilter filter) {
            if (filter.isFalse()) {
                return singletonList(WhereElement.whereFalse());
            } else {
                List<WhereElement> list = list();
                OperationUser user = operationUserSupplier.get().getUser();//TODO this is not great (user should not be accessed from here)
                filter = filter.mapValues(map(
                        "@MY_GROUP", toStringOrEmpty(user.hasDefaultGroup() ? user.getDefaultGroup().getId() : null),
                        "@MY_USER", toStringOrEmpty(user.getId())
                ));
                if (filter.hasAttributeFilter()) {
                    list.add(buildFilterExpr(filter.getAttributeFilter()));
                }
                if (filter.hasRelationFilter()) {
                    list.add(buildFilterWhereExpr(filter.getRelationFilter()));
                }
                if (filter.hasCqlFilter()) {
                    CqlQueryImpl cql = compileCql(filter.getCqlFilter());
                    Optional.ofNullable(new CqlExprBuilder(cql.getWhere()).buildWhereExprOrNull()).ifPresent(list::add);
                }
                if (filter.hasFulltextFilter()) {
                    list.add(buildFulltextFilterWhere(filter.getFulltextFilter()));
                }
                if (filter.hasCompositeFilter()) {
                    list.addAll(buildWheresForCompositeFilter(filter.getCompositeFilter()));
                }
                if (filter.hasFunctionFilter()) {
                    list.addAll(buildWheresForFunctionFilter(filter.getFunctionFilter()));
                }
                return list;
            }
        }

        @Override
        public String attrNameToSqlIdentifierExpr(String name, String joinId) {
            String expr = quoteSqlIdentifier(name);
            if (addFromToIdentifiers) {
                expr = format("%s.%s", getAliasForJoinElement(joinId), expr);
            }
            return expr;
        }

        @Override
        public String attrNameToSqlIdentifierExpr(String expr) {
            return attrNameToSqlIdentifierExpr(Optional.ofNullable(getAttributeOrNull(expr)).map(Attribute::getName).orElse(expr), firstNotBlank(joinIdByExprSupplier.apply(expr), JOIN_ID_DEFAULT));
        }

        @Override
        public String buildDescAttrExprForLookup(Attribute a) {
            checkArgument(a.isOfType(AttributeTypeName.LOOKUP));
            return buildLookupDescExpr(fromAlias, exprForAttribute(a));
        }

        @Override
        public String buildDescAttrExprForReference(Attribute a) {
            Classe targetClass = refAttrHelperService.getTargetClassForAttribute(a);
            checkArgument(targetClass.hasAttribute(ATTR_DESCRIPTION), "cannot select description for referenced class = %s: this class does not have a description attr", targetClass);
            return buildReferenceDescExpr(targetClass, fromAlias, exprForAttribute(a));
        }

        @Override
        public String selectToExpr(SelectElement a) {
            String expr = a.getExpr();
            Attribute attr = getAttributeOrNull(a.getName());
            if (attr != null) {
                expr = addSqlCastIfRequired(attr.getType(), expr);
            }
            return format("%s %s", expr, a.getAlias());
        }

        @Override
        public String buildOrderByExprOrBlank(CmdbSorter sorter, SelectHolder select) {
            try {
                if (sorter.isNoop()) {
                    return "";
                } else {
                    List<String> sortExprList = sorter.getElements().stream().map((s) -> {
                        String name = s.getProperty();
                        String direction = s.getDirection().toSql();
                        SelectElement attr = select.getByName(name);
                        if (hasAttribute(name)) {
                            Attribute a = getAttribute(name);
                            switch (a.getType().getName()) {
                                case REFERENCE:
                                case FOREIGNKEY:
                                    attr = select.getByNameOrBuild(buildDescAttrName(name), () -> buildExtendedAttr(buildDescAttrName(name), buildDescAttrExprForReference(a)));
                                    break;
                                case LOOKUP:
                                    attr = select.getByNameOrBuild(buildDescAttrName(name), () -> buildExtendedAttr(buildDescAttrName(name), buildDescAttrExprForLookup(a)));
                                    break;
                            }
                        }
                        return format("%s %s", attr.getAlias(), direction);
                    }).collect(toList());
                    return " ORDER BY " + Joiner.on(", ").join(sortExprList);
                }
            } catch (Exception ex) {
                throw new DaoException(ex, "error processing query ordering = %s", serializeSorter(sorter));
            }
        }

        @Override
        public CmdbSorter fixAliasesInSorter(CmdbSorter s) {
            return s.isNoop() ? s : s.mapAttributeNames(from.getAliasToAttributeMap());
        }

        @Nullable
        private Attribute getAttributeOrNull(String expr) {
            checkNotBlank(expr);
            return Optional.ofNullable(attributeByExprSupplier.apply(expr)).map(a -> AttributeImpl.copyOf(a).withMeta(ATTRIBUTE_EXPR, expr).build()).orElse(null);
        }

        private boolean hasAttribute(String name) {
            return getAttributeOrNull(name) != null;
        }

        private Attribute getAttribute(String name) {
            return checkNotNull(getAttributeOrNull(name), "attribute not found for name =< %s >", name);
        }

        private SelectElement buildExtendedAttr(String name, String expr) {
            return SelectElement.build(name, expr, aliasBuilder.buildAlias(name));
        }

        private String exprForAttribute(Attribute a) {
            return quoteSqlIdentifier(a.getName());
        }

        private WhereElement buildFilterExpr(AttributeFilter filter) {
            try {
                switch (filter.getMode()) {
                    case AND:
                        return filter.hasOnlyElement() ? buildFilterExpr(filter.getOnlyElement()) : joinWhereElements(filter.getElements().stream().map(this::buildFilterExpr).collect(toList()), "AND");
                    case OR:
                        return filter.hasOnlyElement() ? buildFilterExpr(filter.getOnlyElement()) : joinWhereElements(filter.getElements().stream().map(this::buildFilterExpr).collect(toList()), "OR").mapExpr(SqlQueryUtils::wrapExprWithBrackets);
                    case SIMPLE:
                        return buildFilterExpr(filter.getCondition());
                    case NOT:
                        return buildFilterExpr(filter.getOnlyElement()).mapExpr((x) -> format("NOT %s", x));
                    default:
                        throw new UnsupportedOperationException("unsupported filter mode = " + filter.getMode());
                }
            } catch (Exception ex) {
                throw new DaoException(ex, "error processing attribute filter = %s", filter);
            }
        }

        private WhereElement joinWhereElements(Collection<WhereElement> elements, String operator) {
            String expr = elements.stream().map(WhereElement::getExpr).map(SqlQueryUtils::wrapExprWithBrackets).collect(joining(format(" %s ", operator)));
            return WhereElement.build(expr);
        }

        public WhereElement buildFilterExpr(AttributeFilterCondition condition) {
            return new ConditionExprBuilder(condition).build();
        }

        private List<WhereElement> buildWheresForFunctionFilter(FunctionFilter functionFilter) {
            OperationUser user = operationUserSupplier.get().getUser();//TODO this is not great (user should not be accessed from here)
            Long userId = user.getId(),
                    groupId = user.hasDefaultGroup() ? user.getDefaultGroup().getId() : null;
            String className = from == null ? null : from.getName();
            return functionFilter.getFunctions().stream().map(f -> {
                String functionName = f.getName();
                logger.debug("processing function filter with name =< {} >", functionName);
                StoredFunction storedFunction = functionRepository.getFunctionByName(functionName);
                logger.debug("processing function filter with function = {}", storedFunction);
                return WhereElement.build(format("%s IN (SELECT %s)", attrNameToSqlIdentifierExpr(ATTR_ID), functionCallSqlExpr(storedFunction.getName(), userId, groupId, className)));//TODO auto set filter function params, improve filter function params
            }).collect(toList());
        }

        private List<WhereElement> buildWheresForCompositeFilter(CompositeFilter compositeFilter) {
            switch (compositeFilter.getMode()) {
                case CFM_AND:
                    return compositeFilter.getElements().stream().map(this::buildWheresForFilter).flatMap(List::stream).collect(toList());
                case CFM_OR:
                    return singletonList(compactWhereElements(compositeFilter.getElements().stream().map(this::buildWheresForFilter).flatMap(List::stream).collect(toList()), "OR"));
                case CFM_NOT:
                    WhereElement element = compactWhereElements(buildWheresForFilter(compositeFilter.getElement()));
//					return singletonList(WhereElement.build(format("NOT %s", element.getExpr()), element.getParams()));
                    return singletonList(WhereElement.build(format("NOT %s", element.getExpr())));
                default:
                    throw unsupported("unsupported composite filter mode = %s", compositeFilter.getMode());
            }
        }

        private WhereElement buildFulltextFilterWhere(FulltextFilter fulltextFilter) {
            return buildFulltextFilterWhere(fulltextFilter.getQuery());
        }

        private WhereElement buildFulltextFilterWhere(String query) {
            return WhereElement.build(buildFulltextFilterExpr(query, from.getServiceAttributes()));
        }

        private String buildFulltextFilterExpr(String query, Collection<Attribute> attrs) {
            List<String> queryWords = checkNotEmpty(list(getFulltextQueryParts(checkNotBlank(query))).map(w -> format("%%%s%%", escapeLikeExpression(checkNotBlank(w)))));
            List<String> parts = attrs.stream().map((a) -> {
                List<String> list = queryWords.stream().map(queryVal -> {

                    switch (a.getType().getName()) {
                        case STRING:
                        case TEXT:
                            return format("%s ILIKE %s", attrNameToSqlIdentifierExpr(a.getName()), systemToSqlExpr(queryVal));
                        case INET:
                        case DECIMAL:
                        case INTEGER:
                        case LONG:
                        case DOUBLE:
                        case FLOAT:
                            return format("%s::varchar ILIKE %s", attrNameToSqlIdentifierExpr(a.getName()), systemToSqlExpr(queryVal));
                        case REFERENCE:
                        case FOREIGNKEY:
                            return format("%s ILIKE %s", buildDescAttrExprForReference(a), systemToSqlExpr(queryVal));//TODO use join (?)
                        case LOOKUP:
                            return format("%s ILIKE %s", buildDescAttrExprForLookup(a), systemToSqlExpr(queryVal));//TODO use join (?)
                        default:
                            return null;
                    }
                }).filter(notNull()).collect(toImmutableList());
                return list.isEmpty() ? null : list.size() == 1 ? getOnlyElement(list) : wrapExprWithBrackets(Joiner.on(" AND ").join(list));
            }).filter(notNull()).collect(toImmutableList());
            return parts.isEmpty() ? WhereElement.whereFalse().getExpr() : parts.size() == 1 ? getOnlyElement(parts) : wrapExprWithBrackets(Joiner.on(" OR ").join(parts));
        }

        private String getAliasForJoinElement(String joinId) {
            return checkNotBlank(joinElementAliasSupplier.apply(joinId), "join element alias not found for joinId =< %s >", joinId);
        }

        private WhereElement buildFilterWhereExpr(RelationFilter filter) {
            List<WhereElement> list = filter.getRelationFilterRules().stream().map(this::buildFilterExpr).collect(toList());
            if (list.size() == 1) {
                return getOnlyElement(list);
            } else {
                String expr = list.stream().map(WhereElement::getExpr).map(SqlQueryUtils::wrapExprWithBrackets).collect(joining(" AND "));
                return WhereElement.build(expr);
            }
        }

        private WhereElement buildFilterExpr(RelationFilterRule filter) {
            Domain domain = domainRepository.getDomain(filter.getDomain());
            RelationDirectionQueryHelper helper = RelationDirectionQueryHelper.forDirection(toRelationDirection(filter.getDirection()));
            String fromExpr = fromAlias, domainExpr = entryTypeToSqlExpr(domain);
            String subqueryBase = format("SELECT 1 FROM %s WHERE %s = %s.\"Id\" AND %s = %s.\"IdClass\" AND \"Status\" = 'A'", domainExpr, helper.getSourceCardIdExpr(), fromExpr, helper.getSourceClassIdExpr(), fromExpr);
            switch (filter.getType()) {
                case ANY:
                    return WhereElement.build(format("EXISTS %s", wrapExprWithBrackets(subqueryBase)));
                case NOONE:
                    return WhereElement.build(format("NOT EXISTS %s", wrapExprWithBrackets(subqueryBase)));
                case ONEOF:
                    List<String> exprs = list();
                    filter.getCardInfos().stream().map(RelationFilterCardInfo::getClassName).distinct().forEach((c) -> {
                        Classe classe = classeRepository.getClasse(c);
                        checkArgument(domain.getThisDomainWithDirection(toRelationDirection(filter.getDirection())).getTargetClasses().contains(classe), "invalid target class =< %s > for domain =< %s > with direction = %s", classe.getName(), domain.getName(), filter.getDirection());
                        Set<Long> ids = filter.getCardInfos().stream().filter((ci) -> ci.getClassName().equals(c)).map(RelationFilterCardInfo::getId).collect(toSet());
                        String idExpr;
                        if (ids.size() == 1) {
                            idExpr = format("= %s", systemToSqlExpr(getOnlyElement(ids)));
                        } else {
                            idExpr = format("= ANY (%s)", systemToSqlExpr(ids));
                        }
                        exprs.add(format("%s = %s AND %s %s", helper.getTargetClassIdExpr(), systemToSqlExpr(classe), helper.getTargetCardIdExpr(), idExpr));
                    });
                    String oneOfExpr;
                    if (exprs.size() == 1) {
                        oneOfExpr = getOnlyElement(exprs);
                    } else {
                        oneOfExpr = wrapExprWithBrackets(exprs.stream().map(SqlQueryUtils::wrapExprWithBrackets).collect(joining(" OR ")));
                    }
                    return WhereElement.build(format("EXISTS (%s AND %s)", subqueryBase, oneOfExpr));
                default:
                    throw new UnsupportedOperationException("unsupported relation filter type = " + filter.getType());
            }
        }

        private class ConditionExprBuilder {

            private final AttributeFilterCondition condition;
            private final Attribute attribute;
            private final String attrExpr;
            private final SqlType sqlType;

            private final Set<AttributeFilterConditionOperator> descriptionOperators = EnumSet.of(
                    DESCRIPTION_BEGIN,
                    DESCRIPTION_END,
                    DESCRIPTION_CONTAINS,
                    DESCRIPTION_NOTBEGIN,
                    DESCRIPTION_NOTCONTAIN,
                    DESCRIPTION_NOTEND);

            public ConditionExprBuilder(AttributeFilterCondition condition) {
                this.condition = condition;
                attribute = getAttribute(condition.getKey());
                sqlType = attributeTypeToSqlType(attribute.getType());
//                String expr = attrNameToSqlIdentifierExpr(attribute.getName());
                attrExpr = attrNameToSqlIdentifierExpr(firstNotBlank(attribute.getMetadata().get(ATTRIBUTE_EXPR), attribute.getName()));

//                switch (sqlType.getType()) {
//                    case regclass:
//                        expr = format("_cm3_utils_regclass_to_name(%s)", expr);//TODO improve this
//                        break;
//                }
//                attrExpr = expr;
                //TODO validate operator for attribute type (es INET_* operators require Inet attr type)
            }

            public WhereElement build() {
                return WhereElement.build(buildConditionExpr());
            }

            private String buildConditionExpr() {
                if (attribute.getType().getName().equals(LOOKUP) && descriptionOperators.contains(condition.getOperator())) {
                    List<Long> lookupIds = handleLookupDescriptionFilter();
                    return format("%s = ANY (%s)", attrExpr, systemToSqlExpr(lookupIds, getArraySqlType()));
                }
                switch (condition.getOperator()) {
                    case FALSE:
                        return "FALSE";
                    case ISNULL:
                        return format("%s IS NULL", attrExpr);
                    case ISNOTNULL:
                        return format("%s IS NOT NULL", attrExpr);
                    case EQUAL:
                        return hasNullSingleValue() ? format("%s IS NULL", attrExpr) : format("%s = %s", attrExpr, getSingleValue());
                    case NOTEQUAL:
                        return hasNullSingleValue() ? format("%s IS NOT NULL", attrExpr) : format("%s IS DISTINCT FROM %s", attrExpr, getSingleValue()); //note: must use distinct from to handle NULL case
                    case IN:
                        return format("%s = ANY (%s)", attrExpr, systemToSqlExpr(condition.getValues(), getArraySqlType()));
                    case BEGIN:
                        return format("%s ILIKE %s", attrExpr, getSingleValueForLike(null, "%"));
                    case DESCRIPTION_BEGIN: {
                        switch (attribute.getType().getName()) {
                            case REFERENCE:
                            case FOREIGNKEY:
                                String aliasExpr = buildDescAttrExprForReference(attribute);
                                return format("%s ILIKE %s", aliasExpr, getSingleValueForLike(null, "%"));
                            default:
                                throw new IllegalArgumentException("invalid attribute type for `description_begin` operator, type = " + attribute.getType().getName());
                        }
                    }
                    case END:
                        return format("%s ILIKE %s", attrExpr, getSingleValueForLike("%", null));
                    case DESCRIPTION_END: {
                        switch (attribute.getType().getName()) {
                            case REFERENCE:
                            case FOREIGNKEY:
                                String aliasExpr = buildDescAttrExprForReference(attribute);
                                return format("%s ILIKE %s", aliasExpr, getSingleValueForLike("%", null));
                            default:
                                throw new IllegalArgumentException("invalid attribute type for `description_end` operator, type = " + attribute.getType().getName());
                        }
                    }
                    case CONTAIN:
                        return format("%s ILIKE %s", attrExpr, getSingleValueForLike("%", "%"));
                    case DESCRIPTION_CONTAINS: {
                        switch (attribute.getType().getName()) {
                            case REFERENCE:
                            case FOREIGNKEY:
                                String aliasExpr = buildDescAttrExprForReference(attribute);
                                return format("%s ILIKE %s", aliasExpr, getSingleValueForLike("%", "%"));
                            default:
                                throw new IllegalArgumentException("invalid attribute type for `description_contains` operator, type = " + attribute.getType().getName());
                        }
                    }
                    case FULLTEXT:
                        return buildFulltextFilterExpr(condition.getSingleValue(), singleton(attribute));
                    case LIKE:
                        return format("%s ILIKE %s", attrExpr, getSingleValueForLike(null, null));
                    case NOTBEGIN:
                        return format("( %s IS NULL OR NOT %s ILIKE %s )", attrExpr, attrExpr, getSingleValueForLike(null, "%"));
                    case DESCRIPTION_NOTBEGIN: {
                        switch (attribute.getType().getName()) {
                            case REFERENCE:
                            case FOREIGNKEY:
                                String aliasExpr = buildDescAttrExprForReference(attribute);
                                return format("( %s IS NULL OR NOT %s ILIKE %s )", aliasExpr, aliasExpr, getSingleValueForLike(null, "%"));
                            default:
                                throw new IllegalArgumentException("invalid attribute type for `description_end` operator, type = " + attribute.getType().getName());
                        }
                    }
                    case NOTCONTAIN:
                        return format("( %s IS NULL OR NOT %s ILIKE %s )", attrExpr, attrExpr, getSingleValueForLike("%", "%"));
                    case DESCRIPTION_NOTCONTAIN: {
                        switch (attribute.getType().getName()) {
                            case REFERENCE:
                            case FOREIGNKEY:
                                String aliasExpr = buildDescAttrExprForReference(attribute);
                                return format("( %s IS NULL OR NOT %s ILIKE %s )", aliasExpr, aliasExpr, getSingleValueForLike("%", "%"));
                            default:
                                throw new IllegalArgumentException("invalid attribute type for `description_end` operator, type = " + attribute.getType().getName());
                        }
                    }
                    case NOTEND:
                        return format("( %s IS NULL OR NOT %s ILIKE %s )", attrExpr, attrExpr, getSingleValueForLike("%", null));
                    case DESCRIPTION_NOTEND: {
                        switch (attribute.getType().getName()) {
                            case REFERENCE:
                            case FOREIGNKEY:
                                String aliasExpr = buildDescAttrExprForReference(attribute);
                                return format("( %s IS NULL OR NOT %s ILIKE %s )", aliasExpr, aliasExpr, getSingleValueForLike("%", null));
                            default:
                                throw new IllegalArgumentException("invalid attribute type for `description_end` operator, type = " + attribute.getType().getName());
                        }
                    }
                    case GREATER:
                        return format("%s > %s", attrExpr, getSingleValue());
                    case LESS:
                        return format("%s < %s", attrExpr, getSingleValue());
                    case BETWEEN:
                        checkArgument(condition.getValues().size() == 2, "between operator requires exactly two parameters");
                        return format("%s BETWEEN %s AND %s", attrExpr, systemToSqlExpr(condition.getValues().get(0)), systemToSqlExpr(condition.getValues().get(1)));
                    case NET_CONTAINED:
                        return format("%s << %s", attrExpr, getSingleValue());
                    case NET_CONTAINEDOREQUAL:
                        return format("%s <<= %s", attrExpr, getSingleValue());
                    case NET_CONTAINS:
                        return format("%s >> %s", attrExpr, getSingleValue());
                    case NET_CONTAINSOREQUAL:
                        return format("%s >>= %s", attrExpr, getSingleValue());
                    case NET_RELATION:
                        String valueExpr = getSingleValue();
                        return format("( %s <<= %s OR %s = %s OR %s >>= %s )", attrExpr, valueExpr, attrExpr, valueExpr, attrExpr, valueExpr);
                    default:
                        throw new UnsupportedOperationException("unsupported condition operator = " + condition.getOperator());
                }
            }

            private List<Long> handleLookupDescriptionFilter() {
                List<LookupValue> lookupByType = lookupRepository.get().getAllByType(((LookupAttributeType) attribute.getType()).getLookupTypeName())
                        .stream().filter(l -> isNotBlank(l.getDescription())).collect(toList());
                switch (condition.getOperator()) {
                    case DESCRIPTION_BEGIN:
                        return lookupByType.stream().filter(l -> l.getDescription().startsWith(condition.getSingleValue()))
                                .map(LookupValue::getId).collect(toList());
                    case DESCRIPTION_END:
                        return lookupByType.stream().filter(l -> l.getDescription().endsWith(condition.getSingleValue()))
                                .map(l -> l.getId()).collect(toList());
                    case DESCRIPTION_CONTAINS:
                        return lookupByType.stream().filter(l -> l.getDescription().contains(condition.getSingleValue()))
                                .map(l -> l.getId()).collect(toList());
                    case DESCRIPTION_NOTBEGIN:
                        return lookupByType.stream().filter(l -> !l.getDescription().startsWith(condition.getSingleValue()))
                                .map(l -> l.getId()).collect(toList());
                    case DESCRIPTION_NOTCONTAIN:
                        return lookupByType.stream().filter(l -> !l.getDescription().contains(condition.getSingleValue()))
                                .map(l -> l.getId()).collect(toList());
                    case DESCRIPTION_NOTEND:
                        return lookupByType.stream().filter(l -> !l.getDescription().endsWith(condition.getSingleValue()))
                                .map(l -> l.getId()).collect(toList());
                    default:
                        throw new UnsupportedOperationException("unsupported condition operator = " + condition.getOperator());
                }
            }

            @Nullable
            private SqlTypeName getArraySqlType() {
                switch (sqlType.getType()) {
                    case int4:
                        return _int4;
                    case int8:
                        return _int8;
                    case varchar:
                        return _varchar;
                    case bytea:
                        return _bytea;
                    case regclass:
                        return _regclass;
                    default:
                        return null;//TODO improve this;
                }
            }

            private boolean hasNullSingleValue() {
                return equal(NULL, getSingleValue());
            }

            private String getSingleValue() {
                Object value = condition.getSingleValue();
                if (isNotBlank(value)) {
                    switch (attribute.getType().getName()) {
                        case LOOKUP:
                            value = lookupRepository.get().getOneByTypeAndCodeOrId(attribute.getType().as(LookupAttributeType.class).getLookupTypeName(), value).getId();//TODO improve this, move conversion elsewhere
                            break;
                    }
                }
                return systemToSqlExpr(value, attribute);
            }

            private String getSingleValueForLike(@Nullable String before, @Nullable String after) {
                return systemToSqlExpr(nullToEmpty(before) + escapeLikeExpression(checkNotBlank(condition.getSingleValue())) + nullToEmpty(after));
            }

        }

        private class CqlExprBuilder {

            private final WhereImpl cqlWhere;

            public CqlExprBuilder(WhereImpl cqlWhere) {
                this.cqlWhere = checkNotNull(cqlWhere);
            }

            @Nullable
            public WhereElement buildWhereExprOrNull() {
                String whereExpr = buildWhereExprOrNull(cqlWhere);
                if (isBlank(whereExpr)) {
                    return null;
                } else {
                    return WhereElement.build(whereExpr);
                }
            }

            @Nullable
            private String buildWhereExprOrNull(org.cmdbuild.cql.compiler.where.WhereElement whereElement) {
                if (whereElement instanceof FieldImpl) {
                    return buildWhereExpr((FieldImpl) whereElement);
                } else if (whereElement instanceof GroupImpl || whereElement instanceof WhereImpl) {
                    return whereElement.getElements().stream().map(this::buildWhereExprOrNull).collect(joining(" AND "));
                } else {
                    throw unsupported("unsupported cql where element = %s", whereElement);
                }
            }
//        private boolean selectHasAttrWithName(String name) {
//            return select.stream().map(SelectElement::getName).anyMatch(equalTo(name));
//        }

            private String buildWhereExpr(FieldImpl field) {
                String name = field.getId().getId();
                String attrExpr;
//                if (selectHasAttrWithName(name)) { TODO check this
//                    SelectElement attr = getAttrFromSelectByName(name);
//                    attrExpr = attr.getExpr();
//                } else {
                attrExpr = attrNameToSqlIdentifierExpr(name);
//                }
                Attribute attribute = getAttribute(name);
                switch (field.getOperator()) {
                    case EQ: {
                        Object value = getFieldValue(field);
                        boolean isNot = firstNotNull(field.isNot(), false);
                        String operator = isNot ? "<>" : "=";
                        if (value == null) {
                            return format("%s IS NULL", attrExpr);
                        } else {
                            switch (getOnlyElement(field.getValues()).getType()) {
                                case NATIVE:
                                    return format("%s %s %s", attrExpr, operator, wrapExprWithBrackets(toStringNotBlank(value)));
                                default:
                                    return format("%s %s %s", attrExpr, operator, systemToSqlExpr(value, attribute));
                            }
                        }
                    }
                    //TODO add support for NOT in the below cases like for EQ
                    case GT: {
                        Object value = checkNotNull(getFieldValue(field));
                        switch (getOnlyElement(field.getValues()).getType()) {
                            case NATIVE:
                                return format("%s > %s", attrExpr, wrapExprWithBrackets(toStringNotBlank(value)));
                            default:
                                return format("%s > %s", attrExpr, systemToSqlExpr(value, attribute));
                        }
                    }
                    case LT: {
                        Object value = checkNotNull(getFieldValue(field));
                        switch (getOnlyElement(field.getValues()).getType()) {
                            case NATIVE:
                                return format("%s < %s", attrExpr, wrapExprWithBrackets(toStringNotBlank(value)));
                            default:
                                return format("%s < %s", attrExpr, systemToSqlExpr(value, attribute));
                        }
                    }
                    case IN: {
                        Object value = getFieldValue(field);
                        if (value == null) {
                            return format("%s IS NULL", attrExpr);
                        } else {
                            switch (getOnlyElement(field.getValues()).getType()) {
                                case NATIVE:
                                    return format("%s IN %s", attrExpr, wrapExprWithBrackets(toStringNotBlank(value)));
                                default:
                                    throw unsupported("unsupported cql field value type = %s", getOnlyElement(field.getValues()).getType());
                            }
                        }
                    }
                    default:
                        throw unsupported("unsupported cql operator = %s", field.getOperator());
                }
            }

            @Nullable
            private Object getFieldValue(FieldImpl field) {
                Field.FieldValue value = getOnlyElement(field.getValues(), null);
                if (value == null) {
                    return null;
                } else {
                    return value.getValue();
                }
            }

        }
    }

    public class QueryBuilderHelperBuilder implements Builder<QueryBuilderHelper, QueryBuilderHelperBuilder> {

        private Boolean addFromToIdentifiers;
        private String fromAlias;
        private AliasBuilder aliasBuilder;
        private EntryType from;
        private Function<String, String> joinElementAliasSupplier, joinIdByExprSupplier;
        private Function<String, Attribute> attributeByExprSupplier;

        public QueryBuilderHelperBuilder withAttributeByExprSupplier(Function<String, Attribute> attributeByExprSupplier) {
            this.attributeByExprSupplier = attributeByExprSupplier;
            return this;
        }

        public QueryBuilderHelperBuilder withJoinIdByExprSupplier(Function<String, String> joinIdByExprSupplier) {
            this.joinIdByExprSupplier = joinIdByExprSupplier;
            return this;
        }

        public QueryBuilderHelperBuilder withAddFromToIdentifiers(Boolean addFromToIdentifiers) {
            this.addFromToIdentifiers = addFromToIdentifiers;
            return this;
        }

        public QueryBuilderHelperBuilder withFromAlias(String fromAlias) {
            this.fromAlias = fromAlias;
            return this;
        }

        public QueryBuilderHelperBuilder withFrom(EntryType from) {
            this.from = from;
            return this;
        }

        public QueryBuilderHelperBuilder withAliasBuilder(AliasBuilder aliasBuilder) {
            this.aliasBuilder = aliasBuilder;
            return this;
        }

        public QueryBuilderHelperBuilder withJoinElementAliasSupplier(Function<String, String> joinElementAliasSupplier) {
            this.joinElementAliasSupplier = joinElementAliasSupplier;
            return this;
        }

        @Override
        public QueryBuilderHelper build() {
            return new QueryBuilderHelperImpl(this);
        }

    }

    private static RelationDirection toRelationDirection(RelationFilterDirection d) {
        switch (d) {
            case _1:
                return RD_DIRECT;
            case _2:
                return RD_INVERSE;
            default:
                throw new UnsupportedOperationException();
        }
    }

}
