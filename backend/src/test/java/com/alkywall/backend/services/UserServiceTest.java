package com.alkywall.backend.services;

import com.alkywall.backend.dtos.UsuarioRequestDTO;
import com.alkywall.backend.dtos.UsuarioResponseDTO;
import com.alkywall.backend.exceptions.ResourceNotFoundException;
import com.alkywall.backend.models.EstadoUsuario;
import com.alkywall.backend.models.Role;
import com.alkywall.backend.models.Usuario;
import com.alkywall.backend.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    @Test
    void crearUsuario_HappyPath() {
        UsuarioRequestDTO request = new UsuarioRequestDTO();
        request.setNombre("Federico");
        request.setEmail("federico@test.com");

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setIdUsuario(1L);
        usuarioGuardado.setNombre("Federico");
        usuarioGuardado.setEmail("federico@test.com");
        usuarioGuardado.setRol(Role.CLIENT);
        usuarioGuardado.setEstado(EstadoUsuario.ACTIVO);
        usuarioGuardado.setFechaAlta(LocalDateTime.now());

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);
        UsuarioResponseDTO response = usuarioService.crearUsuario(request);
        assertNotNull(response);
        assertEquals("Federico", response.getNombre());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void obtenerPorId_EdgeCase_LanzaExcepcion() {
        Long idInvalido = 99L;
        when(usuarioRepository.findById(idInvalido)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> usuarioService.obtenerPorId(idInvalido));
        verify(usuarioRepository, times(1)).findById(idInvalido);
    }
}