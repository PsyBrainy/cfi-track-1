package com.alkywall.backend.services;
import com.alkywall.backend.dtos.BalanceDTO;
import com.alkywall.backend.dtos.CuentaDTO;

public interface ICuentaService {
    BalanceDTO obtenerBalancePorEmail(String email);

    CuentaDTO obtenerCuentaPorIdUsuario(Long id);
}