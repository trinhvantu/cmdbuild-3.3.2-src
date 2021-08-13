package org.cmdbuild.config;

import org.cmdbuild.config.api.ConfigComponent;
import org.cmdbuild.config.api.ConfigValue;
import org.springframework.stereotype.Component;

@Component
@ConfigComponent("org.cmdbuild.etl")
public class EtlConfigurationImpl implements EtlConfiguration {
    
    @ConfigValue(key = "thousandsSeparator", description = "", defaultValue = "")
    private String thousandsSeparator;
    
    @Override
    public String getThousandsSeparator() {
        return thousandsSeparator;
    }

}
