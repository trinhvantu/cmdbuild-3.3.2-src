/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.core.q3;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import static org.cmdbuild.common.Constants.BASE_DOMAIN_NAME;
import org.cmdbuild.dao.beans.CMRelation;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.common.beans.CardIdAndClassName;
import org.cmdbuild.dao.beans.DatabaseRecord;
import org.cmdbuild.dao.beans.RelationImpl;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_ID;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDCLASS;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDOBJ1;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_IDOBJ2;
import static org.cmdbuild.dao.core.q3.QueryBuilder.EQ;
import org.cmdbuild.dao.driver.repository.AttributeRepository;
import org.cmdbuild.dao.driver.repository.ClasseRepository;
import org.cmdbuild.dao.driver.repository.DomainRepository;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.EntryType;
import org.cmdbuild.dao.entrytype.ReverseDomain;
import org.cmdbuild.dao.graph.ClasseHierarchyService;
import org.cmdbuild.data.filter.CmdbFilter;
import static org.cmdbuild.utils.lang.CmExceptionUtils.unsupported;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmNullableUtils.nullToVoid;
import org.springframework.jdbc.core.JdbcTemplate;
import org.cmdbuild.dao.function.StoredFunctionService;

public interface DaoService extends QueryBuilderService, AttributeRepository, ClasseRepository, StoredFunctionService, DomainRepository, ClasseHierarchyService, SuperclassQueryService {

    static final String ATTRS_ALL = "*", COUNT = "count", ROW_NUMBER = "row_number";

    <T> T create(T model);

    <T> T update(T model);

    <T> long createOnly(T model);

    <T> void updateOnly(T model);

    long createOnly(DatabaseRecord card);

    List<Long> createBatch(List<Card> cards);

    void updateOnly(Card card);

    void delete(Class model, long cardId);

    Card create(Card card);

    Card update(Card card);

    CMRelation create(CMRelation relation);

    CMRelation update(CMRelation relation);

    void delete(CMRelation relation);

    JdbcTemplate getJdbcTemplate();

    void delete(DatabaseRecord record);

    void delete(Object model);

    List<CMRelation> getServiceRelationsForCard(CardIdAndClassName card);

    List<Card> deleteCards(Classe classe, CmdbFilter filter);

    List<Card> updateCards(Classe classe, CmdbFilter filter, Map<String, Object> values);

    default CMRelation getRelation(long relationId) {
        CMRelation relation = getRelation(BASE_DOMAIN_NAME, relationId);
        return getRelation(relation.getType(), relationId);
    }

    default CMRelation getRelation(String domainId, long relationId) {
        return getRelation(getDomain(domainId), relationId);
    }

    default CMRelation getRelation(Domain domain, long relationId) {
        return selectAll().from(domain).where(ATTR_ID, EQ, relationId).getRelation();
    }

    default CMRelation getRelation(String domain, long sourceId, long targetId) {
        return selectAll().fromDomain(domain).where(ATTR_IDOBJ1, EQ, sourceId).where(ATTR_IDOBJ2, EQ, targetId).getRelation();
    }

    default CMRelation getRelation(Domain domain, long sourceId, long targetId) {
        if (domain instanceof ReverseDomain) {//TODO check this, improve
            return getRelation(ReverseDomain.of(domain), targetId, sourceId);
        } else {
            return selectAll().from(domain).where(ATTR_IDOBJ1, EQ, sourceId).where(ATTR_IDOBJ2, EQ, targetId).getRelation();
        }
    }

    @Nullable
    default CMRelation getRelationOrNull(Domain domain, long sourceId, long targetId) {
        return selectAll().from(domain).where(ATTR_IDOBJ1, EQ, sourceId).where(ATTR_IDOBJ2, EQ, targetId).getRelationOrNull();
    }

    default void deleteRelation(String domain, long sourceId, long targetId) {
        delete(getRelation(domain, sourceId, targetId));
    }

