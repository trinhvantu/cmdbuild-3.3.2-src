/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.classe.access;

import com.google.common.base.Joiner;
import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.merge;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Iterables.getOnlyElement;
import static com.google.common.collect.Lists.transform;
import static com.google.common.collect.Maps.filterKeys;
import static com.google.common.collect.Maps.uniqueIndex;
import com.google.common.eventbus.Subscribe;
import static java.lang.String.format;
import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.function.Consumer;
import static java.util.stream.Collectors.joining;
import java.util.function.Function;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import org.apache.commons.lang3.tuple.Pair;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_BULK_DELETE;
import static org.cmdbuild.auth.grant.GrantConstants.GDCP_BULK_UPDATE;
import static org.cmdbuild.auth.grant.GrantUtils.mergePrivilegeGroups;
import org.cmdbuild.auth.grant.GroupOfPrivileges;
import org.cmdbuild.auth.grant.UserPrivilegesForObject;
import org.cmdbuild.auth.role.RolePrivilege;
import org.cmdbuild.cache.CacheService;
import org.cmdbuild.cache.CmCache;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import static org.cmdbuild.classe.access.UserClassUtils.applyPrivilegesToClass;
import static org.cmdbuild.classe.access.UserCardAccessUtils.buildFilterMarkName;
import org.cmdbuild.classe.cache.CardCacheService;
import org.cmdbuild.common.utils.PagedElements;
import org.cmdbuild.common.utils.PositionOf;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.CardImpl;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDCLASS;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.entrytype.AttributePermission.AP_CREATE;
import static org.cmdbuild.dao.entrytype.AttributePermission.AP_UPDATE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_CREATE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_DELETE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_READ;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.user.UserDaoHelperService;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.beans.CompositeFilterImpl;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.noopFilter;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.springframework.stereotype.Component;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDTENANT;
import org.cmdbuild.dao.core.q3.BasicWhereMethods;
import org.cmdbuild.dao.core.q3.QueryBuilder;
import org.cmdbuild.dao.core.q3.SelectExprBuilder;
import org.cmdbuild.dao.core.q3.SelectMatchFilterBuilder;
import static org.cmdbuild.dao.core.q3.WhereOperator.EQ;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_UPDATE;
import org.cmdbuild.dao.entrytype.ClasseImpl;
import org.cmdbuild.dao.entrytype.Domain;
import static org.cmdbuild.dao.entrytype.TextContentSecurity.TCS_HTML_SAFE;
import org.cmdbuild.dao.function.StoredFunction;
import org.cmdbuild.dao.core.q3.SuperclassQueryService.SuperclassQueryBuilderHelper;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_WF_BASIC;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.STRING;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.TEXT;
import org.cmdbuild.dao.event.DaoEvent;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.entryTypeToSqlExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.quoteSqlIdentifier;
import org.cmdbuild.utils.html.HtmlSanitizerUtils;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmMapUtils.toMap;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.cmdbuild.dao.postgres.utils.RelationDirectionQueryHelper;
import static org.cmdbuild.dao.utils.PositionOfUtils.buildPositionOf;
import static org.cmdbuild.data.filter.utils.CmdbFilterUtils.serializeFilter;
import org.cmdbuild.eventbus.EventBusService;
import static org.cmdbuild.utils.lang.CmCollectionUtils.set;
import static org.cmdbuild.utils.lang.CmExceptionUtils.lazyString;
import static org.cmdbuild.utils.lang.CmExceptionUtils.marker;
import org.cmdbuild.auth.grant.UserRoleGrantPrivilegeUpdateEvent;
import org.cmdbuild.config.CoreConfiguration;
import org.cmdbuild.dao.beans.CMRelation;
import org.cmdbuild.dao.beans.RelationImpl;
import static org.cmdbuild.dao.core.q3.DaoService.ATTRS_ALL;
import static org.cmdbuild.dao.core.q3.WhereOperator.IN;
import org.cmdbuild.dao.driver.postgres.q3.stats.AggregateQuery;
import org.cmdbuild.dao.driver.postgres.q3.stats.DaoStatsQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.stats.StatsQueryResponse;
import org.cmdbuild.dao.driver.postgres.q3.stats.StatsQueryResponseImpl;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.EntryType;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.DECIMAL;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.DOUBLE;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.FLOAT;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.INTEGER;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.LONG;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.REFERENCE;
import org.cmdbuild.dao.entrytype.attributetype.ReferenceAttributeType;
import org.cmdbuild.dao.postgres.q3.AliasBuilder;
import org.cmdbuild.dao.postgres.q3.beans.PreparedQueryExt;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.buildReferenceAttrName;
import static org.cmdbuild.dao.utils.AttributeConversionUtils.rawToSystem;
import org.cmdbuild.data.filter.AttributeFilterConditionOperator;
import org.cmdbuild.data.filter.beans.AttributeFilterConditionImpl;
import org.cmdbuild.data.filter.beans.AttributeFilterImpl;
import org.cmdbuild.data.filter.beans.CmdbFilterImpl;
import org.cmdbuild.dms.DmsService;
import static org.cmdbuild.dms.DmsService.DMS_MODEL_PARENT_CLASS;
import static org.cmdbuild.dms.DmsService.DOCUMENT_ATTR_CARD;
import static org.cmdbuild.dms.DmsService.DOCUMENT_ATTR_DOCUMENTID;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.toBooleanOrDefault;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import static org.cmdbuild.utils.lang.CmNullableUtils.isNotNullAndGtZero;
import static org.cmdbuild.utils.lang.CmNullableUtils.ltEqZeroToNull;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringOrNull;
import static org.cmdbuild.utils.lang.LambdaExceptionUtils.rethrowConsumer;

