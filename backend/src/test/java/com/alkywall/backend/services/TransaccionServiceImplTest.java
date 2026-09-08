package com.alkywall.backend.services;

import com.alkywall.backend.exceptions.ResourceNotFoundException;
import com.alkywall.backend.exceptions.SaldoInsuficienteException;
import com.alkywall.backend.models.Cuenta;
import com.alkywall.backend.models.Moneda;
import com.alkywall.backend.models.Role;
import com.alkywall.backend.models.Transaccion;
import com.alkywall.backend.models.Usuario;
import com.alkywall.backend.repositories.CuentaRepository;
import com.alkywall.backend.repositories.TransaccionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransaccionServiceImplTest {

    @Mock
    private CuentaRepository cuentaRepository;

    @Mock
    private TransaccionRepository transaccionRepository;

    @InjectMocks
    private TransaccionServiceImpl transaccionService;

    private Cuenta cuentaA;
    private Cuenta cuentaB;

    @BeforeEach
    void setUp() {
        Usuario usuarioA = new Usuario("Ana", "Gomez", "ana@alkywall.com",
                "11111111", "hashFicticioA", "1122334455", Role.CLIENT);
        Usuario usuarioB = new Usuario("Beto", "Perez", "beto@alkywall.com",
                "22222222", "hashFicticioB", "1155667788", Role.CLIENT);

        cuentaA = new Cuenta(usuarioA, "1000000000000000000001", "sol.luna.rio", Moneda.ARS);
        cuentaA.setIdCuenta(1L);
        cuentaA.setSaldo(new BigDecimal("1000.00"));

        cuentaB = new Cuenta(usuarioB, "1000000000000000000002", "mar.cielo.faro", Moneda.ARS);
        cuentaB.setIdCuenta(2L);
        cuentaB.setSaldo(new BigDecimal("500.00"));
    }

    // HAPPY PATH

    @Test
    @DisplayName("Happy Path: transferencia exitosa actualiza el saldo de origen y destino")
    void realizarTransferencia_conSaldoSuficiente_deberiaActualizarSaldosDeAmbasCuentas() {
        when(cuentaRepository.findByUsuarioEmail("ana@alkywall.com")).thenReturn(Optional.of(cuentaA));
        when(cuentaRepository.findByAlias("mar.cielo.faro")).thenReturn(Optional.of(cuentaB));
        when(cuentaRepository.save(any(Cuenta.class))).thenAnswer(inv -> inv.getArgument(0));
        when(transaccionRepository.save(any(Transaccion.class))).thenAnswer(inv -> inv.getArgument(0));

        BigDecimal monto = new BigDecimal("300.00");

        transaccionService.realizarTransferencia("ana@alkywall.com", "mar.cielo.faro", null, monto);

        assertEquals(new BigDecimal("700.00"), cuentaA.getSaldo());
        assertEquals(new BigDecimal("800.00"), cuentaB.getSaldo());

        verify(cuentaRepository, times(1)).save(cuentaA);
        verify(cuentaRepository, times(1)).save(cuentaB);
        verify(transaccionRepository, times(2)).save(any(Transaccion.class));
    }

    // EDGE CASES

    @Test
    @DisplayName("Edge Case: saldo insuficiente lanza SaldoInsuficienteException y no persiste ningún cambio")
    void realizarTransferencia_conSaldoInsuficiente_deberiaLanzarExcepcionYNoGuardarNada() {
        when(cuentaRepository.findByUsuarioEmail("ana@alkywall.com")).thenReturn(Optional.of(cuentaA));
        when(cuentaRepository.findByAlias("mar.cielo.faro")).thenReturn(Optional.of(cuentaB));

        BigDecimal montoExcesivo = new BigDecimal("5000.00");

        assertThrows(SaldoInsuficienteException.class, () ->
                transaccionService.realizarTransferencia("ana@alkywall.com", "mar.cielo.faro", null, montoExcesivo));

        assertEquals(new BigDecimal("1000.00"), cuentaA.getSaldo());
        assertEquals(new BigDecimal("500.00"), cuentaB.getSaldo());

        verify(cuentaRepository, never()).save(any(Cuenta.class));
        verify(transaccionRepository, never()).save(any(Transaccion.class));
    }

    @Test
    @DisplayName("Edge Case: cuenta destino inexistente lanza ResourceNotFoundException")
    void realizarTransferencia_conCuentaDestinoInexistente_deberiaLanzarResourceNotFoundException() {
        when(cuentaRepository.findByUsuarioEmail("ana@alkywall.com")).thenReturn(Optional.of(cuentaA));
        when(cuentaRepository.findByAlias("alias.inexistente")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                transaccionService.realizarTransferencia("ana@alkywall.com", "alias.inexistente", null, new BigDecimal("100")));

        verify(cuentaRepository, never()).save(any(Cuenta.class));
        verify(transaccionRepository, never()).save(any(Transaccion.class));
    }

    @Test
    @DisplayName("Edge Case: transferencia hacia la propia cuenta lanza IllegalArgumentException")
    void realizarTransferencia_haciaLaMismaCuenta_deberiaLanzarIllegalArgumentException() {
        when(cuentaRepository.findByUsuarioEmail("ana@alkywall.com")).thenReturn(Optional.of(cuentaA));
        when(cuentaRepository.findByAlias("sol.luna.rio")).thenReturn(Optional.of(cuentaA));

        assertThrows(IllegalArgumentException.class, () ->
                transaccionService.realizarTransferencia("ana@alkywall.com", "sol.luna.rio", null, new BigDecimal("100")));

        verify(transaccionRepository, never()).save(any(Transaccion.class));
    }
}