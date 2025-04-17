package com.timetrackr.repository;

import com.timetrackr.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
        boolean existsBy(); 
        
}