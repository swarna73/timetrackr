package com.timetrackr.controller;

import com.timetrackr.dto.ClientDTO;
import com.timetrackr.model.Client;
import com.timetrackr.model.User;
import com.timetrackr.service.ClientService;
import com.timetrackr.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;
    private final UserService userService;
  
    public ClientController(ClientService clientService, UserService userService) {
        this.clientService = clientService;
        this.userService = userService;
    }

    @PostMapping
    public Client createClient(@RequestBody Client client) {
        Long userId = client.getUser().getId(); // get the ID only
        User fullUser = userService.findById(userId); // load full user
        client.setUser(fullUser); // reassign with fully loaded user

        return clientService.save(client);
    }

    @GetMapping("/user/{userId}")
    public List<ClientDTO> getClientsByUser(@PathVariable Long userId) {
        List<Client> clients = clientService.findByUserId(userId);
        return clients.stream()
                      .map(client -> new ClientDTO(client.getId(), client.getName()))
                      .toList();
    }
    
    @GetMapping
    public List<Client> getAllClients() {
        return clientService.findAll();
    }
}