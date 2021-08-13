/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.calendar.data;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.ImmutableList.toImmutableList;
import java.util.List;
import org.cmdbuild.cache.CacheService;
import org.cmdbuild.cache.CmCache;
import org.cmdbuild.cache.Holder;
import org.cmdbuild.calendar.beans.CalendarTrigger;
import static org.cmdbuild.calendar.beans.CalendarTrigger.CAL_TRIGGER_ATTR_OWNERATTR;
import static org.cmdbuild.calendar.beans.CalendarTrigger.CAL_TRIGGER_ATTR_OWNERCLASS;
import static org.cmdbuild.dao.constants.SystemAttributes.ATTR_DESCRIPTION;
import org.cmdbuild.dao.core.q3.DaoService;
import org.cmdbuild.dao.entrytype.Attribute;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.DATE;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.TIMESTAMP;
import static org.cmdbuild.data.filter.SorterElementDirection.ASC;
import org.cmdbuild.data.filter.beans.CmdbSorterImpl;
import static org.cmdbuild.utils.lang.CmCollectionUtils.onlyElement;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import static org.cmdbuild.utils.lang.KeyFromPartsUtils.key;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class CalendarTriggerRepositoryImpl implements CalendarTriggerRepository {

    private final DaoService dao;

    private final CmCache<List<CalendarTrigger>> triggersByAttr, triggersByClass;
    private final CmCache<CalendarTrigger> triggersById;
    private final Holder<List<CalendarTrigger>> allTriggers;

    public CalendarTriggerRepositoryImpl(DaoService dao, CacheService cacheService) {
        this.dao = checkNotNull(dao);
        triggersByAttr = cacheService.newCache("calendard_triggers_by_attr");
        triggersByClass = cacheService.newCache("calendard_triggers_by_class");
        triggersById = cacheService.newCache("calendard_triggers_by_id");
        allTriggers = cacheService.newHolder("calendar_triggers_all");
    }

    private void invalidateAll() {
        triggersByClass.invalidateAll();
        triggersByAttr.invalidateAll();
        triggersById.invalidateAll();
        allTriggers.invalidate();
    }

    @Override
    public CalendarTrigger createTrigger(CalendarTrigger trigger) {
        validate(trigger);
        trigger = dao.create(trigger);
        invalidateAll();
        return trigger;
    }

    @Override
    public CalendarTrigger updateTrigger(CalendarTrigger trigger) {
        validate(trigger);
        trigger = dao.update(trigger);
        invalidateAll();
        return trigger;
    }

    @Override
    public CalendarTrigger getTriggerById(long id) {
        return triggersById.get(id, () -> doGetTriggerById(id));
    }

    @Override
    public void deleteTrigger(long id) {
        dao.delete(CalendarTrigger.class, id);
        invalidateAll();
    }

    @Override
    public List<CalendarTrigger> getTriggersByOwnerClass(String ownerClass) {
        checkNotBlank(ownerClass);
        return triggersByClass.get(ownerClass, () -> doGetTriggersByOwnerClass(ownerClass));
    }

    @Override
    public List<CalendarTrigger> getTriggersByOwnerClassOwnerAttr(String ownerClass, String ownerAttr) {
        checkNotBlank(ownerClass);
        checkNotBlank(ownerAttr);
        return triggersByAttr.get(key(ownerClass, ownerAttr), () -> doGetTriggersByOwnerClassOwnerAttr(ownerClass, ownerAttr));
    }

    @Override
    public List<CalendarTrigger> getAllTriggers() {
        return allTriggers.get(this::doGetAllTriggers);
    }

    private CalendarTrigger doGetTriggerById(long id) {
        return getAllTriggers().stream().filter(t -> equal(t.getId(), id)).collect(onlyElement());
    }

    private List<CalendarTrigger> doGetTriggersByOwnerClass(String ownerClass) {
        return getAllTriggers().stream().filter(t -> equal(t.getOwnerClass(), ownerClass)).collect(toImmutableList());
    }

    private List<CalendarTrigger> doGetTriggersByOwnerClassOwnerAttr(String ownerClass, String ownerAttr) {
        return getAllTriggers().stream().filter(t -> equal(t.getOwnerClass(), ownerClass) && equal(t.getOwnerAttr(), ownerAttr)).collect(toImmutableList());
    }

    private List<CalendarTrigger> doGetAllTriggers() {
        return dao.selectAll().from(CalendarTrigger.class).orderBy(CmdbSorterImpl.builder()
                .sortBy(CAL_TRIGGER_ATTR_OWNERCLASS, ASC)
                .sortBy(CAL_TRIGGER_ATTR_OWNERATTR, ASC)
                .sortBy(ATTR_DESCRIPTION, ASC)
                .build()).asList();
    }

    private void validate(CalendarTrigger trigger) {
        Attribute attribute = dao.getClasse(trigger.getOwnerClass()).getAttribute(trigger.getOwnerAttr());
        checkArgument(attribute.isOfType(DATE) || attribute.isOfType(TIMESTAMP), "invalid trigger owner attr type");
    }

}
