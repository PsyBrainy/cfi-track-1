package com.alkywall.backend.dtos;

import java.math.BigDecimal;

public class TransferenciaRequestDTO {

    private Long cuentaDestinoId;
    private BigDecimal monto;

    public Long getCuentaDestinoId() {
        return cuentaDestinoId;
    }

    public void setCuentaDestinoId(Long cuentaDestinoId) {
        this.cuentaDestinoId = cuentaDestinoId;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
}
