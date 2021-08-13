/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.classe.access;

import com.google.common.base.Joiner;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.common.collect.ComparisonChain;
import static com.google.common.collect.ImmutableList.toImmutableList;
import static com.google.common.collect.Maps.uniqueIndex;
import static java.lang.String.format;
import java.util.Collections;
import static java.util.Collections.emptyList;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import org.apache.commons.lang3.tuple.Pair;
import org.cmdbuild.common.utils.PagedElements;
import static org.cmdbuild.common.utils.PagedElements.paged;
import org.cmdbuild.dao.beans.CMRelation;
import org.cmdbuild.dao.beans.Card;
import static org.cmdbuild.common.beans.CardIdAndClassNameImpl.card;
import org.cmdbuild.dao.beans.RelationDirection;
import static org.cmdbuild.dao.beans.RelationDirection.RD_DIRECT;
import static org.cmdbuild.dao.beans.RelationDirection.RD_INVERSE;
import org.cmdbuild.dao.beans.RelationImpl;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.entrytype.ClassPermission;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_DELETE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_READ;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_UPDATE;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_WF_BASIC;
import static org.cmdbuild.dao.entrytype.ClassPermission.CP_WRITE;
import org.cmdbuild.dao.entrytype.ClassPermissions;
import org.cmdbuild.dao.entrytype.ClassPermissionsImpl;
import static org.cmdbuild.dao.entrytype.ClassPermissionsImpl.none;
import org.cmdbuild.dao.entrytype.Classe;
import static org.cmdbuild.dao.entrytype.DaoPermissionUtils.buildDomainPermissions;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.DomainImpl;
import static org.cmdbuild.dao.entrytype.PermissionScope.PS_SERVICE;
import org.cmdbuild.dao.postgres.q3.beans.PreparedQueryExt;
import org.cmdbuild.dao.postgres.utils.RelationDirectionQueryHelper;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.entryTypeToSqlExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.quoteSqlIdentifier;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.systemToSqlExpr;
import org.cmdbuild.data.filter.CmdbFilter;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;
import static org.cmdbuild.utils.lang.CmConvertUtils.parseEnum;
import static org.cmdbuild.utils.lang.CmConvertUtils.serializeEnum;
import org.cmdbuild.utils.lang.CmMapUtils;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotNullAndGtZero;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import static org.cmdbuild.dao.utils.DomainUtils.getClassDomainsIndexes;

