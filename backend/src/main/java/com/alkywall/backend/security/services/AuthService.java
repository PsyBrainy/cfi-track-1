package com.alkywall.backend.security.services;

import com.alkywall.backend.models.Usuario;
import com.alkywall.backend.security.controllers.DTOs.LoginRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private userRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String login(LoginRequestDTO request) {

        // Buscar usuario en la base de datos por su email
        Usuario user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que la contraseña coincida
        if(!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Generar token
        return jwtService.generateToken(user);
    }
}
