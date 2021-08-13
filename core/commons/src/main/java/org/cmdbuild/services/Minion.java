/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.services;

public interface Minion {

    String getName();

    MinionStatus getStatus();

    boolean isEnabled();

    void startService();

    void stopService();

    boolean canStart();

    boolean canStop();

    boolean isExperimental();

    default String getId() {
        return getName().toLowerCase().replaceAll("[^a-z]", "");
    }
}