@Component
public class UserDomainServiceImpl implements UserDomainService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final UserClassService classService;
    private final DaoService dao;

    public UserDomainServiceImpl(UserClassService userClassService, DaoService dao) {
        this.classService = checkNotNull(userClassService);
        this.dao = checkNotNull(dao);
    }

    @Override
    public List<Domain> getUserDomains() {
        return dao.getAllDomains().stream().map(new ToUserDomainHelper()::toUserDomain).filter(Domain::hasServiceListPermission).collect(toList());
    }

    @Override
    public List<Domain> getUserDomainsForClasse(String classId) {
        return dao.getDomainsForClasse(dao.getClasse(classId)).stream().map(new ToUserDomainHelper()::toUserDomain).filter(Domain::hasServiceListPermission).collect(toList());
    }

    @Override
    public Domain getUserDomain(String domainId) {
        Domain userDomain = new ToUserDomainHelper().toUserDomain(dao.getDomain(domainId));
        checkArgument(userDomain.hasServiceListPermission(), "user is not allowed to read domain = %s", userDomain);
        return userDomain;
    }

    @Override
    public PagedElements<CMRelation> getUserRelations(String domainId, DaoQueryOptions queryOptions) {
        Domain domain = getUserDomain(domainId);
        checkArgument(domain.hasServiceReadPermission(), "user is not allowed to read relations for domain = %s", domain);
        List<CMRelation> list = dao.selectAll().from(domain).withOptions(queryOptions).getRelations().stream().map(r -> setRelationUserPermissions(domain, r)).collect(toImmutableList());
        if (queryOptions.isPaged()) {
            long count = dao.selectCount().from(domain).where(queryOptions.getFilter()).getCount();
            return paged(list, count);
        } else {
            return paged(list);
        }
    }

    @Override
    public PagedElements<CMRelation> getUserRelationsForCard(String classId, long cardId, DaoQueryOptions queryOptions) {
        Classe userClass = classService.getUserClass(classId);
        if (userClass.isProcess()) {
            userClass.checkPermission(PS_SERVICE, CP_WF_BASIC); //TODO check user access on process instance/card (cached??)
        } else {
            userClass.checkPermission(PS_SERVICE, CP_READ); // TODO check card, not class (cache?)
        }

        List<CMRelation> relations = list(dao.getServiceRelationsForCard(card(classId, cardId))); //TODO change query, join with user filter on each class

        Map<String, Optional<ClassPermissions>> userClasses = relations.stream()
                .flatMap(r -> list(r.getSourceClassName(), r.getTargetClassName()).stream()).distinct().collect(toMap(identity(), c -> Optional.ofNullable(classService.getUserClassOrNull(c))));

        relations = relations.stream().map(r -> {

            ClassPermissions sourceClassAccess = userClasses.get(r.getSourceClassName()).orElse(none()),
                    targetClassAccess = userClasses.get(r.getTargetClassName()).orElse(none());

            boolean hasSourceReference = dao.getClasse(r.getSourceClassName()).hasReferenceForDomain(r.getType(), r.getDirection()),//TODO check direction
                    hasTargetReference = dao.getClasse(r.getTargetClassName()).hasReferenceForDomain(r.getType(), r.getDirection().inverse());//TODO check direction

            ClassPermissions userPermissions = buildDomainPermissions(sourceClassAccess, hasSourceReference, targetClassAccess, hasTargetReference);

            Domain userDomain = DomainImpl.copyOf(r.getType()).withPermissions(userPermissions).build();
            return RelationImpl.copyOf(r).withType(userDomain).build();

        }).filter(r -> r.getType().hasServiceReadPermission()).collect(toList());

        CmMapUtils.FluentMap<String, Integer> domainIndex = getClassDomainsIndexes(relations.stream().map(CMRelation::getType).distinct().collect(toImmutableList()), userClass);

        Collections.sort(relations, (r1, r2) -> {
            Domain d1 = r1.getDomainWithThisRelationDirection(),
                    d2 = r2.getDomainWithThisRelationDirection();

            return ComparisonChain.start()
                    .compare(domainIndex.getOrDefault(d1.getName(), Integer.MAX_VALUE), domainIndex.getOrDefault(d2.getName(), Integer.MAX_VALUE))
                    .compare(d1.getName(), d2.getName())
                    .compare(r1.getTargetCard().getClassName(), r2.getTargetCard().getClassName())
                    .result();

        });
//
        if (queryOptions.isPaged()) {
            return paged(relations, queryOptions.getOffset(), queryOptions.getLimit());
        } else {
            return paged(relations);
        }
    }

    @Override
    public CMRelation getUserRelation(String domainId, long relationId) {
        Domain domain = getUserDomain(domainId);
        checkArgument(domain.hasServiceReadPermission(), "user is not allowed to read relations for domain = %s", domain);
        CMRelation relation = dao.selectAll().from(domain).where(ATTR_ID, EQ, relationId).getRelation();
        return setRelationUserPermissions(domain, relation);
    }

    @Override
    public void moveManyRelations(long sourceCardId, long destinationCardId, String domainId, RelationDirection direction) {
        logger.debug("move many relations from card = {} to card = {} for domain = {} direction = {}", sourceCardId, destinationCardId, domainId, direction);
        doEditManyRelations(sourceCardId, destinationCardId, domainId, direction, false);
    }

    @Override
    public void copyManyRelations(long sourceCardId, long destinationCardId, String domainId, RelationDirection direction) {
        logger.debug("move many relations from card = {} to card = {} for domain = {} direction = {}", sourceCardId, destinationCardId, domainId, direction);
        doEditManyRelations(sourceCardId, destinationCardId, domainId, direction, true);
    }

    @Override
    public List<CardDomainRelationStats> getRelationsStats(String classId, CmdbFilter filter) {
        Classe classe = classService.getUserClass(classId);
        List<Domain> domains = getUserDomainsForClasse(classId);
        if (domains.isEmpty()) {
            return emptyList();
        } else {
            List<Pair<Domain, RelationDirection>> domainsWithDirections = domains.stream().flatMap(d -> {
                List<Pair<Domain, RelationDirection>> list = list();
                if (d.isDomainForSourceClasse(classe)) {
                    list.add(Pair.of(d, RD_DIRECT));
                }
                if (d.isDomainForTargetClasse(classe)) {
                    list.add(Pair.of(d, RD_INVERSE));
                }
                return list.stream();
            }).collect(toImmutableList());
            Map<String, Domain> domainsByName = uniqueIndex(domains, Domain::getName);

            PreparedQueryExt preparedQuery = (PreparedQueryExt) dao.select(ATTR_ID).from(classe).where(filter).build();
            String query = preparedQuery.getQuery(), alias = preparedQuery.getSelectForAttr(ATTR_ID).getAlias();

            String selectDomains = domainsWithDirections.stream().map(d -> format("SELECT \"Id\", \"IdDomain\", %s::varchar _direction, %s _source, %s _target FROM %s WHERE \"Status\" = 'A'",
                    systemToSqlExpr(serializeEnum(d.getRight())), RelationDirectionQueryHelper.forDirection(d.getRight()).getSourceCardIdExpr(), RelationDirectionQueryHelper.forDirection(d.getRight()).getTargetCardIdExpr(), entryTypeToSqlExpr(d.getLeft())))
                    .collect(joining(" UNION ALL "));

            return dao.getJdbcTemplate().query(format("WITH q AS ( %s ) SELECT COUNT(\"Id\") _count, _cm3_utils_regclass_to_domain_name(\"IdDomain\") _name, _direction FROM q JOIN ( %s ) x ON q._source = x.%s GROUP BY \"IdDomain\", _direction", selectDomains, query, alias), (r, i)
                    -> new CardDomainRelationStatsImpl(r.getLong("_count"), parseEnum(r.getString("_direction"), RelationDirection.class), domainsByName.get(r.getString("_name"))));
        }
    }

    private static class CardDomainRelationStatsImpl implements CardDomainRelationStats {

        private final long count;
        private final RelationDirection direction;
        private final Domain domain;

        public CardDomainRelationStatsImpl(Long count, RelationDirection direction, Domain domain) {
            this.count = checkNotNullAndGtZero(count);
            this.direction = checkNotNull(direction);
            this.domain = checkNotNull(domain);
        }

        @Override
        public long getRelationCount() {
            return count;
        }

        @Override
        public RelationDirection getDirection() {
            return direction;
        }

        @Override
        public Domain getDomain() {
            return domain;
        }

    }

    private void doEditManyRelations(long sourceCardId, long destinationCardId, String domainId, RelationDirection direction, boolean copy) {
        Domain domain = getUserDomain(domainId);
        domain.checkPermission(PS_SERVICE, CP_WRITE);

        Card sourceCard = dao.getCard(sourceCardId), destinationCard = dao.getCard(destinationCardId);

        RelationDirectionQueryHelper helper = RelationDirectionQueryHelper.forDirection(direction);

        //TODO add per-relation permission verification (??)
        if (copy) {
            List insertColumns = list(
                    helper.getSourceClassIdExpr(), helper.getSourceCardIdExpr(), helper.getTargetClassIdExpr(), helper.getTargetCardIdExpr()
            ), selectColumns = list(
                    systemToSqlExpr(destinationCard.getType()), destinationCard.getId(), helper.getTargetClassIdExpr(), helper.getTargetCardIdExpr()
            );
            domain.getActiveServiceAttributes().stream().map(a -> quoteSqlIdentifier(a.getName())).forEach(a -> {
                insertColumns.add(a);
                selectColumns.add(a);
            });
            dao.getJdbcTemplate().update(format("INSERT INTO %s (%s) SELECT %s FROM %s WHERE %s = %s AND %s = %s AND \"Status\" = 'A'",
                    entryTypeToSqlExpr(domain), Joiner.on(", ").join(insertColumns),
                    Joiner.on(", ").join(selectColumns), entryTypeToSqlExpr(domain),
                    helper.getSourceClassIdExpr(), systemToSqlExpr(sourceCard.getType()),
                    helper.getSourceCardIdExpr(), sourceCard.getId()
            ));
        } else {
            dao.getJdbcTemplate().update(format("UPDATE %s SET %s = %s, %s = %s WHERE %s = %s AND %s = %s AND \"Status\" = 'A'",
                    entryTypeToSqlExpr(domain),
                    helper.getSourceClassIdExpr(), systemToSqlExpr(destinationCard.getType()),
                    helper.getSourceCardIdExpr(), destinationCard.getId(),
                    helper.getSourceClassIdExpr(), systemToSqlExpr(sourceCard.getType()),
                    helper.getSourceCardIdExpr(), sourceCard.getId()
            ));
        }
    }

    private CMRelation setRelationUserPermissions(Domain domain, CMRelation relation) {
        Classe source = classService.getUserClass(relation.getSourceClassName()),//TODO user card ?? performance ??
                target = classService.getUserClass(relation.getTargetClassName());//TODO user card ?? performance ??
        boolean hasSourceReference = source.hasReferenceForDomain(domain),
                hasTargetReference = target.hasReferenceForDomain(domain);
        boolean hasWritePermissionFromClasses;
        //TODO
//        if(source.hasServiceWritePermission() && target.hasServiceWritePermission()){
//            hasWritePermissionFromClasses=true;
//        }
        //TODO check reference attrs
        boolean canUpdate = domain.hasServicePermission(CP_UPDATE),
                canDelete = domain.hasServicePermission(CP_DELETE);

        if (!relation.canReadSource() || !relation.canReadTarget()) {
            canUpdate = false;
            canDelete = false;
        }
        Set<ClassPermission> permissions = EnumSet.of(CP_READ);
        if (canUpdate) {
            permissions.add(CP_UPDATE);
        }
        if (canDelete) {
            permissions.add(CP_DELETE);
        }
        Domain userRelationDomain = DomainImpl.copyOf(domain).withPermissions(ClassPermissionsImpl.copyOf(domain).intersectPermissions(PS_SERVICE, permissions).build()).build();
        return RelationImpl.copyOf(relation).withType(userRelationDomain).build();
    }

    private class ToUserDomainHelper {

        private final LoadingCache<String, Optional<Classe>> userClassCache = CacheBuilder.newBuilder()
                .build(new CacheLoader<String, Optional<Classe>>() {
                    @Override
                    public Optional<Classe> load(String k) throws Exception {
                        return Optional.ofNullable(classService.getUserClassOrNull(k));
                    }

                });

        public Domain toUserDomain(Domain domain) {
            List<Classe> sourceClasses = domain.getSourceClasses().stream().map(Classe::getName).map(userClassCache::getUnchecked).filter(Optional::isPresent).map(Optional::get).collect(toList()),
                    targetClasses = domain.getTargetClasses().stream().map(Classe::getName).map(userClassCache::getUnchecked).filter(Optional::isPresent).map(Optional::get).collect(toList());

            ClassPermissions sourceClassAccess = ClassPermissionsImpl.builder().accept(p -> sourceClasses.forEach(p::addPermissions)).build(),
                    targetClassAccess = ClassPermissionsImpl.builder().accept(p -> targetClasses.forEach(p::addPermissions)).build();

            boolean hasSourceReference = sourceClasses.stream().allMatch(c -> c.hasReferenceForDomain(domain)),
                    hasTargetReference = targetClasses.stream().allMatch(c -> c.hasReferenceForDomain(domain));

            ClassPermissions userPermissions = buildDomainPermissions(sourceClassAccess, hasSourceReference, targetClassAccess, hasTargetReference);

            return DomainImpl.copyOf(domain)
                    .withClass1(domain.getSourceClass(), sourceClasses)
                    .withClass2(domain.getTargetClass(), targetClasses)
                    .withPermissions(ClassPermissionsImpl.copyOf(domain).intersectPermissions(userPermissions).build()).build();
        }
    }

}
