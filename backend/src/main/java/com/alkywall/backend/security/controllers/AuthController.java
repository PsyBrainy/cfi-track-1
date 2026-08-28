package com.alkywall.backend.controllers;

import com.alkywall.backend.controllers.DTOs.LoginRequestDTO;
import com.alkywall.backend.controllers.DTOs.LoginResponseDTO;
import com.alkywall.backend.controllers.DTOs.RegisterRequestDTO;
import com.alkywall.backend.controllers.DTOs.RegisterResponseDTO;
import com.alkywall.backend.services.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> getUserById(@RequestBody LoginRequestDTO body) {


        UserDetails user = User.withDefaultPasswordEncoder()
                .username(body.getEmail())
                .password(body.getPassword())
                .roles("CLIENT")
                .build();

        String token = jwtService.generateToken(user.getUsername());

        LoginResponseDTO loginResponseDTO = new LoginResponseDTO();
        loginResponseDTO.setToken(token);

        return ResponseEntity.ok(loginResponseDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> registerUser(@RequestBody RegisterRequestDTO body) {


        return ResponseEntity.ok();
    }
}
