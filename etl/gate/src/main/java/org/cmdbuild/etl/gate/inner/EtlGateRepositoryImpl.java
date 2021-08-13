/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.etl.gate.inner;

import static com.google.common.base.Objects.equal;
import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.collect.MoreCollectors.toOptional;
import java.util.List;
import java.util.Optional;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.math.NumberUtils.isNumber;
import org.cmdbuild.cache.CacheService;
import org.cmdbuild.cache.CmCache;
import org.cmdbuild.cache.Holder;
import org.cmdbuild.dao.core.q3.DaoService;
import static org.cmdbuild.utils.lang.CmConvertUtils.toLong;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class EtlGateRepositoryImpl implements EtlGateRepository {

    private final DaoService dao;
    private final Holder<List<EtlGate>> gates;
    private final CmCache<Optional<EtlGate>> gatesById;
    private final CmCache<Optional<EtlGate>> gatesByCode;

    public EtlGateRepositoryImpl(DaoService dao, CacheService cacheService) {
        this.dao = checkNotNull(dao);
        gates = cacheService.newHolder("etl_gates_all");
        gatesById = cacheService.newCache("etl_gates_by_id");
        gatesByCode = cacheService.newCache("etl_gates_by_code");
    }

    private void invalidateCache() {
        gates.invalidate();
        gatesById.invalidateAll();
        gatesByCode.invalidateAll();
    }

    @Override
    public EtlGate getById(long gateId) {
        return checkNotNull(getByIdOrNull(gateId), "gate not found for id =< %s >", gateId);
    }

    @Override
    @Nullable
    public EtlGate getByCodeOrNull(String gate) {
        return gatesByCode.get(checkNotBlank(gate), () -> getAll().stream().filter(g -> equal(gate, g.getCode())).collect(toOptional())).orElse(null);
    }

    @Override
    public EtlGate getByCodeOrId(String gateId) {
        if (isNumber(gateId)) {
            EtlGate gate = getByIdOrNull(toLong(gateId));
            if (gate != null) {
                return gate;
            }
        }
        return checkNotNull(getByCodeOrNull(gateId), "gate not found for code or id =< %s >", gateId);
    }

    @Override
    public List<EtlGate> getAll() {
        return gates.get(this::doGetAll);
    }

    @Nullable
    private EtlGate getByIdOrNull(long gateId) {
        return gatesById.get(gateId, () -> getAll().stream().filter(g -> g.getId() == gateId).collect(toOptional())).orElse(null);
    }

    private List<EtlGate> doGetAll() {
        return dao.selectAll().from(EtlGate.class).asList();
    }

    @Override
    public EtlGate create(EtlGate gate) {
        gate = dao.create(gate);
        invalidateCache();
        return gate;
    }

    @Override
    public EtlGate update(EtlGate gate) {
        gate = dao.update(gate);
        invalidateCache();
        return gate;
    }

    @Override
    public void delete(long gateId) {
        dao.delete(EtlGate.class, gateId);
        invalidateCache();
    }

}
