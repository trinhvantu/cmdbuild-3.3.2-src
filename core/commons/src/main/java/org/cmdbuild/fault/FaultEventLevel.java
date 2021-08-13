/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.fault;

public enum FaultEventLevel {
    INFO(3), WARNING(2), ERROR(1), NEVER(0);

    private final int level;

    private FaultEventLevel(int level) {
        this.level = level;
    }

    public int getIndex() {
        return level;
    }

    public boolean isWorseOrEqualTo(FaultEventLevel other) {
        return this.getIndex() <= other.getIndex();
    }

}
