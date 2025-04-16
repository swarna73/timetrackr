package com.timetrackr.controller;
import lombok.Builder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;

import com.timetrackr.dto.AuthRequest;
import com.timetrackr.dto.AuthResponse;
import com.timetrackr.dto.RegisterRequest;
import com.timetrackr.model.User;
import com.timetrackr.repository.UserRepository;
import com.timetrackr.service.UserService;
import com.timetrackr.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	
	private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

   
    public AuthController(UserService userService, JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
    }
    
    @PostMapping("/register")
   // @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        User newUser = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole()) // Or default to USER
            .build();

        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully");
    }
    
    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        System.out.println("📲 AuthController: trying to authenticate " + request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userService.findByEmail(request.getEmail());
        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token, user.getId()));
    }
}


