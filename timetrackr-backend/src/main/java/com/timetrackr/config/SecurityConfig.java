package com.timetrackr.config;

import com.timetrackr.repository.UserRepository;
import com.timetrackr.model.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    // ✅ Constructor injection
    public SecurityConfig(UserRepository userRepository) {
        System.out.println("✅ SecurityConfig loaded");
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Primary
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder encoder, UserDetailsService userDetailsService) 
            throws Exception {
        System.out.println("Auth manager: " );

        return http
            .getSharedObject(AuthenticationManagerBuilder.class)
            .userDetailsService(userDetailsService)
            .passwordEncoder(encoder)
            .and()
            .build();
    }

    // ✅ THE KEY PIECE
    @Bean
    public UserDetailsService userDetailsService() {
        return email -> {
            System.out.println("🔐 [SECURITY] Looking up user: " + email);
            User user = userRepository.findByEmail(email.trim());
            if (user == null) {
                System.out.println("❌ User not found for email: " + email);
                throw new UsernameNotFoundException("User not found");
            }
            return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.emptyList()
            );
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    	http.cors().and() // 👈 Add this line
        .csrf().disable()
        .headers().frameOptions().disable()
        .and()
        .authorizeHttpRequests()
        .requestMatchers("/api/auth/**", "/h2-console/**").permitAll()
        .anyRequest().authenticated();
        return http.build();
    }
    
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}