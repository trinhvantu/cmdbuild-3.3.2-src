/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.email.beans;

import org.cmdbuild.email.EmailTemplateTriggerConditions;
import java.util.Map;
import static org.cmdbuild.utils.lang.CmMapUtils.map;

public class EmailTemplateTriggerConditionsImpl implements EmailTemplateTriggerConditions {

    private final Map<String, String> config;

    public EmailTemplateTriggerConditionsImpl(Map<String, String> config) {
        this.config = map(config).immutable();
    }

    @Override
    public Map<String, String> getConfig() {
        return config;
    }

}
