package com.alkywall.backend.dtos;

public class UsuarioUpdateDTO {
    private String nombre;
    private String apellido;
    private String telefono;

    // Getters & setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}