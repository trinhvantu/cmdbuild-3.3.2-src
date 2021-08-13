/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.fault;

import java.util.Comparator;
import javax.annotation.Nullable;

public interface FaultEvent {

    String getMessage();

    @Nullable
    Throwable getException();

    @Nullable
    String getStacktrace();

    FaultEventLevel getLevel();

//    default boolean hasException() {
//        return getException() != null;
//    }

    default boolean hasLevel(FaultEventLevel threshold) {
        return getLevel().getIndex() <= threshold.getIndex();
    }

    enum LeveOrderErrorsFirst implements Comparator<FaultEventLevel> {

        INSTANCE;

        @Override
        public int compare(FaultEventLevel o1, FaultEventLevel o2) {
            return Integer.compare(o1.getIndex(), o2.getIndex());
        }

    }
}
