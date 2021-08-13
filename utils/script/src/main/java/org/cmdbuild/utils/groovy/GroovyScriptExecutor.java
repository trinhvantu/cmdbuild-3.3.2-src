/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.groovy;

import java.util.Map;

public interface GroovyScriptExecutor {//TODO move this in its own utility project

    static final String ENABLE_GROOVY_SMART_VARIABLES = "ENABLE_GROOVY_SMART_VARIABLES";

    Map<String, Object> execute(Map<String, Object> dataIn);

}
