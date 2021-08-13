/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.core.q3;

import java.util.List;
import java.util.function.Consumer;
import javax.annotation.Nullable;
import org.cmdbuild.dao.driver.postgres.q3.DaoQueryOptions;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.data.filter.CmdbFilter;

public interface SuperclassQueryService {

    SuperclassQueryBuilderHelper queryFromSuperclass(Classe classe);

    SuperclassQueryBuilderHelper queryFromSuperclass(String classId);

    interface SuperclassQueryBuilderHelper extends BasicCommonQueryBuilderMethods<SuperclassQueryBuilderHelper> {

        SuperclassQueryBuilderHelper withOptions(DaoQueryOptions options);

        SuperclassSubclassQueryBuilderHelper withSubclass(String classId);

        SuperclassSubclassQueryBuilderHelper withSubclass(Classe classe);

        long count();

        @Nullable
        Long getRowNumber();

        PreparedQuery build();

        default SuperclassQueryBuilderHelper accept(Consumer<SuperclassQueryBuilderHelper> consumer) {
            consumer.accept(this);
            return this;
        }

        @Override
        default List<ResultRow> run() {
            return build().run();
        }

    }

    interface SuperclassSubclassQueryBuilderHelper extends BasicWhereMethods<SuperclassSubclassQueryBuilderHelper>, SelectMatchFilterBuilder<SuperclassSubclassQueryBuilderHelper> {

        SuperclassSubclassQueryBuilderHelper where(CmdbFilter filter);

        SuperclassQueryBuilderHelper then();

        default SuperclassSubclassQueryBuilderHelper accept(Consumer<SuperclassSubclassQueryBuilderHelper> consumer) {
            consumer.accept(this);
            return this;
        }

    }
}
