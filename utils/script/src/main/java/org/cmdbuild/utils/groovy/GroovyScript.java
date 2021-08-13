/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.utils.groovy;

import java.util.Map;

public interface GroovyScript {

    void execute(Map<String, Object> dataIn, Map<String, Object> dataOut);

}