    default CMRelation createRelation(Domain domain, CardIdAndClassName source, CardIdAndClassName target) {
        return create(RelationImpl.builder().withType(domain).withSourceCard(source).withTargetCard(target).build());
    }

    default CMRelation createRelation(String domain, CardIdAndClassName source, CardIdAndClassName target) {
        return createRelation(getDomain(domain), source, target);
    }

    default CMRelation createRelation(Domain domain, CardIdAndClassName source, CardIdAndClassName target, Object... data) {
        return create(RelationImpl.builder().withType(domain).withSourceCard(source).withTargetCard(target).withAttributes(map(data)).build());
    }

    default CMRelation createRelation(String domain, CardIdAndClassName source, CardIdAndClassName target, Object... data) {
        return createRelation(getDomain(domain), source, target, data);
    }

    default <T> T getById(Class<T> model, long cardId) {
        return checkNotNull(getByIdOrNull(model, cardId), "card not found for class = %s id = %s", nullToVoid(model).getName(), cardId);
    }

    @Nullable
    default <T> T getByIdOrNull(Class<T> model, long cardId) {
        return selectAll().from(model).where(ATTR_ID, EQ, cardId).getOneOrNull(model);
    }

    default QueryBuilder select(Collection<String> attrs) {
        return query().select(attrs);
    }

    default QueryBuilder select(String... attrs) {
        return query().select(attrs);
    }

    default QueryBuilder selectDistinct(String attr) {
        return query().groupBy(attr);
    }

    default QueryBuilder selectDistinctExpr(String name, String expr) {
        return query().groupByExpr(name, expr);
    }

    @Nullable
    default Card getCardOrNull(Classe classe, long cardId) {
        Card card = selectAll().from(classe).where(ATTR_ID, WhereOperator.EQ, cardId).getCardOrNull();
        if (card != null && !equal(card.getType().getName(), classe.getName())) {
            card = getCardOrNull(card.getType(), cardId);
        }
        return card;
    }

    default Card getCard(Classe thisClass, long cardId) {
        return checkNotNull(getCardOrNull(thisClass, cardId), "card not found for class = %s cardId = %s", thisClass, cardId);
    }

    default Card getCard(CardIdAndClassName card) {
        return getCard(card.getClassName(), card.getId());
    }

    default Card getCard(String classId, long cardId) {
        return getCard(getClasse(classId), cardId);
    }

    default Card getCard(long cardId) {
        return getCard(getRootClass(), cardId);
    }

    default void delete(Classe classe, long cardId) {
        delete(getCard(classe, cardId));
    }

    default void delete(String classId, long cardId) {
        delete(getCard(getClasse(classId), cardId));
    }

    default void delete(EntryType entryType, long entryId) {
        switch (entryType.getEtType()) {
            case ET_CLASS:
                delete((Classe) entryType, entryId);
                break;
            case ET_DOMAIN:
                delete(getRelation((Domain) entryType, entryId));
                break;
            default:
                throw unsupported("unsupported record delete with entry type = %s", entryType);
        }
    }

    default DatabaseRecord getRecord(EntryType entryType, long entryId) {
        switch (entryType.getEtType()) {
            case ET_CLASS:
                return getCard((Classe) entryType, entryId);
            case ET_DOMAIN:
                return getRelation((Domain) entryType, entryId);
            default:
                throw unsupported("unsupported record get with entry type = %s", entryType);
        }
    }

    default Classe getType(CardIdAndClassName card) {
        checkNotNull(card);
        if (card instanceof Card) {
            return ((Card) card).getType();
        } else {
            Classe classe = getClasse(card.getClassName());
            if (classe.isSuperclass()) {
                classe = select(ATTR_IDCLASS).from(classe).where(ATTR_ID, WhereOperator.EQ, card.getId()).getCard().getType();
            }
            return classe;
        }
    }

    default Classe getType(long card) {
        return getCard(card).getType();
    }

}
