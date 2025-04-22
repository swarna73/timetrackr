package com.timetrackr.service;

import com.timetrackr.config.EntryRuleProperties;   // ← new
import com.timetrackr.model.TimeEntry;
import com.timetrackr.repository.TimeEntryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.util.List;

@Service
public class TimeEntryService {

    private final TimeEntryRepository repository;
    private final EntryRuleProperties rules;        // ← new

    public TimeEntryService(TimeEntryRepository repository,
                            EntryRuleProperties rules) {   // ← inject it
        this.repository = repository;
        this.rules = rules;
    }

    /** Persist a time‑entry **after** validating daily limits & weekend rules. */
    public TimeEntry save(TimeEntry entry) {

        // 1. Weekend rule
        if (!rules.isAllowWeekend()
            && (entry.getDate().getDayOfWeek() == DayOfWeek.SATURDAY
                || entry.getDate().getDayOfWeek() == DayOfWeek.SUNDAY)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Weekend entries are disabled by configuration");
        }

        // 2. Daily‑hours rule
        //   – current total for this user + today
        Double alreadyLogged = repository.sumDurationForUserAndDate(
                entry.getUser().getId(), entry.getDate()
        );                  // returns null when none

        double newTotal = (alreadyLogged == null ? 0 : alreadyLogged) + entry.getDuration();

        if (newTotal > rules.getMaxHoursPerDay()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Daily limit of " + rules.getMaxHoursPerDay() + " h exceeded for "
                            + entry.getDate());
        }

        // all good – save
        return repository.save(entry);
    }

    /** Convenience query used above & by controllers. */
    public List<TimeEntry> getByUserId(Long userId) {
        return repository.findByUserId(userId);
    }
}