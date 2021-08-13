/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.q3;

import org.cmdbuild.dao.postgres.q3.beans.WhereElement;
import org.cmdbuild.dao.postgres.q3.beans.SelectHolder;
import org.cmdbuild.dao.postgres.q3.beans.SelectElement;
import org.cmdbuild.dao.postgres.q3.beans.SelectArg;
import java.util.List;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.data.filter.CmdbFilter;
import org.cmdbuild.data.filter.CmdbSorter;

public interface QueryBuilderHelper {

    SelectElement processSelectArg(SelectArg arg);

    List<WhereElement> buildWheresForFilter(CmdbFilter filter);

    String attrNameToSqlIdentifierExpr(String name);

    String attrNameToSqlIdentifierExpr(String name, String joinId);

    String buildDescAttrExprForReference(Attribute a);

    String buildDescAttrExprForLookup(Attribute a);

    String selectToExpr(SelectElement selectElement);

    String buildOrderByExprOrBlank(CmdbSorter sorter, SelectHolder select);

    CmdbSorter fixAliasesInSorter(CmdbSorter s);

}
