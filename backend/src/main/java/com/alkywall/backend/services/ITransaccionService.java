package com.alkywall.backend.services;

import java.math.BigDecimal;

public interface ITransaccionService {

    void realizarDeposito(Long cuentaId, BigDecimal monto);

    void realizarTransferencia(Long cuentaOrigenId, Long cuentaDestinoId, BigDecimal monto);
}
