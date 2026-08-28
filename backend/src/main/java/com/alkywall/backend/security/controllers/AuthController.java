package com.alkywall.backend.security.controllers;

import com.alkywall.backend.security.controllers.DTOs.LoginRequestDTO;
import com.alkywall.backend.security.controllers.DTOs.LoginResponseDTO;
import com.alkywall.backend.security.services.JwtService;
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

//    @PostMapping("/register")
//    public ResponseEntity<RegisterResponseDTO> registerUser(@RequestBody RegisterRequestDTO body) {
//
//
//        return ResponseEntity.ok();
//    }
}
