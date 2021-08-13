/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.q3;

import org.cmdbuild.dao.postgres.q3.beans.MatchFilter;
import org.cmdbuild.dao.postgres.q3.beans.QueryMode;
import org.cmdbuild.dao.postgres.q3.beans.SelectArg;
import org.cmdbuild.dao.core.q3.SuperclassQueryService;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.ImmutableList;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static java.util.Collections.emptyMap;
import java.util.List;
import java.util.function.Consumer;
import org.cmdbuild.dao.core.q3.CompositeWhereHelper;
import org.cmdbuild.dao.core.q3.CompositeWhereOperator;
import org.cmdbuild.dao.core.q3.PreparedQuery;
import org.cmdbuild.dao.core.q3.WhereOperator;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import static org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl.emptyOptions;
import org.cmdbuild.dao.driver.repository.ClasseReadonlyRepository;
import org.cmdbuild.dao.entrytype.Classe;
import static org.cmdbuild.dao.postgres.q3.beans.QueryMode.QM_COUNT;
import static org.cmdbuild.dao.postgres.q3.beans.QueryMode.QM_ROWNUMBER;
import static org.cmdbuild.dao.postgres.q3.beans.QueryMode.QM_SIMPLE;
import org.cmdbuild.dao.postgres.q3.QueryBuilderServiceImpl.CompositeWhereHelperImpl;
import org.cmdbuild.dao.postgres.q3.SuperclassQueryBuilderService.SuperclassQuery;
import org.cmdbuild.dao.postgres.q3.SuperclassQueryBuilderService.SuperclassSubclassQuery;
import org.cmdbuild.dao.postgres.q3.beans.SuperclassSubclassQueryImpl;
import org.cmdbuild.dao.postgres.q3.beans.WhereArg;
import static org.cmdbuild.dao.postgres.utils.QueryBuilderUtils.buildSelectArgForExpr;
import org.cmdbuild.data.filter.CmdbFilter;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmNullableUtils.firstNotNull;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class SuperclassQueryServiceImpl implements SuperclassQueryService {

    private final ClasseReadonlyRepository classeRepository;
    private final SuperclassQueryBuilderService processorService;

    public SuperclassQueryServiceImpl(ClasseReadonlyRepository classeRepository, SuperclassQueryBuilderService processorService) {
        this.classeRepository = checkNotNull(classeRepository);
        this.processorService = checkNotNull(processorService);
    }

    @Override
    public SuperclassQueryBuilderHelper queryFromSuperclass(String classId) {
        return queryFromSuperclass(classeRepository.getClasse(classId));
    }

    @Override
    public SuperclassQueryBuilderHelper queryFromSuperclass(Classe classe) {
        return new SuperclassQueryBuilderHelperImpl(classe);
    }

    private class SuperclassQueryBuilderHelperImpl implements SuperclassQueryBuilderHelper {

        private QueryMode queryMode;
        private final Classe superclass;
        private DaoQueryOptions queryOptions;
        private final List<SuperclassSubclassQueryBuilderHelperImpl> subclasses = list();
        private final List<SelectArg> customSelectArgs = list();
        private final List<WhereArg> where = list();

        public SuperclassQueryBuilderHelperImpl(Classe superclass) {
            this.superclass = checkNotNull(superclass);
            checkArgument(superclass.isSuperclass());
        }

        @Override
        public SuperclassQueryBuilderHelperImpl where(String attr, WhereOperator operator, Object... params) { //TODO duplicate code, see CommonQueryBuilderMethods, improve this
            where.add(WhereArg.build(attr, operator, emptyMap(), list(params)));
            return this;
        }

        @Override
        public SuperclassQueryBuilderHelperImpl where(CompositeWhereOperator operator, Consumer<CompositeWhereHelper> consumer) { //TODO duplicate code, see CommonQueryBuilderMethods, improve this
            CompositeWhereHelperImpl helper = new CompositeWhereHelperImpl();
            consumer.accept(helper);
            where.add(WhereArg.build(operator, helper.inners));
            return this;
        }

        @Override
        public SuperclassQueryBuilderHelper withOptions(DaoQueryOptions options) {
            this.queryOptions = options;
            return this;
        }

        @Override
        public SuperclassSubclassQueryBuilderHelper withSubclass(String classId) {
            return this.withSubclass(classeRepository.getClasse(classId));
        }

        @Override
        public SuperclassSubclassQueryBuilderHelper withSubclass(Classe classe) {
            SuperclassSubclassQueryBuilderHelperImpl sub = new SuperclassSubclassQueryBuilderHelperImpl(classe);
            subclasses.add(sub);
            return sub;
        }

        @Override
        public SuperclassQueryBuilderHelper selectExpr(String name, String expr) {
            customSelectArgs.add(buildSelectArgForExpr(name, expr));
            return this;
        }

        @Override
        public PreparedQuery build() {
            return processorService.buildQuery(new SuperclassQueryImpl());
        }

        @Override
        public long count() {
            queryMode = QM_COUNT;
            return processorService.buildQuery(new SuperclassQueryImpl()).getCount();
        }

        @Override
        public Long getRowNumber() {
            queryMode = QM_ROWNUMBER;
            return processorService.buildQuery(new SuperclassQueryImpl()).getRowNumberOrNull();
        }

        private class SuperclassQueryImpl implements SuperclassQuery {

            private final QueryMode queryMode;
            private final Classe superclass;
            private final DaoQueryOptions queryOptions;
            private final List<SuperclassSubclassQuery> subclassQueries;
            private final List<SelectArg> customSelectArgs;
            private final List<WhereArg> where;

            public SuperclassQueryImpl() {
                this.superclass = checkNotNull(SuperclassQueryBuilderHelperImpl.this.superclass);
                this.queryOptions = firstNotNull(SuperclassQueryBuilderHelperImpl.this.queryOptions, emptyOptions());
                this.subclassQueries = SuperclassQueryBuilderHelperImpl.this.subclasses.stream().map(s -> s.toSuperclassSubclassQuery()).collect(toImmutableList());
                this.queryMode = firstNotNull(SuperclassQueryBuilderHelperImpl.this.queryMode, QM_SIMPLE);
                this.customSelectArgs = ImmutableList.copyOf(SuperclassQueryBuilderHelperImpl.this.customSelectArgs);
                this.where = ImmutableList.copyOf(SuperclassQueryBuilderHelperImpl.this.where);
            }

            @Override
            public QueryMode getQueryMode() {
                return queryMode;
            }

            @Override
            public Classe getSuperclass() {
                return superclass;
            }

            @Override
            public DaoQueryOptions getOptions() {
                return queryOptions;
            }

            @Override
            public List<SuperclassSubclassQuery> getSubclassQueries() {
                return subclassQueries;
            }

            @Override
            public List<SelectArg> getCustomSelectArgs() {
                return customSelectArgs;
            }

            @Override
            public List<WhereArg> getWhereArgs() {
                return where;
            }

        }

        private class SuperclassSubclassQueryBuilderHelperImpl implements SuperclassSubclassQueryBuilderHelper {

            private final Classe classe;
            private CmdbFilter filter;
            private final List<MatchFilter> matchFilters = list();
            private final List<WhereArg> where = list();

            public SuperclassSubclassQueryBuilderHelperImpl(Classe classe) {
                this.classe = checkNotNull(classe);
                checkArgument(classe.isStandardClass() && classe.hasAncestor(superclass));
            }

            @Override
            public SuperclassSubclassQueryBuilderHelperImpl where(String attr, WhereOperator operator, Object... params) { //TODO duplicate code, see CommonQueryBuilderMethods, improve this
                where.add(WhereArg.build(attr, operator, emptyMap(), list(params)));
                return this;
            }

            @Override
            public SuperclassSubclassQueryBuilderHelperImpl where(CompositeWhereOperator operator, Consumer<CompositeWhereHelper> consumer) { //TODO duplicate code, see CommonQueryBuilderMethods, improve this
                CompositeWhereHelperImpl helper = new CompositeWhereHelperImpl();
                consumer.accept(helper);
                where.add(WhereArg.build(operator, helper.inners));
                return this;
            }

            @Override
            public SuperclassSubclassQueryBuilderHelper where(CmdbFilter filter) {
                this.filter = filter;
                return this;
            }

            @Override
            public SuperclassSubclassQueryBuilderHelper selectMatchFilter(String name, CmdbFilter filter) {
                matchFilters.add(new MatchFilterImpl(name, filter));
                return this;
            }

            @Override
            public SuperclassQueryBuilderHelper then() {
                return SuperclassQueryBuilderHelperImpl.this;
            }

            public SuperclassSubclassQuery toSuperclassSubclassQuery() {
                return new SuperclassSubclassQueryImpl(classe, filter, matchFilters, where);
            }

        }

    }

    private static class MatchFilterImpl implements MatchFilter {

        private final String name;
        private final CmdbFilter filter;

        public MatchFilterImpl(String name, CmdbFilter filter) {
            this.name = checkNotBlank(name);
            this.filter = checkNotNull(filter);
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public CmdbFilter getFilter() {
            return filter;
        }

    }
}
