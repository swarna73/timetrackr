package com.timetrackr.service;

import com.timetrackr.model.Client;
import com.timetrackr.repository.ClientRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public List<Client> findByUserId(Long userId) {
        return clientRepository.findByUserId(userId);
    }
    public Client findById(Long id) {
        return clientRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Client not found with ID: " + id));
    }
    public List<Client> findAll() {
        return clientRepository.findAll();
    }
}