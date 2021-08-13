/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.q3;

import org.cmdbuild.dao.postgres.q3.beans.SelectHolder;
import org.cmdbuild.dao.postgres.q3.beans.SelectElement;
import org.cmdbuild.dao.postgres.q3.beans.SelectArg;
import org.cmdbuild.dao.postgres.q3.beans.AbstractResultRow;
import org.cmdbuild.dao.postgres.q3.beans.PreparedQueryExt;
import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Predicates.not;
import com.google.common.collect.ImmutableList;
import static com.google.common.collect.ImmutableList.toImmutableList;
import com.google.common.collect.Ordering;
import static java.lang.String.format;
import java.util.Collection;
import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.dao.DaoException;
import org.cmdbuild.dao.beans.CMRelation;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.CardImpl;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDCLASS;
import static org.cmdbuild.dao.core.q3.DaoService.COUNT;
import static org.cmdbuild.dao.core.q3.DaoService.ROW_NUMBER;
import org.cmdbuild.dao.core.q3.PreparedQuery;
import org.cmdbuild.dao.core.q3.ResultRow;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import org.cmdbuild.dao.driver.repository.ClasseReadonlyRepository;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.EntryType;
import org.cmdbuild.dao.orm.CardMapperService;
import org.cmdbuild.dao.postgres.q3.SuperclassQueryBuilderService.SuperclassSubclassQuery;
import org.cmdbuild.dao.postgres.services.QueryService;
import static org.cmdbuild.dao.postgres.q3.beans.SelectType.ST_FILTER;
import org.cmdbuild.dao.postgres.q3.beans.SuperclassSubclassQueryImpl;
import org.cmdbuild.dao.postgres.q3.beans.WhereArg;
import static org.cmdbuild.dao.postgres.utils.QueryBuilderUtils.buildOffsetLimitExprOrBlank;
import static org.cmdbuild.dao.postgres.utils.QueryBuilderUtils.getReservedAttrs;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildCodeAttrName;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildDescAttrName;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildTypeAttrName;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.parseEntryTypeQueryResponseData;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.quoteSqlIdentifier;
import org.cmdbuild.data.filter.CmdbSorter;
import org.cmdbuild.data.filter.beans.AttributeFilterConditionImpl;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmCollectionUtils.listOf;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowFunction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class SuperclassQueryBuilderServiceImpl implements SuperclassQueryBuilderService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final ClasseReadonlyRepository classeRepository;
    private final QueryService queryService;
    private final CardMapperService mapper;
    private final QueryBuilderUtilsService utils;
    private final QueryBuilderInnerService helperService;

    public SuperclassQueryBuilderServiceImpl(ClasseReadonlyRepository classeRepository, QueryService queryService, CardMapperService mapper, QueryBuilderUtilsService utils, QueryBuilderInnerService helperService) {
        this.classeRepository = checkNotNull(classeRepository);
        this.queryService = checkNotNull(queryService);
        this.mapper = checkNotNull(mapper);
        this.utils = checkNotNull(utils);
        this.helperService = checkNotNull(helperService);
    }

    @Override
    public PreparedQuery buildQuery(SuperclassQuery query) {
        return new SuperclassQueryHelper(query).buildQuery();
    }

    private class SuperclassQueryHelper {

        private final AliasBuilder aliasBuilder = new AliasBuilder();

        private final SuperclassQuery options;

        private int subclassQueryIndexSequence = 0;

        public SuperclassQueryHelper(SuperclassQuery query) {
            this.options = checkNotNull(query);
        }

        public PreparedQuery buildQuery() {
            Classe superclass = options.getSuperclass();
            DaoQueryOptions queryOptions = options.getOptions();
            String superclassAlias = aliasBuilder.buildAlias(superclass.getName());

            SelectHolder select = new SelectHolder();

            QueryBuilderHelper helper = utils.helper()
                    .withAddFromToIdentifiers(false)
                    .withAliasBuilder(aliasBuilder)
                    .withFrom(superclass)
                    .withFromAlias(superclassAlias)
                    .build();

            CmdbSorter sorter = helper.fixAliasesInSorter(queryOptions.getSorter());

            List<SelectArg> selectArgs = list();

            Collection<String> reservedAttrs = getReservedAttrs(superclass);
            reservedAttrs.stream().map(a -> SelectArg.build(a, quoteSqlIdentifier(a))).forEach(selectArgs::add);
            superclass.getCoreAttributes().stream().filter(Attribute::isActive).map(Attribute::getName).filter(not(reservedAttrs::contains))
                    .filter(a -> (!queryOptions.hasAttrs() && !options.isCount()) || queryOptions.getAttrs().contains(a) || sorter.hasAttr(a))//TODO fix this, also add attrs from WHERE (?)
                    .sorted(Ordering.natural()).map(a -> SelectArg.build(a, quoteSqlIdentifier(a))).forEach(selectArgs::add);

            List<SelectArg> customSelectArgs = options.getCustomSelectArgs().stream().map(s -> SelectArg.copyOf(s).withAlias(s.hasAlias() ? s.getAlias() : aliasBuilder.buildAlias(s.getName())).build()).collect(toImmutableList());
            selectArgs.addAll(customSelectArgs);

            selectArgs.stream().map(helper::processSelectArg).forEach(select::add);

            List<SelectArg> subclassSelectArgs = select.stream().filter(e -> options.getSuperclass().hasAttribute(e.getName())).map(SelectElement::toSelectArg).collect(toList());
            subclassSelectArgs.addAll(customSelectArgs);

            List<SubclassQueryElementWithMetadata<SuperclassSubclassQuery>> preprocessedSubclassQueries = listOf(SuperclassSubclassQuery.class).accept(l -> {
                Collection<String> subclassesWithoutFilter = options.getSubclassQueries().stream()
                        .filter(not(SuperclassSubclassQuery::hasFiltersOrWhereArgs))
                        .map(SuperclassSubclassQuery::getSubclass)
                        .map(Classe::getName).collect(toSet());
                if (!subclassesWithoutFilter.isEmpty()) {
                    l.add(new SuperclassSubclassQueryImpl(superclass, AttributeFilterConditionImpl.in(ATTR_IDCLASS, subclassesWithoutFilter).toAttributeFilter().toCmdbFilters(), emptyList(), options.getWhereArgs()));
                }
                options.getSubclassQueries().stream().filter(SuperclassSubclassQuery::hasFiltersOrWhereArgs).forEach(l::add);
            }).stream().map(s -> {
                List<SelectArg> extraSelectArgs = s.getMatchFilters().stream().map(m -> SelectArg.builder().withName(m.getName()).withFilter(m.getFilter()).withType(ST_FILTER).withAlias(aliasBuilder.buildAlias(m.getName())).build()).collect(toImmutableList());
                logger.debug("extra select args = {}", extraSelectArgs);
                return new SubclassQueryElementWithMetadata<>(subclassQueryIndexSequence++, s, extraSelectArgs);
            }).collect(toImmutableList());

            List<SubclassQueryElementWithMetadata<PreparedQueryExt>> subqueries = preprocessedSubclassQueries.stream().map(p -> {
                logger.debug("prepare subquery = {} with extra select args = {}", p.getElement().getSubclass().getName(), p.getExtraSelectArgs());
                return new SubclassQueryElementWithMetadata<>(p.getIndex(), buildSubquery(p.getElement(), list(subclassSelectArgs).with(p.getExtraSelectArgs())), p.getExtraSelectArgs());
            }).collect(toList());

            subqueries.removeIf(s -> s.getElement().hasFalseFilter());//TODO do not remove all elements!!
            if (subqueries.isEmpty()) {
                return () -> emptyList();
            }//TODO handle single subquery case (short circuit)

//            List<SelectArg> extraSelectArgs = list();
//            List<PreparedQueryExt> subqueries = options.getSubclassQueries().stream().map(s -> {
//                List<SelectArg> thisSubclassSelectArgs = list(subclassSelectArgs).accept(l -> {
//                    s.getMatchFilters().stream().map(m -> new SelectArg(m.getName(), m.getFilter()).witAlias(aliasBuilder.buildAlias(m.getName()))).forEach(sa -> {
//                        l.add(sa);
//                        extraSelectArgs.add(sa);
//                    });
//                });
//                return buildSubquery(s, thisSubclassSelectArgs);
//            }).collect(toImmutableList());
            //TODO improve this, avoid duplicate code etc
            list(subclassSelectArgs).stream().filter(e -> options.getSuperclass().hasAttribute(e.getName())).forEach(s -> {
                switch (options.getSuperclass().getAttribute(s.getName()).getType().getName()) {
                    case LOOKUP:
                        select.add(SelectElement.build(buildCodeAttrName(s.getName()), "_", aliasBuilder.buildAlias(buildCodeAttrName(s.getName()))));
                        select.add(SelectElement.build(buildDescAttrName(s.getName()), "_", aliasBuilder.buildAlias(buildDescAttrName(s.getName()))));
                        break;
                    case REFERENCE:
                    case FOREIGNKEY:
                        select.add(SelectElement.build(buildCodeAttrName(s.getName()), "_", aliasBuilder.buildAlias(buildCodeAttrName(s.getName()))));
                        select.add(SelectElement.build(buildDescAttrName(s.getName()), "_", aliasBuilder.buildAlias(buildDescAttrName(s.getName()))));
                        select.add(SelectElement.build(buildTypeAttrName(s.getName()), "_", aliasBuilder.buildAlias(buildTypeAttrName(s.getName()))));
                }
            });

            subqueries.stream().flatMap(sq -> sq.getExtraSelectArgs().stream()).forEach(sa -> {
                select.add(SelectElement.build(sa.getName(), "_", sa.getAlias()));
            });

            String query = subqueries.stream().map(thisSq -> {
                PreparedQueryExt q = thisSq.getElement();
                String subquery = q.getQuery();
                if (subqueries.stream().anyMatch(s -> !s.getExtraSelectArgs().isEmpty()) || !equal(list(q.getSelect()).map(SelectElement::getAlias), list(subclassSelectArgs).map(SelectArg::getAlias))) {
                    List<String> selectExprs = subclassSelectArgs.stream().map(s -> {  //TODO improve this
                        String otherAlias = q.getSelectForAttr(s.getName()).getAlias();
                        if (equal(s.getAlias(), otherAlias)) {
                            return otherAlias;
                        } else {
                            return format("%s %s", otherAlias, s.getAlias());
                        }
                    }).collect(toList());
                    subclassSelectArgs.stream().flatMap(a -> list(buildTypeAttrName(a.getName()), buildDescAttrName(a.getName()), buildCodeAttrName(a.getName())).stream()).map(q::getSelectForAttrOrNull).filter(Objects::nonNull).map(s -> {//TODO improve this
                        String otherAlias = select.getByName(s.getName()).getAlias();
                        if (equal(s.getAlias(), otherAlias)) {
                            return otherAlias;
                        } else {
                            return format("%s %s", s.getAlias(), otherAlias);
                        }
                    }).forEach(selectExprs::add);
                    subqueries.stream().forEach(anysq -> {
                        if (anysq.getIndex() == thisSq.getIndex()) {
                            anysq.getExtraSelectArgs().stream().map(SelectArg::getAlias).forEach(selectExprs::add);
                        } else {
                            anysq.getExtraSelectArgs().stream().map(sa -> format("NULL%s %s", sa.getName().startsWith("cm_filter_mark_") ? "::boolean" : "", sa.getAlias())).forEach(selectExprs::add);//TODO improve type handling !!
                        }
                    });
                    subquery = format("SELECT %s FROM (%s) %s", Joiner.on(", ").join(selectExprs), subquery, aliasBuilder.buildAlias("x"));
                }
                return subquery;
            }).collect(joining(" UNION ALL "));

            switch (options.getQueryMode()) {
                case QM_ROWNUMBER:
                    checkArgument(options.getOptions().hasPositionOf());
                    String rowNumberAlias = aliasBuilder.buildAlias(ROW_NUMBER),
                     attrIdAlias = select.getByName(ATTR_ID).getAlias();
                    query += helper.buildOrderByExprOrBlank(sorter, select);
                    query = format("SELECT * FROM (SELECT %s, ROW_NUMBER() OVER () AS %s FROM (%s) %s) %s WHERE %s = %s",
                            attrIdAlias, rowNumberAlias, query, aliasBuilder.buildAlias("rd_inner"), aliasBuilder.buildAlias("rd_outher"), attrIdAlias, options.getOptions().getPositionOf());
                    return new PreparedQueryImpl(query, singletonList(SelectElement.build(ROW_NUMBER, "_", rowNumberAlias)));
                case QM_COUNT:
                    query = format("SELECT COUNT(*) _count FROM (%s) %s", query, aliasBuilder.buildAlias("x"));
                    return new PreparedQueryImpl(query, singletonList(SelectElement.build(COUNT, "_", "_count")));
                case QM_SIMPLE:
                    query += helper.buildOrderByExprOrBlank(sorter, select);
                    query += buildOffsetLimitExprOrBlank(options.getOptions());
                    return new PreparedQueryImpl(query, select.getElements());
                default:
                    throw unsupported("unsupported query mode = %s", options.getQueryMode());
            }

        }
// private class SuperclassSubclassQueryImpl implements SuperclassSubclassQuery {
//
//                private final Classe subclass;
//                private final CmdbFilter filter;
//                private final List<MatchFilter> matchFilters;
//                private final List<WhereArg> where;
//
//                public SuperclassSubclassQueryImpl() {
//                    this.subclass = checkNotNull(SuperclassQueryHelper.this.classe);
//                    this.filter = firstNotNull(SuperclassQueryHelper.this.filter, noopFilter());
//                    this.matchFilters = ImmutableList.copyOf(SuperclassSubclassQueryBuilderHelperImpl.this.matchFilters);
//                    this.where = ImmutableList.copyOf(SuperclassSubclassQueryBuilderHelperImpl.this.where);
//                }
//
//                @Override
//                public Classe getSubclass() {
//                    return subclass;
//                }
//
//                @Override
//                public CmdbFilter getFilter() {
//                    return filter;
//                }
//
//                @Override
//                public List<MatchFilter> getMatchFilters() {
//                    return matchFilters;
//                }
//
//                @Override
//                public List<WhereArg> getWhereArgs() {
//                    return where;
//                }
//
//            }

        private PreparedQueryExt buildSubquery(SuperclassSubclassQuery subclassOptions, List<SelectArg> selectArgs) {
            Classe subclass = subclassOptions.getSubclass();
            DaoQueryOptions queryOptions = DaoQueryOptionsImpl.builder().withFilter(options.getOptions().getFilter().and(subclassOptions.getFilter())).build();
            return helperService.buildPreparedQuery(new QueryBuilderParams() {
                @Override
                public EntryType getFrom() {
                    return subclass;
                }

                @Override
                public DaoQueryOptions getQueryOptions() {
                    return queryOptions;
                }

                @Override
                public List<SelectArg> getSelectArgs() {
                    return selectArgs;
                }

                @Override
                public boolean getJoinForRefCodeDescription() {
                    return true;
                }

                @Override
                public List<WhereArg> getWhere() {
                    return list(options.getWhereArgs()).with(subclassOptions.getWhereArgs());
                }
            });
        }

        private class PreparedQueryImpl implements PreparedQuery {

            private final Classe superclass;
            private final String query;
            private final List<SelectElement> select;

            public PreparedQueryImpl(String preparedQuery, List<SelectElement> select) {
                this.query = checkNotBlank(preparedQuery);
                this.superclass = SuperclassQueryHelper.this.options.getSuperclass();
                this.select = ImmutableList.copyOf(select);
            }

            @Override
            public List<ResultRow> run() {
                logger.trace("execute query:\n\tquery = {} ", query);
                try {
                    return queryService.query(query, rethrowFunction(rs -> {

                        Map<String, Object> data = parseEntryTypeQueryResponseData(superclass, select, SelectElement::getName, rethrowFunction(s -> rs.getObject(s.getAlias())));
                        String classId = toStringOrNull(data.get(ATTR_IDCLASS));
                        Classe classe = isBlank(classId) ? superclass : classeRepository.getClasse(classId);
                        return new ResultRowImpl(classe, data);
                    }));
                } catch (Exception ex) {
                    throw new DaoException(ex, "error executing query = '%s'", query);
                }
            }
        }
    }

    private static class SubclassQueryElementWithMetadata<T> {

        private final int index;
        private final T element;
        private final List<SelectArg> extraSelectArgs;

        public SubclassQueryElementWithMetadata(int index, T element, List<SelectArg> extraSelectArgs) {
            this.index = index;
            this.element = checkNotNull(element);
            this.extraSelectArgs = ImmutableList.copyOf(extraSelectArgs);
        }

        public int getIndex() {
            return index;
        }

        public T getElement() {
            return element;
        }

        public List<SelectArg> getExtraSelectArgs() {
            return extraSelectArgs;
        }

    }

    private class ResultRowImpl extends AbstractResultRow implements ResultRow {

        private final Classe classe;
        private final Map<String, Object> data;

        public ResultRowImpl(Classe classe, Map<String, Object> data) {
            this.classe = checkNotNull(classe);
            this.data = checkNotNull(data);
        }

        @Override
        public <T> T toModel(Class<T> type) {
            return (T) mapper.getMapperForModelOrBuilder(type).cardToObject(toCard());
        }

        @Override
        public Map<String, Object> asMap() {
            return data;
        }

        @Override
        public <T> T toModel() {
            return (T) mapper.cardToObject(toCard());
        }

        @Override
        public Card toCard() {
            return CardImpl.buildCard(classe, data);
        }

        @Override
        public CMRelation toRelation() {
            throw new UnsupportedOperationException();
        }

    }

}
