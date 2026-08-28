package com.alkywall.backend.controllers.DTOs;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String email;
    private String password;
}
