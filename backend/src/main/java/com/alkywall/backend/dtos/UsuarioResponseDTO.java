package com.alkywall.backend.dtos;

import java.time.LocalDateTime;

public class UsuarioResponseDTO {
    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String email;
    private String dni;
    private String telefono;
    private LocalDateTime fechaAlta;
    private String estado;
    private String rol;

    // Getters & setters
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public LocalDateTime getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(LocalDateTime fechaAlta) { this.fechaAlta = fechaAlta; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}