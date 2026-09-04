package com.alkywall.backend.services;

import com.alkywall.backend.exceptions.ResourceNotFoundException;
import com.alkywall.backend.exceptions.SaldoInsuficienteException;
import com.alkywall.backend.models.Cuenta;
import com.alkywall.backend.models.TipoTransaccion;
import com.alkywall.backend.models.Transaccion;
import com.alkywall.backend.repositories.CuentaRepository;
import com.alkywall.backend.repositories.TransaccionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

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
    @Transactional
    public void realizarTransferencia(Long cuentaOrigenId, Long cuentaDestinoId, BigDecimal monto) {
        Cuenta cuentaOrigen = cuentaRepository.findById(cuentaOrigenId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta de origen no encontrada"));

        Cuenta cuentaDestino = cuentaRepository.findById(cuentaDestinoId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta destino no encontrada"));

        if(cuentaOrigen.getSaldo().compareTo(monto) < 0) {
            throw new SaldoInsuficienteException("Saldo insuficiente para realizar la transferencia");
        }

        cuentaOrigen.setSaldo(
                cuentaOrigen.getSaldo().subtract(monto)
        );

        cuentaDestino.setSaldo(
                cuentaDestino.getSaldo().add(monto)
        );

        cuentaRepository.save(cuentaOrigen);
        cuentaRepository.save(cuentaDestino);

        Transaccion egreso = new Transaccion(
                cuentaOrigen,
                cuentaDestino,
                TipoTransaccion.EGRESO,
                monto,
                cuentaOrigen.getMoneda(),
                "Transferencia"
        );

        Transaccion ingreso = new Transaccion(
                cuentaOrigen,
                cuentaDestino,
                TipoTransaccion.INGRESO,
                monto,
                cuentaDestino.getMoneda(),
                "Transferencia"
        );

        transaccionRepository.save(egreso);
        transaccionRepository.save(ingreso);
    }
}
