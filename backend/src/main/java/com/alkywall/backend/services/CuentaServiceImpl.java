package com.alkywall.backend.services;

import com.alkywall.backend.dtos.CuentaDTO;
import com.alkywall.backend.exceptions.ResourceNotFoundException;
import com.alkywall.backend.models.Cuenta;
import com.alkywall.backend.repositories.CuentaRepository;
import org.springframework.stereotype.Service;

@Service
public class CuentaServiceImpl implements ICuentaService {

    private final CuentaRepository cuentaRepository;

    public CuentaServiceImpl(CuentaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    @Override
    public CuentaDTO obtenerBalancePorEmail(String email) {
        Cuenta cuenta = cuentaRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró una cuenta para este usuario"));

        CuentaDTO dto = new CuentaDTO();
        dto.setSaldoDisponible(cuenta.getSaldo());
        dto.setMoneda(cuenta.getMoneda());

        return dto;
    }
}