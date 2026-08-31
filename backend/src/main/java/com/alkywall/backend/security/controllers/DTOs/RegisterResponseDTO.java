package com.alkywall.backend.security.controllers.DTOs;

import com.alkywall.backend.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponseDTO {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private Role role;
}
