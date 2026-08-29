package com.alkywall.backend.security.services;

import com.alkywall.backend.models.Role;
import com.alkywall.backend.models.Usuario;
import com.alkywall.backend.repositories.UsuarioRepository;
import com.alkywall.backend.security.controllers.DTOs.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginResponseDTO login(LoginRequestDTO request) {

        Authentication authentication = authenticationManager.
                authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        Usuario user = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Generar token
        String token = jwtService.generateToken(user);

        return new LoginResponseDTO(token);
    }

    public RegisterResponseDTO register(RegisterRequestDTO request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        if (usuarioRepository.existsByDni(request.getDni())) {
            throw new IllegalArgumentException("El DNI ya está registrado");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());

        Usuario user = new Usuario(
                request.getNombre(),
                request.getApellido(),
                request.getEmail(),
                request.getDni(),
                passwordHash,
                request.getTelefono(),
                Role.CLIENT
        );

        Usuario fullUser = usuarioRepository.save(user);

        String token = jwtService.generateToken(user);

        RegisterResponseDTO response = new RegisterResponseDTO();
        response.setToken(token);
        response.setNombre(request.getNombre());
        response.setApellido(request.getApellido());
        response.setEmail(request.getEmail());
        response.setId(fullUser.getIdUsuario());
        response.setRole(fullUser.getRol());

        return response;
    }
}

