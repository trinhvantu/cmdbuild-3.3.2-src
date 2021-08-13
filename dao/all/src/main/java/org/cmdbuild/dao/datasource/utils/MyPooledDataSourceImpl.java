/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.datasource.utils;

import static com.google.common.base.Strings.nullToEmpty;
import static com.google.common.collect.ImmutableList.toImmutableList;
import java.util.List;
import org.apache.commons.dbcp2.BasicDataSource;
import org.apache.commons.dbcp2.PoolableConnection;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.cmdbuild.dao.MyPooledDataSource;
import static org.cmdbuild.dao.MyPooledDataSource.ConnectionStatus.CS_ACTIVE;
import static org.cmdbuild.dao.MyPooledDataSource.ConnectionStatus.CS_IDLE;

public class MyPooledDataSourceImpl extends BasicDataSource implements MyPooledDataSource {

    @Override
    public List<ConnectionInfo> getStackTraceForBorrowedConnections() {
        GenericObjectPool<PoolableConnection> pool = getConnectionPool();
        return pool.listAllObjects().stream()
                .map(i -> new ConnectionInfoImpl(i.getLastBorrowTime() > i.getLastReturnTime() ? CS_ACTIVE : CS_IDLE, nullToEmpty(i.getLastBorrowTrace()).replaceFirst(" has not been returned to the pool", "")))//TODO improve this, status
                .collect(toImmutableList());
    }

}
