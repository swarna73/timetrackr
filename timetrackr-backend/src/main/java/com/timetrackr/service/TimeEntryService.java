package com.timetrackr.service;

import com.timetrackr.model.TimeEntry;
import com.timetrackr.repository.TimeEntryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimeEntryService {
    private final TimeEntryRepository repository;

    public TimeEntryService(TimeEntryRepository repository) {
        this.repository = repository;
    }

    public TimeEntry save(TimeEntry entry) {
        return repository.save(entry);
    }

    public List<TimeEntry> getByUserId(Long userId) {
        return repository.findByUserId(userId);
    }
}