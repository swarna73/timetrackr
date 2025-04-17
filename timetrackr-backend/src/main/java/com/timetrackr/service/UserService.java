package com.timetrackr.service;

import com.timetrackr.dto.RegisterRequest;
import com.timetrackr.model.Role;
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
    	user.setEmail(user.getEmail().trim()); 
        user.setUsername(user.getUsername().trim());
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
    public boolean isBootstrapNeeded() {
        return userRepository.count() == 0;
    }

    public void registerInitialManager(RegisterRequest request) {
        if (!isBootstrapNeeded()) {
            throw new IllegalStateException("Initial setup already complete");
        }

        User user = new User();
        System.out.println("Saving first manager user: " + request.getEmail());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.MANAGER); // 🚀 Force manager role

        userRepository.save(user);
    }
    
    public void register(RegisterRequest request) {
        User newUser = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .build();

        userRepository.save(newUser);
    }
}