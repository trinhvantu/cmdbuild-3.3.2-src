package org.cmdbuild.workflow.core;

import org.cmdbuild.workflow.model.FlowStatus;

import com.google.common.base.Optional;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.IdAndDescriptionImpl;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_FLOW_STATUS;
import org.cmdbuild.lookup.LookupValue;

public interface LookupHelper {

	FlowStatus stateForLookupCode(String code);

	Optional<LookupValue> lookupForState(FlowStatus state);

	Optional<LookupValue> flowStatusWithCode(String code);

	FlowStatus stateForLookupId(Long id);

	Iterable<LookupValue> allLookups();

	default FlowStatus getFlowStatus(Card card) {
		return Optional.fromNullable(card.get(ATTR_FLOW_STATUS, IdAndDescriptionImpl.class)).transform((l) -> stateForLookupId(l.getId())).or(FlowStatus.UNDEFINED);
	}

	default Optional<LookupValue> getFlowStatusLookup(Card card) {
		return lookupForState(getFlowStatus(card));
	}
}
