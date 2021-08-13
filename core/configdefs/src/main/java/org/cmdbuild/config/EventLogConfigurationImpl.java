/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.config;

import org.cmdbuild.config.api.ConfigComponent;
import org.cmdbuild.config.api.ConfigValue;
import org.springframework.stereotype.Component;

@Component
@ConfigComponent("org.cmdbuild.eventlog")
public class EventLogConfigurationImpl implements EventLogConfiguration {

    @ConfigValue(key = "maxRecordsToKeep", defaultValue = "-1")
    private Integer maxRecordsToKeep;

    @ConfigValue(key = "maxRecordAgeToKeepSeconds", defaultValue = "7776000")//90 gg
    private Long maxRecordAgeToKeepSeconds;

    @Override
    public Integer getMaxRecordsToKeep() {
        return maxRecordsToKeep;
    }

    @Override
    public Long getMaxRecordAgeToKeepSeconds() {
        return maxRecordAgeToKeepSeconds;
    }

}
