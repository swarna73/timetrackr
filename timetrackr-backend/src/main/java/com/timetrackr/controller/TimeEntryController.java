package com.timetrackr.controller;

import com.timetrackr.dto.TimeEntryRequest;
import com.timetrackr.model.Client;
import com.timetrackr.model.TimeEntry;
import com.timetrackr.model.User;
import com.timetrackr.service.ClientService;
import com.timetrackr.service.TimeEntryService;
import com.timetrackr.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;



@RestController
@RequestMapping("/api/time-entries")
public class TimeEntryController {
    private final TimeEntryService service;
    private  final UserService userService;
    private final ClientService clientService;
    public TimeEntryController(TimeEntryService service, UserService userService,ClientService clientService) {
        this.service = service;
		this.userService = userService;
		this.clientService = clientService;
    }
    
    
    private boolean isWeekend(LocalDate date) {
        DayOfWeek d = date.getDayOfWeek();
        return d == DayOfWeek.SATURDAY || d == DayOfWeek.SUNDAY;
    }

    private double hoursAlreadyLogged(Long userId, LocalDate date) {
        return service.getByUserId(userId).stream()
                .filter(e -> e.getDate().equals(date))
                .mapToDouble(TimeEntry::getDuration)
                .sum();
    }
    @PostMapping
    public ResponseEntity<?> createTimeEntry(@RequestBody TimeEntryRequest req) {

        // ── fetch referenced entities ──────────────────────────
        User   user   = userService.findById(req.getUserId());
        Client client = clientService.findById(req.getClientId());
        if (client == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Invalid client selected");
        }

        // ── rule checks ────────────────────────────────────────
        final int MAX_HOURS      = 8;          // later: read from yml / DB
        final boolean ALLOW_WE   = false;      // 〃

        if (!ALLOW_WE && isWeekend(req.getDate())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                 .body("Weekend entries are not allowed");
        }

        double today = hoursAlreadyLogged(user.getId(), req.getDate());
        if (today + req.getDuration() > MAX_HOURS) {
        	System.out.println("8 hours exceeded");
            String msg = "Daily limit (" + MAX_HOURS + " h) exceeded";
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(msg);
        }

        // ── create & save ──────────────────────────────────────
        TimeEntry entry = new TimeEntry();
        entry.setDescription(req.getDescription());
        entry.setDuration(req.getDuration());
        entry.setDate       (req.getDate());
        entry.setUser       (user);
        entry.setClient     (client);
        TimeEntry saved = service.save(entry);
        return ResponseEntity.ok(saved);

        
    }

    @GetMapping("/user/{userId}")
    public List<TimeEntry> getByUser(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }
    
    
    
    
}