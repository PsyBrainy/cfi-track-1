package com.alkywall.backend.services;

import java.math.BigDecimal;
import com.alkywall.backend.dtos.ReporteGastosDTO;
import com.alkywall.backend.dtos.TransaccionResumenDTO;
import java.util.List;

public interface ITransaccionService {
    void realizarDeposito(String userEmail, BigDecimal monto);

    void realizarTransferencia(String email, String cbu, String alias, BigDecimal monto);

    List<TransaccionResumenDTO> obtenerHistorialUsuario(String userEmail);

    List<ReporteGastosDTO> obtenerReporteGastosUsuario(String userEmail);

}
