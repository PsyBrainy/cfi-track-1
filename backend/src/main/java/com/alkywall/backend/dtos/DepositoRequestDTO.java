package com.alkywall.backend.dtos;

import java.math.BigDecimal;

public class DepositoRequestDTO {
    private BigDecimal monto;


    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
}
