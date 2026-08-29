package com.alkywall.backend.security.controllers;

import com.alkywall.backend.security.controllers.DTOs.LoginRequestDTO;
import com.alkywall.backend.security.controllers.DTOs.LoginResponseDTO;
import com.alkywall.backend.security.controllers.DTOs.RegisterRequestDTO;
import com.alkywall.backend.security.controllers.DTOs.RegisterResponseDTO;
import com.alkywall.backend.security.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> getUserByEmail(@Valid @RequestBody LoginRequestDTO body) {
        return ResponseEntity.ok(authService.login(body));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> registerUser(@Valid @RequestBody RegisterRequestDTO body) {
        return ResponseEntity.ok(authService.register(body));
    }
}
