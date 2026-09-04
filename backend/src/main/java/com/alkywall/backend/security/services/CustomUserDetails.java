package com.alkywall.backend.security.services;

import com.alkywall.backend.models.Usuario;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final Long idUsuario;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;

    public CustomUserDetails(Usuario user) {
        this.idUsuario = user.getIdUsuario();
        this.email = user.getEmail();
        this.password = user.getPasswordHash();

        this.authorities = List.of(
                new SimpleGrantedAuthority(
                        "ROLE_" + user.getRol().name()
                )
        );

        this.enabled = !user.getEstado().name().equals("INACTIVO");

    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
