package com.timetrackr.service;

import com.timetrackr.model.Client;
import com.timetrackr.repository.ClientRepository;
import org.springframework.stereotype.Service;

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
}