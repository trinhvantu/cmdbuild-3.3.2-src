/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.common.log;

import static com.google.common.base.Strings.nullToEmpty;
import javax.annotation.Nullable;
import static org.cmdbuild.utils.lang.CmPreconditions.trimAndCheckNotBlank;

public class LoggerConfigImpl implements LoggerConfig {

    private final String category, description, level;

    public LoggerConfigImpl(String category, String level) {
        this(category, null, level);
    }

    public LoggerConfigImpl(String category, @Nullable String description, String level) {
        this.category = trimAndCheckNotBlank(category);
        this.description = nullToEmpty(description);
        this.level = trimAndCheckNotBlank(level).toUpperCase();
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
    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return "LoggerConfig{" + "category=" + category + ", level=" + level + '}';
    }

}
