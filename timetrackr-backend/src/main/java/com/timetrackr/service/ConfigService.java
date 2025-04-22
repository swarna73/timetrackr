// src/main/java/com/timetrackr/service/ConfigService.java
package com.timetrackr.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.timetrackr.config.EntryRuleProperties;

@Service
@RequiredArgsConstructor
public class ConfigService {
    private final EntryRuleProperties props;

    public double  maxHoursPerDay() { return props.getMaxHoursPerDay(); }
    public boolean weekendAllowed() { return props.isAllowWeekend();    }
}