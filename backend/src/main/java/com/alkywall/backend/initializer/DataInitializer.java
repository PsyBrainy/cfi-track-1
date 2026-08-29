package com.alkywall.backend.initializer;

import com.alkywall.backend.models.Role;
import com.alkywall.backend.models.Usuario;
import com.alkywall.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${ADMIN_EMAIL}")
    private String ADMIN_EMAIL;

    @Value("${ADMIN_PASSWORD}")
    private String ADMIN_PASSWORD;

    @Value("${ADMIN_NOMBRE}")
    private String ADMIN_NOMBRE;

    @Value("${ADMIN_APELLIDO}")
    private String ADMIN_APELLIDO;

    @Value("${ADMIN_DNI}")
    private String ADMIN_DNI;

    @Value("${ADMIN_TELEFONO}")
    private String ADMIN_TELEFONO;

    @Bean
    CommandLineRunner init(UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        return args -> {

            if (!usuarioRepository.existsByEmail(ADMIN_EMAIL)) {

                Usuario admin = new Usuario(
                        ADMIN_NOMBRE,
                        ADMIN_APELLIDO,
                        ADMIN_EMAIL,
                        ADMIN_TELEFONO,
                        passwordEncoder.encode(ADMIN_PASSWORD),
                        ADMIN_DNI,
                        Role.ADMIN
                );

                admin.setRol(Role.ADMIN);

                usuarioRepository.save(admin);
            }
        };
    }
}
