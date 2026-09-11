package com.alkywall.backend.services;

import com.alkywall.backend.dtos.UsuarioRequestDTO;
import com.alkywall.backend.dtos.UsuarioResponseDTO;
import com.alkywall.backend.dtos.UsuarioUpdateDTO;
import com.alkywall.backend.exceptions.ResourceNotFoundException;
import com.alkywall.backend.models.EstadoUsuario;
import com.alkywall.backend.models.Role;
import com.alkywall.backend.models.Usuario;
import com.alkywall.backend.repositories.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuarioExistente;

    @BeforeEach
    void setUp() {
        usuarioExistente = new Usuario(
                "Juan",
                "Perez",
                "juan.perez@alkywall.com",
                "30111222",
                "hashDeContraseñaFicticio",
                "1122334455",
                Role.CLIENT
        );
        usuarioExistente.setIdUsuario(1L);
    }

    // HAPPY PATH

    @Test
    @DisplayName("crearUsuario: con datos válidos debería guardar y retornar el DTO correspondiente")
    void crearUsuario_conDatosValidos_deberiaGuardarYRetornarDTO() {
        // Arrange
        UsuarioRequestDTO requestDTO = new UsuarioRequestDTO();
        requestDTO.setNombre("Ana");
        requestDTO.setApellido("Gomez");
        requestDTO.setEmail("ana.gomez@alkywall.com");
        requestDTO.setDni("28999888");
        requestDTO.setPassword("passwordSinEncriptar");
        requestDTO.setTelefono("1133445566");

        Usuario usuarioGuardado = new Usuario(
                "Ana",
                "Gomez",
                "ana.gomez@alkywall.com",
                "28999888",
                "passwordSinEncriptar",
                "1133445566",
                Role.CLIENT
        );
        usuarioGuardado.setIdUsuario(2L);

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // Act
        UsuarioResponseDTO resultado = usuarioService.crearUsuario(requestDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals(2L, resultado.getIdUsuario());
        assertEquals("Ana", resultado.getNombre());
        assertEquals("Gomez", resultado.getApellido());
        assertEquals("ana.gomez@alkywall.com", resultado.getEmail());
        assertEquals("CLIENT", resultado.getRol());

        // Verifica que el repositorio fue efectivamente invocado
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    @DisplayName("obtenerPorId: con ID existente debería retornar el usuario correspondiente")
    void obtenerPorId_conIdExistente_deberiaRetornarUsuario() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));

        // Act
        UsuarioResponseDTO resultado = usuarioService.obtenerPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getIdUsuario());
        assertEquals("Juan", resultado.getNombre());
        assertEquals("juan.perez@alkywall.com", resultado.getEmail());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    // EDGE CASES

    @Test
    @DisplayName("obtenerPorId: con ID inexistente debería lanzar una excepción")
    void obtenerPorId_conIdInexistente_deberiaLanzarExcepcion() {
        // Arrange
        Long idInexistente = 999L;
        when(usuarioRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        // El metodo obtenerPorId actualmente lanza RuntimeException genérica,
        // no ResourceNotFoundException. Se testea el comportamiento real vigente.
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> usuarioService.obtenerPorId(idInexistente));

        assertTrue(exception.getMessage().contains("Usuario no encontrado con ID: " + idInexistente));
        verify(usuarioRepository, times(1)).findById(idInexistente);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    @DisplayName("actualizarUsuario: con ID inexistente debería lanzar ResourceNotFoundException")
    void actualizarUsuario_conIdInexistente_deberiaLanzarResourceNotFoundException() {
        // Arrange
        Long idInexistente = 999L;
        UsuarioUpdateDTO updateDTO = new UsuarioUpdateDTO();
        updateDTO.setNombre("Nombre Actualizado");
        updateDTO.setApellido("Apellido Actualizado");
        updateDTO.setTelefono("1100002222");

        when(usuarioRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> usuarioService.actualizarUsuario(idInexistente, updateDTO));

        assertTrue(exception.getMessage().contains("Usuario no encontrado con ID: " + idInexistente));
        verify(usuarioRepository, times(1)).findById(idInexistente);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    // TESTS ADICIONALES (cobertura extra sobre el resto del CRUD)
    @Test
    @DisplayName("obtenerTodos: debería retornar la lista completa de usuarios mapeada a DTO")
    void obtenerTodos_deberiaRetornarListaDeUsuarios() {
        // Arrange
        Usuario segundoUsuario = new Usuario(
                "Maria",
                "Lopez",
                "maria.lopez@alkywall.com",
                "27888777",
                "hashFicticio2",
                "1155667788",
                Role.CLIENT
        );
        segundoUsuario.setIdUsuario(3L);

        when(usuarioRepository.findAll()).thenReturn(List.of(usuarioExistente, segundoUsuario));

        // Act
        List<UsuarioResponseDTO> resultado = usuarioService.obtenerTodos();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Juan", resultado.get(0).getNombre());
        assertEquals("Maria", resultado.get(1).getNombre());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("actualizarUsuario: con ID existente debería actualizar y retornar el DTO correspondiente")
    void actualizarUsuario_conIdExistente_deberiaActualizarYRetornarDTO() {
        // Arrange
        UsuarioUpdateDTO updateDTO = new UsuarioUpdateDTO();
        updateDTO.setNombre("Juan Actualizado");
        updateDTO.setApellido("Perez Actualizado");
        updateDTO.setTelefono("1199998888");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioExistente);

        // Act
        UsuarioResponseDTO resultado = usuarioService.actualizarUsuario(1L, updateDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals("Juan Actualizado", resultado.getNombre());
        assertEquals("Perez Actualizado", resultado.getApellido());
        assertEquals("1199998888", resultado.getTelefono());
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, times(1)).save(usuarioExistente);
    }

    @Test
    @DisplayName("eliminarUsuario: con ID existente debería cambiar el estado a INACTIVO (baja lógica)")
    void eliminarUsuario_conIdExistente_deberiaCambiarEstadoAInactivo() {
        // Arrange
        usuarioExistente.setEstado(EstadoUsuario.ACTIVO);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioExistente));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioExistente);

        // Act
        usuarioService.eliminarUsuario(1L);

        // Assert
        assertEquals(EstadoUsuario.INACTIVO, usuarioExistente.getEstado());
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, times(1)).save(usuarioExistente);
    }
}