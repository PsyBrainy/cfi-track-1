package com.alkywall.backend.services;

import com.alkywall.backend.dtos.UsuarioRequestDTO;
import com.alkywall.backend.dtos.UsuarioResponseDTO;
import com.alkywall.backend.dtos.UsuarioUpdateDTO;
import com.alkywall.backend.exceptions.ResourceNotFoundException;
import com.alkywall.backend.models.*;
import com.alkywall.backend.repositories.CuentaRepository;
import com.alkywall.backend.repositories.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final CuentaRepository cuentaRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, CuentaRepository cuentaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.cuentaRepository = cuentaRepository;
    }

    @Override
    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO dto) {

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        if (usuarioRepository.existsByDni(dto.getDni())) {
            throw new IllegalArgumentException("El DNI ya está registrado");
        }

        //Mapear DTO a Entidad
        Usuario nuevoUsuario = new Usuario(
                dto.getNombre(),
                dto.getApellido(),
                dto.getEmail(),
                dto.getDni(),
                passwordEncoder.encode(dto.getPassword()),
                dto.getTelefono(),
                Role.CLIENT
        );
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        return mapearAResponseDTO(usuarioGuardado);
    }

    @Override
    public UsuarioResponseDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        return mapearAResponseDTO(usuario);
    }

    @Override
    public List<UsuarioResponseDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::mapearAResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioResponseDTO actualizarUsuario(Long id, UsuarioUpdateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setTelefono(dto.getTelefono());

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return mapearAResponseDTO(usuarioActualizado);
    }

    @Override
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        Cuenta cuenta = cuentaRepository.findByUsuario_IdUsuario(id)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada para el usuario con ID: " + id));

        cuenta.setEstado(EstadoCuenta.CERRADA);
        usuario.setEstado(EstadoUsuario.INACTIVO);
        cuentaRepository.save(cuenta);
        usuarioRepository.save(usuario);
    }

    private UsuarioResponseDTO mapearAResponseDTO(Usuario usuario) {
        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setIdUsuario(usuario.getIdUsuario());
        response.setNombre(usuario.getNombre());
        response.setApellido(usuario.getApellido());
        response.setEmail(usuario.getEmail());
        response.setDni(usuario.getDni());
        response.setTelefono(usuario.getTelefono());
        response.setFechaAlta(usuario.getFechaAlta());
        response.setEstado(usuario.getEstado().name());
        response.setRol(usuario.getRol().name());
        return response;
    }
}