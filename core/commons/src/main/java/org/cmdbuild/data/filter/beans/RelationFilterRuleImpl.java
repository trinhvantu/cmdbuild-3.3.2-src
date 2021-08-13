/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.data.filter.beans;

import java.util.List;
import org.cmdbuild.data.filter.RelationFilterCardInfo;
import org.cmdbuild.data.filter.RelationFilterRule;

import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.collect.ImmutableList;
import static java.util.Collections.emptyList;
import org.cmdbuild.utils.lang.Builder;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotEmpty;

public class RelationFilterRuleImpl implements RelationFilterRule {

    private final String domain;
    private final RelationFilterRuleType type;
    private final RelationFilterDirection direction;
    private final List<RelationFilterCardInfo> cardInfos;

    private RelationFilterRuleImpl(RelationFilterRuleBuilder builder) {
        this.domain = checkNotNull(builder.domain);
        this.type = checkNotNull(builder.type);
        this.direction = builder.direction;
        if (RelationFilterRuleType.ONEOF.equals(type)) {
            this.cardInfos = ImmutableList.copyOf(checkNotEmpty(builder.cardInfos, "must set cards for relation filter rule if rule type = `oneof`"));
        } else {
            this.cardInfos = emptyList();
        }
    }

    @Override
    public String getDomain() {
        return domain;
    }

    @Override
    public RelationFilterRuleType getType() {
        return type;
    }

    @Override
    public RelationFilterDirection getDirection() {
        return checkNotNull(direction);
    }

    @Override
    public List<RelationFilterCardInfo> getCardInfos() {
        return cardInfos;
    }

    public static RelationFilterRuleBuilder builder() {
        return new RelationFilterRuleBuilder();
    }

    public static class RelationFilterRuleBuilder implements Builder<RelationFilterRuleImpl, RelationFilterRuleBuilder> {

        private String domain;
        private RelationFilterRuleType type;
        private RelationFilterDirection direction;
        private List<RelationFilterCardInfo> cardInfos;

        public RelationFilterRuleBuilder withDomain(String domain) {
            this.domain = domain;
            return this;
        }

        public RelationFilterRuleBuilder withType(RelationFilterRuleType type) {
            this.type = type;
            return this;
        }

        public RelationFilterRuleBuilder withDirection(RelationFilterDirection direction) {
            this.direction = direction;
            return this;
        }

        public RelationFilterRuleBuilder withCardInfos(List<RelationFilterCardInfo> cardInfos) {
            this.cardInfos = cardInfos;
            return this;
        }

        @Override
        public RelationFilterRuleImpl build() {
            return new RelationFilterRuleImpl(this);
        }

    }
}
