package com.alkywall.backend.services;

import java.math.BigDecimal;
import com.alkywall.backend.dtos.ReporteGastosDTO;
import com.alkywall.backend.dtos.TransaccionResumenDTO;
import java.util.List;

public interface ITransaccionService {
    void realizarDeposito(Long cuentaId, BigDecimal monto);
    List<TransaccionResumenDTO> obtenerHistorialUsuario(Long cuentaId);
    List<ReporteGastosDTO> obtenerReporteGastosUsuario(Long cuentaId);
}
