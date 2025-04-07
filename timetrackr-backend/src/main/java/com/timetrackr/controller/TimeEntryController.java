package com.timetrackr.controller;

import com.timetrackr.model.TimeEntry;
import com.timetrackr.service.TimeEntryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/time-entries")
public class TimeEntryController {
    private final TimeEntryService service;

    public TimeEntryController(TimeEntryService service) {
        this.service = service;
    }

    @PostMapping
    public TimeEntry create(@RequestBody TimeEntry entry) {
        return service.save(entry);
    }

    @GetMapping("/user/{userId}")
    public List<TimeEntry> getByUser(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }
}