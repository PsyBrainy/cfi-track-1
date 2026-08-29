package com.alkywall.backend.services;
import com.alkywall.backend.dtos.CuentaDTO;

public interface ICuentaService {
    CuentaDTO obtenerBalancePorEmail(String email);
}