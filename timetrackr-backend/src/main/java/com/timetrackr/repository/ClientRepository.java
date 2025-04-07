package com.timetrackr.repository;

import com.timetrackr.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByUserId(Long userId);
}