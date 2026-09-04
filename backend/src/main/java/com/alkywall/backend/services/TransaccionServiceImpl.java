package com.alkywall.backend.services;

import com.alkywall.backend.dtos.ReporteGastosDTO;
import com.alkywall.backend.dtos.TransaccionResumenDTO;
import com.alkywall.backend.exceptions.ResourceNotFoundException;
import com.alkywall.backend.models.Cuenta;
import com.alkywall.backend.models.TipoTransaccion;
import com.alkywall.backend.models.Transaccion;
import com.alkywall.backend.repositories.CuentaRepository;
import com.alkywall.backend.repositories.TransaccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransaccionServiceImpl implements ITransaccionService {

    private final CuentaRepository cuentaRepository;
    private final TransaccionRepository transaccionRepository;

    public TransaccionServiceImpl(CuentaRepository cuentaRepository, TransaccionRepository transaccionRepository) {
        this.cuentaRepository = cuentaRepository;
        this.transaccionRepository = transaccionRepository;
    }

    @Override
    @Transactional
    public void realizarDeposito(Long cuentaId, BigDecimal monto) {
        Cuenta cuenta = cuentaRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada"));

        cuenta.setSaldo(cuenta.getSaldo().add(monto));
        cuentaRepository.save(cuenta);

        Transaccion transaccion = new Transaccion(
                null,
                cuenta,
                TipoTransaccion.DEPOSITO,
                monto,
                cuenta.getMoneda(),
                "Depósito"
        );

        transaccionRepository.save(transaccion);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<TransaccionResumenDTO> obtenerHistorialUsuario(Long cuentaId) {
        return transaccionRepository.obtenerHistorialPorCuenta(cuentaId);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<ReporteGastosDTO> obtenerReporteGastosUsuario(Long cuentaId) {
        return transaccionRepository.obtenerTotalAgrupadoPorTipo(cuentaId);
    }
}