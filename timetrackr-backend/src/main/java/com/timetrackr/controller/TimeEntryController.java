package com.timetrackr.controller;

import com.timetrackr.dto.TimeEntryRequest;
import com.timetrackr.model.Client;
import com.timetrackr.model.TimeEntry;
import com.timetrackr.model.User;
import com.timetrackr.service.ClientService;
import com.timetrackr.service.TimeEntryService;
import com.timetrackr.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    @PostMapping
    public TimeEntry createTimeEntry(@RequestBody TimeEntryRequest entryRequest) {
        User user = userService.findById(entryRequest.getUserId());
        Client client = clientService.findById(entryRequest.getClientId()); // ✅ Corrected

        TimeEntry entry = new TimeEntry();
        entry.setDescription(entryRequest.getDescription());
        entry.setDuration(entryRequest.getDuration());
        entry.setDate(entryRequest.getDate());
        entry.setUser(user);
        entry.setClient(client);
        if (client == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid client selected");
        }
        return service.save(entry);
    }

    @GetMapping("/user/{userId}")
    public List<TimeEntry> getByUser(@PathVariable Long userId) {
        return service.getByUserId(userId);
    }
    
    
    
    
}