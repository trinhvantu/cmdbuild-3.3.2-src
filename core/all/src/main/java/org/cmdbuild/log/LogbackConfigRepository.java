/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.log;

import javax.annotation.Nullable;

public interface LogbackConfigRepository {

    @Nullable
    String getLogbackConfig();

    String getDefaultLogbackConfig();

    String getFallbackLogbackConfig();

    void setLogbackConfig(String config);

    boolean hasConfigFile();

}
