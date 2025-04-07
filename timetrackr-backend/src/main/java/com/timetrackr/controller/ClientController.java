package com.timetrackr.controller;

import com.timetrackr.model.Client;
import com.timetrackr.service.ClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientService.save(client);
    }

    @GetMapping("/user/{userId}")
    public List<Client> getClientsByUser(@PathVariable Long userId) {
        return clientService.findByUserId(userId);
    }
}