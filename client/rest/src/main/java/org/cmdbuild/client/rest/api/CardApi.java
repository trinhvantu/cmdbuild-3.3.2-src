/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.client.rest.api;

import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import org.cmdbuild.client.rest.model.Card;
import org.cmdbuild.client.rest.model.SimpleCard;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.CmdbSorter;
import org.cmdbuild.data.filter.utils.CmdbFilterUtils;
import org.cmdbuild.data.filter.utils.CmdbSorterUtils;
import static org.cmdbuild.utils.lang.CmMapUtils.map;
import static org.cmdbuild.utils.lang.CmStringUtils.toStringNotBlank;

public interface CardApi {

    Card createCard(String classId, Card card);

    default Card createCard(String classId, Map<String, Object> cardAttributes) {
        return createCard(classId, new SimpleCard(cardAttributes));
    }

    default Card createCard(String classId, Object... cardAttributes) {
        return createCard(classId, map(cardAttributes));
    }

    Card updateCard(String classId, Card card);

    CardApi deleteCard(String classId, String cardId);

    Card getCard(String classId, String cardId);

    List<Card> getCards(String classId);

    CardQuery queryCards();

    default Card getCard(String classId, long cardId) {
        return getCard(classId, toStringNotBlank(cardId));
    }

    interface CardQuery {

        CardQuery limit(@Nullable Integer limit);

        CardQuery offset(@Nullable Integer start);

        CardQuery filter(@Nullable CmdbFilter filter);

        default CardQuery filter(@Nullable String filter) {
            return filter(CmdbFilterUtils.parseFilter(filter));
        }

        CardQuery sort(@Nullable CmdbSorter sort);

        default CardQuery sort(@Nullable String sort) {
            return sort(CmdbSorterUtils.parseSorter(sort));
        }

        List<Card> getCards();

    }

}
