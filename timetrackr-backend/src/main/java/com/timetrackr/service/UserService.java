package com.timetrackr.service;

import com.timetrackr.model.User;
import com.timetrackr.repository.UserRepository;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User save(User user) {
    	System.out.println("Saving user email: [" + user.getEmail() + "]");
    	user.setEmail(user.getEmail().trim()); // ✅ Trim email
        user.setUsername(user.getUsername().trim()); // Optional: trim username too
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        System.out.println("Looking for user with email: [" + email + "]");
        return userRepository.findByEmail(email.trim());
    }
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }
}