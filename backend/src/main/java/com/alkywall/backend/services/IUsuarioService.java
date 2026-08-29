package com.alkywall.backend.services;

import com.alkywall.backend.dtos.UsuarioRequestDTO;
import com.alkywall.backend.dtos.UsuarioResponseDTO;
import com.alkywall.backend.dtos.UsuarioUpdateDTO;
import java.util.List;

public interface IUsuarioService {
    UsuarioResponseDTO crearUsuario(UsuarioRequestDTO dto);
    UsuarioResponseDTO obtenerPorId(Long id);
    List<UsuarioResponseDTO> obtenerTodos();
    UsuarioResponseDTO actualizarUsuario(Long id, UsuarioUpdateDTO dto);
    void eliminarUsuario(Long id);
}