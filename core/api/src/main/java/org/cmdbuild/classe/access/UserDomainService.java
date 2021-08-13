/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.classe.access;

import java.util.List;
import static java.util.stream.Collectors.toList;
import org.cmdbuild.common.utils.PagedElements;
import org.cmdbuild.dao.beans.CMRelation;
import org.cmdbuild.common.beans.CardIdAndClassName;
import org.cmdbuild.dao.beans.RelationDirection;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptionsImpl;
import org.cmdbuild.dao.entrytype.CascadeAction;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.data.filter.CmdbFilter;

public interface UserDomainService {

    List<Domain> getUserDomains();

    List<Domain> getUserDomainsForClasse(String classId);

    Domain getUserDomain(String domainId);

    PagedElements<CMRelation> getUserRelations(String domainId, DaoQueryOptions queryOptions);

    PagedElements<CMRelation> getUserRelationsForCard(String classId, long cardId, DaoQueryOptions queryOptions);

    CMRelation getUserRelation(String domainId, long relationId);

    void moveManyRelations(long sourceCardId, long destinationCardId, String domainId, RelationDirection direction);

    void copyManyRelations(long sourceCardId, long destinationCardId, String domainId, RelationDirection direction);

    List<CardDomainRelationStats> getRelationsStats(String classId, CmdbFilter filter);

    default PagedElements<CMRelation> getUserRelationsForCard(CardIdAndClassName card, DaoQueryOptions queryOptions) {
        return getUserRelationsForCard(card.getClassName(), card.getId(), queryOptions);
    }

    default List<CMRelation> getUserRelationsForCard(CardIdAndClassName card) {
        return getUserRelationsForCard(card.getClassName(), card.getId(), DaoQueryOptionsImpl.emptyOptions()).elements();
    }

    default List<Domain> getActiveUserDomains() {
        return getUserDomains().stream().filter(Domain::isActive).collect(toList());
    }

    default List<Domain> getActiveUserDomainsForClasse(String classId) {
        return getUserDomainsForClasse(classId).stream().filter(Domain::isActive).collect(toList());
    }

    interface CardDomainRelationStats {

        long getRelationCount();

        RelationDirection getDirection();

        Domain getDomain();

        default CascadeAction getCascadeAction() {
            switch (getDirection()) {
                case RD_DIRECT:
                    return getDomain().getMetadata().getCascadeActionDirect();
                case RD_INVERSE:
                    return getDomain().getMetadata().getCascadeActionInverse();
                default:
                    throw new UnsupportedOperationException();
            }
        }
    }

}
