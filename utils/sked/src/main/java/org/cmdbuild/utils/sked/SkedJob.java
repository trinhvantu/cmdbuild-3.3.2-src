/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.sked;

import static com.google.common.base.Objects.equal;

public interface SkedJob extends Runnable {

    String getCode();

    String getTrigger();

    SkedJobClusterMode getClusterMode();

    Runnable getRunnable();

    @Override
    default void run() {
        getRunnable().run();
    }

    default boolean hasClusterMode(SkedJobClusterMode mode) {
        return equal(mode, getClusterMode());
    }

}
