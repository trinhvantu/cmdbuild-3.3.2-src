package org.cmdbuild.workflow.shark;

import com.google.common.eventbus.EventBus;

public interface SharkEventService {

	/**
	 * Adds an event generated by a certain session.
	 *
	 * @param sessionId
	 * @param event
	 */
	void pushEvent(int sessionId, SharkEvent event);

	EventBus getEventBus();

	interface SharkEventReceived {

		int getSessionId();

		SharkEvent getEvent();
	}
}
