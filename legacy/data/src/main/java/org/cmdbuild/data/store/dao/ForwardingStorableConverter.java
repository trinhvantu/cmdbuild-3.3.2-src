package org.cmdbuild.data.store.dao;

import java.util.Map;

import org.cmdbuild.data.store.Storable;

import com.google.common.collect.ForwardingObject;
import org.cmdbuild.dao.beans.CardDefinition;
import org.cmdbuild.dao.beans.Card;

public abstract class ForwardingStorableConverter<T extends Storable> extends ForwardingObject implements StorableConverter<T> {

	/**
	 * Usable by subclasses only.
	 */
	protected ForwardingStorableConverter() {
	}

	@Override
	protected abstract StorableConverter<T> delegate();

	@Override
	public String getClassName() {
		return delegate().getClassName();
	}

	@Override
	public String getIdentifierAttributeName() {
		return delegate().getIdentifierAttributeName();
	}

	@Override
	public Storable storableOf(final Card card) {
		return delegate().storableOf(card);
	}

	@Override
	public T convert(final Card card) {
		return delegate().convert(card);
	}

	@Override
	public CardDefinition fill(final CardDefinition card, final T storable) {
		return delegate().fill(card, storable);
	}

	@Override
	public Map<String, Object> getValues(final T storable) {
		return delegate().getValues(storable);
	}

	@Override
	public String getUser(final T storable) {
		return delegate().getUser(storable);
	}

}