@Component
public class UserCardServiceImpl implements UserCardService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final UserDaoHelperService user;
    private final DmsService service;
    private final UserClassService classService;
    private final DaoService dao;
    private final CardCacheService cardCache;
    private final CoreConfiguration coreConfiguration;

    private final CmCache<UserCardAccess> userCardAccessCache;
    private final int MAX_ATTACHMENTS_MATCHING_FILTER = 10000;

    public UserCardServiceImpl(
            CoreConfiguration coreConfiguration,
            UserDaoHelperService user,
            UserClassService classService,
            DaoService dao,
            CardCacheService cardCache,
            CacheService cacheService,
            EventBusService eventBusService,
            DmsService service) {
        this.user = checkNotNull(user);
        this.classService = checkNotNull(classService);
        this.dao = checkNotNull(dao);
        this.cardCache = checkNotNull(cardCache);
        this.coreConfiguration = checkNotNull(coreConfiguration);
        this.userCardAccessCache = cacheService.newCache("user_card_access_by_user_and_class");
        this.service = checkNotNull(service);
        eventBusService.getGrantEventBus().register(new Object() {
            @Subscribe
            public void handleGrantDataUpdatedEvent(UserRoleGrantPrivilegeUpdateEvent event) {
                invalidateCache();
            }
        });
        eventBusService.getDaoEventBus().register(new Object() {
            @Subscribe
            public void handleDaoEvent(DaoEvent event) {
                invalidateCache();
            }
        });
    }

    private void invalidateCache() {
        userCardAccessCache.invalidateAll();
    }

    @Override
    public Card getUserCard(String classId, long cardId) {
        return cardCache.getCard(cardId, () -> doGetUserCard(classId, cardId));
    }

    @Override
    public Card createCard(String classId, Map<String, Object> values) {
        Classe classe = classService.getUserClass(classId);//TODO apply filters on values before card create
        checkArgument(classe.hasServicePermission(CP_CREATE), "permission denied: cannot create card of class = %s", classe);
        Card card = CardImpl.buildCard(classe, map(values).mapKeys(classe.getAliasToAttributeMap()::get).filterKeys(classe::hasAttribute).filterKeys((s) -> classe.getAttribute(s).hasServicePermission(AP_CREATE) || hasSpecialAccessPermission(classe, s)));
        card = checkSpecialWriteConstraintAndNormalize(card);
        card = sanitizeValues(card);
        card = dao.create(card);
        card = updateRelationAttrs(card, values);
        cardCache.createCard(card);
        return card;
    }

    @Override
    public Card updateCard(String classId, long cardId, Map<String, Object> values) {
        Card oldCard = getUserCard(classId, cardId);//TODO apply filters on values before card update
        Classe classe = oldCard.getType();
        checkArgument(classe.hasServicePermission(CP_UPDATE), "permission denied: cannot update card = %s", oldCard);
        Card newCard = CardImpl.copyOf(oldCard).withAttributes(prepareCardValuesForUpdate(classe, values)).build();
        newCard = checkSpecialWriteConstraintAndNormalize(newCard);
        if (newCard.allValuesEqualTo(oldCard)) {
            logger.info(marker(), "CM: skip card update, new card is equal to current card");
        } else {
            newCard = dao.update(newCard);
        }
        newCard = updateRelationAttrs(newCard, values);
        cardCache.updateCard(newCard);
        return newCard;
    }

    @Override
    public void deleteCard(String classId, long cardId) {
        Card card = getUserCard(classId, cardId);
        checkArgument(card.getType().hasServicePermission(CP_DELETE), "permission denied: cannot delete card = %s", card);
        dao.delete(card);
        cardCache.deleteCard(card);
    }

    @Override
    public void deleteCards(String classId, CmdbFilter filter) {
        Classe classe = classService.getUserClass(classId);
        user.checkPrivileges(p -> toBooleanOrDefault(p.getPrivilegesForObject(classe).getMaxPrivilegesForSomeRecords().getCustomPrivileges().get(GDCP_BULK_DELETE), coreConfiguration.isBulkDeleteEnabledDefault()), "CM: user not allowed to execute bulk delete on class =< %s >", classId);
        dao.deleteCards(classe, filter.and(user.getPrivilegesForObject(classe).getMinPrivilegesForAllRecords().getFilter()));
    }

    @Override
    public void updateCards(String classId, CmdbFilter filter, Map<String, Object> values) {
        Classe classe = classService.getUserClass(classId);
        user.checkPrivileges(p -> toBooleanOrDefault(p.getPrivilegesForObject(classe).getMaxPrivilegesForSomeRecords().getCustomPrivileges().get(GDCP_BULK_UPDATE), coreConfiguration.isBulkUpdateEnabledDefault()), "CM: user not allowed to execute bulk update on class =< %s >", classId);
        dao.updateCards(classe, filter.and(user.getPrivilegesForObject(classe).getMinPrivilegesForAllRecords().getFilter()), prepareCardValuesForUpdate(classe, values));//TODO check classe access control, values filtering
    }

    @Override
    public UserCardAccess getUserCardAccess(String classId) {
        return userCardAccessCache.get(key(user.getUserPrivilegesChecksum(), checkNotBlank(classId)), () -> doGetUserCardAccess(classId));
    }

    @Override
    public PagedElements<Card> getUserCards(String classId, UserCardQueryOptions options, Pair<String, Function<Classe, Consumer<BasicWhereMethods>>> where) {

        logger.debug("get user card from class =< {} > with query options = {}", classId, options.getQueryOptions());

        UserCardAccess cardAccess = getUserCardAccess(classId);
        Classe classe = cardAccess.getUserClass();
        CmdbFilter myFilter = options.getQueryOptions().getFilter();

        if (options.hasForDomain()) {
            checkArgument(dao.getDomain(options.getForDomain().getDomainName()).getThisDomainWithDirection(options.getForDomain().getDirection()).isDomainForTargetClasse(dao.getClasse(classId)),
                    "invalid forDomain = %s for this class = %s", options.getForDomain().getDomainName(), classId);
        }

        if (myFilter.hasAttachmentFilter() && service.isEnabled()) {
            String fulltextAttachmentQuery = myFilter.getAttachmentFilter().getQuery();
            List<Long> cardIds = getCardIdsMatchingAttachmentFilter(classId, fulltextAttachmentQuery);
            CmdbFilter attachAsAttrFilter = CmdbFilterImpl.builder()
                    .withAttributeFilter(AttributeFilterImpl.simple(AttributeFilterConditionImpl.builder()
                            .withOperator(AttributeFilterConditionOperator.IN)
                            .withKey("Id")
                            .withValues(cardIds).build())).build();
            myFilter = merge(CmdbFilterImpl.copyOf(myFilter).withAttachmentFilter(null).build(), attachAsAttrFilter);
        }

        if (dao.getClasse(classId).isSuperclass()) {
            Map<String, UserCardAccess> subclassesCardAccess = dao.getClasseHierarchy(classe).getLeaves().stream()
                    .filter(c -> classService.isActiveAndUserCanRead(c.getName()))
                    .collect(toMap(Classe::getName, c -> getUserCardAccess(c.getName())));

            checkArgument(!subclassesCardAccess.isEmpty(), "no subclass is accessible for superclass = %s", classId);

//<<<<<<< HEAD
            //TODO improve checksum (users with same access should have same checksum)
            String accessChecksum = subclassesCardAccess.entrySet().stream()
                    .map(sub -> key(
                    sub.getKey(),
                    serializeFilter(sub.getValue().getWholeClassFilter()),
                    sub.getValue().getSubsetFiltersByName().entrySet().stream().map(e -> format("%s:%s", e.getKey(), serializeFilter(e.getValue().getFilter()))).collect(joining("||")),
                    user.getActiveTenantIds())).collect(joining(" "));
            CmdbFilter fullFilter = myFilter;
            return cardCache.getCards(classe, options.getQueryOptions(), accessChecksum, () -> {

                DaoQueryOptions query = DaoQueryOptionsImpl.copyOf(options.getQueryOptions()).withFilter(fullFilter).build();//options.getQueryOptions();
                PositionOf positionOf = null;
                //TODO select function value
                if (query.hasPositionOf()) {
                    Long rowNumber = dao.queryFromSuperclass(classe).withOptions(query).accept(addSubclassesFiltersAndMarks(subclassesCardAccess, where.getRight())).getRowNumber();
                    positionOf = buildPositionOf(rowNumber, query);
                    query = query.withOffset(positionOf.getActualOffset());
                }

                List<Card> cards;
                cards = dao.queryFromSuperclass(classe).withOptions(query)
                        .accept(addForDomainSelect(options.getForDomain())::accept)
                        .accept(addSubclassesFiltersAndMarks(subclassesCardAccess, where.getRight())).getCards();
//=======
//            //TODO select function value
//            if (query.hasPositionOf()) {
//                Long rowNumber = dao.queryFromSuperclass(classe).withOptions(query).accept(addSubclassesFiltersAndMarks(subclassesCardAccess, where)).getRowNumber();
//                positionOf = buildPositionOf(rowNumber, query);
//                query = query.withOffset(positionOf.getActualOffset());
//            }
//
//            cards = dao.queryFromSuperclass(classe).withOptions(query)
//                    .accept(addForDomainSelect(options.getForDomain())::accept)
//                    .accept(addSubclassesFiltersAndMarks(subclassesCardAccess, where)).getCards();
//>>>>>>> 5caa84188548b5f7e6ba50fd62c1a5b507bab8da

                cards = list(transform(cards, c -> subclassesCardAccess.get(c.getType().getName()).addCardAccessPermissionsFromSubfilterMark(c)));

//<<<<<<< HEAD
                long total;
                if (query.isPagedAndHasFullPage(cards.size())) {
                    total = dao.queryFromSuperclass(classe).withOptions(DaoQueryOptionsImpl.build(query.getFilter())).accept(addSubclassesFiltersAndMarks(subclassesCardAccess, where.getRight())).count();
                } else {
                    total = cards.size() + query.getOffset();
                }
                return new PagedElements<>(cards, total, positionOf);
            });
//=======
//            if (query.isPagedAndHasFullPage(cards.size())) {
//                total = dao.queryFromSuperclass(classe).withOptions(DaoQueryOptionsImpl.build(query.getFilter())).accept(addSubclassesFiltersAndMarks(subclassesCardAccess, where)).count();
//            } else {
//                total = cards.size() + query.getOffset();
//            }
//>>>>>>> 5caa84188548b5f7e6ba50fd62c1a5b507bab8da
        } else {
//            UserCardAccess cardAccess = getUserCardAccess(classId);
            CmdbFilter fullFilter = cardAccess.getWholeClassFilter().and(myFilter);

            //TODO improve checksum (users with same access should have same checksum)
            String accessChecksum = key(serializeFilter(fullFilter), cardAccess.getSubsetFiltersByName().entrySet().stream().map(e -> format("%s:%s", e.getKey(), serializeFilter(e.getValue().getFilter()))).collect(joining("||")), user.getActiveTenantIds(), where.getLeft());

            return cardCache.getCards(cardAccess.getUserClass(), options.getQueryOptions(), accessChecksum, () -> {
                DaoQueryOptions query = options.getQueryOptions();
                CmdbFilter filter = fullFilter;

                PositionOf positionOf = null;
                if (query.hasPositionOf()) {
                    Long rowNumber = dao.selectRowNumber().where(ATTR_ID, EQ, query.getPositionOf()).then()
                            .from(classId)
                            .orderBy(query.getSorter())
                            .where(filter)
                            .accept(addForDomaiDisabledClassesFilter(options.getForDomain()))
                            .accept(where.getRight().apply(classe)::accept)
                            .build().getRowNumberOrNull();
                    positionOf = buildPositionOf(rowNumber, query);
                    query = query.withOffset(positionOf.getActualOffset());
                }

                List<Card> cards = dao.select(query.hasAttrs() ? query.getAttrs() : singletonList(ATTRS_ALL))
                        .from(classId)
                        .orderBy(query.getSorter())
                        .where(filter)
                        .accept(cardAccess.addSubsetFilterMarkersToQueryVisitor()::accept)
                        .accept(addSelectFunctionValue(options.getFunctionValue()))
                        .accept(addForDomainSelect(options.getForDomain())::accept)
                        .accept(addForDomaiDisabledClassesFilter(options.getForDomain()))
                        .accept(where.getRight().apply(classe)::accept)
                        //<<<<<<< HEAD
                        .paginate(query.getOffset(), query.getLimit())
                        .getCards();

                cards = list(transform(cards, cardAccess::addCardAccessPermissionsFromSubfilterMark));

                long total;
                if (query.isPagedAndHasFullPage(cards.size())) {
                    total = dao.selectCount()
                            .from(classId)
                            .where(filter)
                            .accept(addForDomaiDisabledClassesFilter(options.getForDomain()))
                            .accept(where.getRight().apply(classe)::accept)
                            .getCount();
                } else {
                    total = cards.size() + query.getOffset();
                }
                return new PagedElements<>(cards, total, positionOf);
            });
        }

    }

    @Override
    public StatsQueryResponse getStats(String classId, DaoQueryOptions options, DaoStatsQueryOptions query) {
        Classe classe = classService.getUserClass(classId);
        checkArgument(!query.getAggregateQueries().isEmpty(), "aggregate query is empty");
        AliasBuilder aliasBuilder = new AliasBuilder();
        List<Pair<AggregateQuery, String>> queriesWithAlias = query.getAggregateQueries().stream().map(q -> Pair.of(q, aliasBuilder.buildAlias(format("%s_%s", q.getAttribute(), serializeEnum(q.getOperation()))))).collect(toImmutableList());
        //TODO check superclass support!!
        PreparedQueryExt preparedQuery = (PreparedQueryExt) dao.selectAll().from(classService.getUserClass(classId)).where(getUserCardAccess(classId).getWholeClassFilter().and(options.getFilter())).build();
        return dao.getJdbcTemplate().queryForObject(format("SELECT %s FROM ( %s ) x", queriesWithAlias.stream().map(q -> {
            Attribute attribute = classe.getAttribute(q.getLeft().getAttribute());
            switch (q.getLeft().getOperation()) {
                case SUM:
                    checkArgument(attribute.isOfType(DECIMAL, DOUBLE, INTEGER, LONG, FLOAT), "SUM is not a valid operation for attribute = %s", attribute);
                    return format("COALESCE(SUM(%s),0) %s", preparedQuery.getSelectForAttr(attribute.getName()).getAlias(), q.getRight());
                default:
                    throw unsupported("unsupported operation = %s", q.getLeft().getOperation());
            }
        }).collect(joining(", ")), preparedQuery.getQuery()), (r, i) -> StatsQueryResponseImpl.builder().accept(rethrowConsumer(b -> {
            queriesWithAlias.forEach(rethrowConsumer(q -> {
                b.withAggregateResult(q.getLeft(), rawToSystem(classe.getAttribute(q.getLeft().getAttribute()), r.getObject(q.getRight())));
            }));
        })).build());
    }

    private Map<String, Object> prepareCardValuesForUpdate(Classe classe, Map<String, Object> values) {
        values = map(values).mapKeys(classe.getAliasToAttributeMap()::get).filterKeys(classe::hasAttribute).filterKeys((s) -> classe.getAttribute(s).hasServicePermission(AP_UPDATE) || hasSpecialAccessPermission(classe, s));
        values = sanitizeValues(classe, values);
        return values;
    }

    private UserCardAccess doGetUserCardAccess(String classId) {
        Classe classe = classService.getUserClass(classId);
        checkArgument(classe.hasServicePermission(CP_READ) || (classe.isProcess() && classe.hasServicePermission(CP_WF_BASIC)), "permission denied: cannot read cards of class = %s", classe);//TODO throw specific access denied ex
        UserPrivilegesForObject privilegeGroups = user.getPrivilegesForObject(classe);
        Set<RolePrivilege> rolePrivileges = user.getRolePrivileges();
        CmdbFilter wholeClassFilter;
        List<UserCardAccessWithFilterImpl> subsetFilters;
        GroupOfPrivileges minPrivilegesForAllRecords = privilegeGroups.getMinPrivilegesForAllRecords();
        if (privilegeGroups.hasPrivilegesWithFilter()) {
            boolean canReadAllRecords = applyPrivilegesToClass(rolePrivileges, minPrivilegesForAllRecords, classe).hasServicePermission(CP_READ);
            if (privilegeGroups.getPrivilegeGroupsWithFilter().size() == 1 && !canReadAllRecords) {
                subsetFilters = emptyList();
                wholeClassFilter = getOnlyElement(privilegeGroups.getPrivilegeGroupsWithFilter()).getFilter();
                minPrivilegesForAllRecords = getOnlyElement(privilegeGroups.getPrivilegeGroupsWithFilter());
            } else {
                subsetFilters = privilegeGroups.getPrivilegeGroupsWithFilter().stream().map((p) -> {
                    CmdbFilter filter = p.getFilter(); //TODO check filter conversion
                    return new UserCardAccessWithFilterImpl(format("%s_%s", classId, p.getSource()), filter, p); //TODO check that p.source is unique
                }).collect(toList());
                if (canReadAllRecords) {
                    wholeClassFilter = noopFilter();
                } else {
                    wholeClassFilter = CompositeFilterImpl.or(transform(subsetFilters, UserCardAccessWithFilter::getFilter));
                }
            }
        } else {
            wholeClassFilter = noopFilter();
            subsetFilters = emptyList();
        }
        return new UserCardAccessImpl(classe, rolePrivileges, minPrivilegesForAllRecords, wholeClassFilter, subsetFilters);
    }

    private Consumer<SuperclassQueryBuilderHelper> addSubclassesFiltersAndMarks(Map<String, UserCardAccess> subclassesCardAccess, Function<Classe, Consumer<BasicWhereMethods>> where) {
        return b -> {
            subclassesCardAccess.forEach((subclass, subclassAccess) -> {
                CmdbFilter subclassFilter = subclassAccess.getWholeClassFilter();
                logger.debug("add query filters/marks for subclass =< {} > with access filter =< {} > and {} subset filters", subclass, subclassFilter, subclassAccess.getSubsetFiltersByName().size());
                b.withSubclass(subclass)
                        .accept(subclassAccess.addSubsetFilterMarkersToQueryVisitor()::accept)
                        .accept(where.apply(subclassAccess.getUserClass())::accept)
                        .where(subclassFilter);
            });
        };
    }

    private Consumer<SelectExprBuilder> addForDomainSelect(@Nullable UserCardQueryForDomain forDomain) {
        return q -> {
            if (forDomain != null) {
                Domain domain = dao.getDomain(forDomain.getDomainName());
                RelationDirectionQueryHelper helper = RelationDirectionQueryHelper.forDirection(forDomain.getDirection());
                q.selectExpr(FOR_DOMAIN_HAS_THIS_RELATION, "EXISTS (SELECT 1 FROM %s WHERE %s = Q3_MASTER.\"Id\" AND %s = %s AND \"Status\" = 'A')", entryTypeToSqlExpr(domain), helper.getTargetCardIdExpr(), helper.getSourceCardIdExpr(), forDomain.getOriginId());
                q.selectExpr(FOR_DOMAIN_HAS_ANY_RELATION, "EXISTS (SELECT 1 FROM %s WHERE %s = Q3_MASTER.\"Id\" AND \"Status\" = 'A')", entryTypeToSqlExpr(domain), helper.getTargetCardIdExpr());
            }
        };
    }

    private Consumer<QueryBuilder> addForDomaiDisabledClassesFilter(@Nullable UserCardQueryForDomain forDomain) {
        return q -> {
            if (forDomain != null) {
                Set<String> disabledTargetDescendants = set(dao.getDomain(forDomain.getDomainName()).getThisDomainWithDirection(forDomain.getDirection()).getDisabledTargetDescendants());
                if (!disabledTargetDescendants.isEmpty()) {
                    q.whereExpr("_cm3_utils_regclass_to_name(Q3_MASTER.\"IdClass\") <> ALL (?)", (Object) disabledTargetDescendants);
                }
            }
        };
    }

    private Card doGetUserCard(String classId, long cardId) {//TODO fix this, apply column permission rules (??)cp 
        Classe classe = classService.getUserClass(classId);
        if (classe.isSuperclass()) {
            String actualClassId = toStringNotBlank(dao.select(ATTR_IDCLASS).from(classId).where(ATTR_ID, EQ, cardId).getSingleRow().get(ATTR_IDCLASS));
            classe = dao.getClasse(actualClassId);
            checkArgument(!classe.isSuperclass());
        }
        UserCardAccess cardAccess = getUserCardAccess(classe.getName());
        Card card = cardAccess.addCardAccessPermissionsFromSubfilterMark(dao.selectAll().from(classe)
                .accept(cardAccess.addSubsetFilterMarkersToQueryVisitor()::accept)
                .where(cardAccess.getWholeClassFilter())
                .where(ATTR_ID, EQ, checkNotNull(cardId))
                .getCard());
        if (!classe.isProcess()) {
            checkArgument(card.getType().hasServiceReadPermission(), "user not authorized to access card %s.%s", card.getType().getName(), cardId);
        }
        return card;
    }

    private Consumer<QueryBuilder> addSelectFunctionValue(@Nullable String selectFunctionValue) {
        return q -> {
            if (isNotBlank(selectFunctionValue)) {
                StoredFunction storedFunction = getSelectFunctionValueStoredFunction(selectFunctionValue);
                q.selectExpr(storedFunction.getOnlyOutputParameter().getName(), format("%s(\"Id\")", quoteSqlIdentifier(storedFunction.getName()))); //TODO move this to dao module !!
            }
        };
    }

    private StoredFunction getSelectFunctionValueStoredFunction(String selectFunctionValue) {
        StoredFunction storedFunction = dao.getFunctionByName(selectFunctionValue);//TODO check fun permission
        checkArgument(storedFunction.hasOnlyOneOutputParameter());//TODO
        return storedFunction;

    }

    private boolean hasSpecialAccessPermission(Classe classe, String attr) {
        return equal(attr, ATTR_IDTENANT) && classe.hasMultitenantEnabled();
    }

    private Card checkSpecialWriteConstraintAndNormalize(Card card) {
        Long tenantId = ltEqZeroToNull(card.getTenantId());
        switch (card.getType().getMultitenantMode()) {
            case CMM_ALWAYS:
                if (tenantId == null) {
                    tenantId = user.getDefaultTenantId();
                }
                checkNotNull(tenantId, "missing tenant id");
            case CMM_MIXED:
                checkArgument(tenantId == null || user.canAccessTenant(tenantId), "permission denied: user is not authorized to access tenant = %s", tenantId);
        }
        return CardImpl.copyOf(card).withAttribute(ATTR_IDTENANT, tenantId).build();
    }

    private Map<String, Object> sanitizeValues(EntryType type, Map<String, Object> values) {
        return map(values).accept(m -> {
            type.getAllAttributes().stream().filter(a -> a.isOfType(STRING, TEXT) && a.getMetadata().hasTextContentSecurity(TCS_HTML_SAFE)).forEach(a -> {
                if (isNotBlank(toStringOrNull(m.get(a.getName())))) {
                    String value = toStringOrNull(m.get(a.getName()));
                    value = HtmlSanitizerUtils.sanitizeHtml(value);
                    m.put(a.getName(), value);
                }
            });
        });
    }

    private Card sanitizeValues(Card card) {
        return CardImpl.copyOf(card).withAttributes(sanitizeValues(card.getType(), card.getAllValuesAsMap())).build();
    }

    private Card updateRelationAttrs(Card card, Map<String, Object> values) {
        card.getType().getActiveServiceAttributes().stream().filter(a -> a.isOfType(REFERENCE)).forEach(a -> {
            Domain domain = dao.getDomain(a.getType().as(ReferenceAttributeType.class).getDomainName());
            if (domain.getActiveServiceAttributes().stream().anyMatch(Attribute::showInGrid)) {
                Long targetId = card.get(a.getName(), Long.class);
                if (isNotNullAndGtZero(targetId)) {
                    CMRelation relation = dao.getRelation(domain.getThisDomainWithDirection(a.getType().as(ReferenceAttributeType.class).getDirection()), card.getId(), targetId);
                    CMRelation newRelation = RelationImpl.copyOf(relation).accept(r -> {
                        domain.getActiveServiceAttributes().forEach(ra -> {
                            String key = buildReferenceAttrName(a.getName(), ra.getName());
                            if (values.containsKey(key)) {
                                r.addAttribute(ra.getName(), values.get(key));
                            }
                        });
                    }).build();
                    if (newRelation.allValuesEqualTo(relation)) {
                        logger.info(marker(), "CM: skip relation update, new relation is equal to current relation");
                    } else {
                        dao.update(newRelation);
                    }
                }
            }
        });
        return doGetUserCard(card.getClassName(), card.getId());
    }

    private List<Long> getCardIdsMatchingAttachmentFilter(String classId, String fulltextAttachmentQuery) {
        List<String> documentIdsMatchingContent = service.getService().queryDocumentsForClass(fulltextAttachmentQuery, classId);
        List<String> documentIdsMatchingFilter = dao.select(DOCUMENT_ATTR_DOCUMENTID)
                .from(DMS_MODEL_PARENT_CLASS)
                .where(CmdbFilterImpl.builder().withFulltextFilter(fulltextAttachmentQuery).build())
                .getCards().stream().map(c -> c.getString(DOCUMENT_ATTR_DOCUMENTID))
                .collect(toList());
        Set<String> documentIds = set();
        documentIds.addAll(documentIdsMatchingContent);
        documentIds.addAll(documentIdsMatchingFilter);
        if (documentIds.size() > MAX_ATTACHMENTS_MATCHING_FILTER) {
            logger.info("Too many attachments match the filter, limiting the query to the first < {} > results, create a more strict filter", MAX_ATTACHMENTS_MATCHING_FILTER);
            documentIds = documentIds.stream().limit(MAX_ATTACHMENTS_MATCHING_FILTER).collect(toSet());
        }
        return dao.select(DOCUMENT_ATTR_CARD)
                .from(DMS_MODEL_PARENT_CLASS)
                .where(DOCUMENT_ATTR_DOCUMENTID, IN, documentIds).getCards().stream().map(c -> (Long) c.get("Card")).collect(toList());
    }

    private static class UserCardAccessImpl implements UserCardAccess {

        private final Logger logger = LoggerFactory.getLogger(getClass());

        private final Classe baseClass;
        private final Set<RolePrivilege> rolePrivileges;
        private final GroupOfPrivileges basePrivileges;
        private final CmdbFilter wholeClassFilter;
        private final Map<String, UserCardAccessWithFilterImpl> subsetFiltersByName;
        private final Cache<String, Classe> userClassCache = CacheBuilder.newBuilder().build();

        public UserCardAccessImpl(Classe baseClass, Set<RolePrivilege> rolePrivileges, GroupOfPrivileges basePrivileges, CmdbFilter wholeClassFilter, List<UserCardAccessWithFilterImpl> subsetFilters) {
            this.baseClass = checkNotNull(baseClass);
            this.rolePrivileges = checkNotNull(rolePrivileges);
            this.wholeClassFilter = checkNotNull(wholeClassFilter);
            this.basePrivileges = checkNotNull(basePrivileges);
            this.subsetFiltersByName = uniqueIndex(subsetFilters, UserCardAccessWithFilter::getName);
        }

        @Override
        public Classe getUserClass() {
            return baseClass;
        }

        @Override
        public CmdbFilter getWholeClassFilter() {
            return wholeClassFilter;
        }

        @Override
        public Map<String, UserCardAccessWithFilter> getSubsetFiltersByName() {
            return (Map) subsetFiltersByName;
        }

        @Override
        public Classe getUserClass(Set<String> activeFilters) {
            try {
                return userClassCache.get(key(activeFilters), () -> {
                    GroupOfPrivileges privileges = mergePrivilegeGroups(list(basePrivileges).with(filterKeys(subsetFiltersByName, activeFilters::contains).values().stream().map(UserCardAccessWithFilter::getPrivileges)))
                            .withSource("filters_" + Joiner.on("+").join(activeFilters)).build();
                    return applyPrivilegesToClass(rolePrivileges, privileges, baseClass);
                });
            } catch (ExecutionException ex) {
                throw runtime(ex);
            }
        }

        @Override
        public Consumer<SelectMatchFilterBuilder> addSubsetFilterMarkersToQueryVisitor() {
            return (q) -> {
                getSubsetFiltersByName().forEach((key, a) -> {
                    String mark = buildFilterMarkName(key);
                    logger.debug("add query mark =< {} > for filter = {} {}", mark, a.getName(), a.getFilter());
                    logger.trace("privileges =\n{}", lazyString(a.getPrivileges()::getPrivilegesDetailedInfos));
                    q.selectMatchFilter(mark, a.getFilter());
                });
            };
        }

        @Override
        public Card addCardAccessPermissionsFromSubfilterMark(Card card) {
            Set<String> activeFilters = getSubsetFiltersByName().keySet().stream().filter((k) -> {
                return card.getNotNull(buildFilterMarkName(k), Boolean.class) == true;
            }).collect(toSet());
            Classe userClass = getUserClass(activeFilters);
            if (!equal(userClass.getName(), card.getType().getName())) {
                userClass = ClasseImpl.copyOf(card.getType())
                        .withAttributes(userClass.getAllAttributes())
                        .withPermissions(userClass)
                        .build();
            }
            return CardImpl.copyOf(card).withType(userClass).build();
        }

    }

    private static class UserCardAccessWithFilterImpl implements UserCardAccessWithFilter {

        final String name;
        final CmdbFilter filter;
        final GroupOfPrivileges privileges;

        public UserCardAccessWithFilterImpl(String name, CmdbFilter filter, GroupOfPrivileges privileges) {
            this.name = checkNotBlank(name);
            this.filter = checkNotNull(filter);
            this.privileges = checkNotNull(privileges);
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public CmdbFilter getFilter() {
            return filter;
        }

        @Override
        public GroupOfPrivileges getPrivileges() {
            return privileges;
        }

    }

}
