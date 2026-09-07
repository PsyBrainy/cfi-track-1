package com.alkywall.backend.security.services;

import com.alkywall.backend.models.Cuenta;
import com.alkywall.backend.models.Moneda;
import com.alkywall.backend.models.Role;
import com.alkywall.backend.models.Usuario;
import com.alkywall.backend.repositories.CuentaRepository;
import com.alkywall.backend.repositories.UsuarioRepository;
import com.alkywall.backend.security.controllers.DTOs.*;
import com.alkywall.backend.services.CuentaGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final CuentaRepository cuentaRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CuentaGeneratorService cuentaGeneratorService;

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

    @Transactional
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

        // Creación automática de la cuenta bancaria asociada (ARS, saldo inicial 0)
        String cbu = cuentaGeneratorService.generarCbuUnico();
        String alias = cuentaGeneratorService.generarAliasUnico();

        Cuenta cuenta = new Cuenta(fullUser, cbu, alias, Moneda.ARS);
        cuentaRepository.save(cuenta);

        String token = jwtService.generateToken(fullUser);

        RegisterResponseDTO response = new RegisterResponseDTO();
        response.setToken(token);
        response.setNombre(fullUser.getNombre());
        response.setApellido(fullUser.getApellido());
        response.setEmail(fullUser.getEmail());
        response.setId(fullUser.getIdUsuario());
        response.setRole(fullUser.getRol());

        return response;
    }
}