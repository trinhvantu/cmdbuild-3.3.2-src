/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package org.cmdbuild.client.rest.model;

import org.cmdbuild.client.rest.model.LoggerInfo;
import org.cmdbuild.utils.lang.CmPreconditions;

public class LoggerInfoImpl implements LoggerInfo {

    private final String category;
    private final String level;

    public LoggerInfoImpl(String category, String level) {
        this.category = CmPreconditions.trimAndCheckNotBlank(category);
        this.level = CmPreconditions.trimAndCheckNotBlank(level);
    }

    @Override
    public String getCategory() {
        return category;
    }

    @Override
    public String getLevel() {
        return level;
    }

    @Override
    public String toString() {
        return "SimpleLogger{" + "category=" + category + ", level=" + level + '}';
    }

}
