// src/main/java/com/timetrackr/config/EntryRuleProperties.java
package com.timetrackr.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "timetrackr.entries")
@Getter @Setter
public class EntryRuleProperties {
    private double  maxHoursPerDay = 8;
    private boolean allowWeekend   = false;
}