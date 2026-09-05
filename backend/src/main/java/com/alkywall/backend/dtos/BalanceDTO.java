package com.alkywall.backend.dtos;

import com.alkywall.backend.models.Moneda;
import java.math.BigDecimal;

public class BalanceDTO {

    private BigDecimal saldoDisponible;
    private Moneda moneda;
    private Long cuentaId;

    //getters & setters
    public BigDecimal getSaldoDisponible() {
        return saldoDisponible;
    }

    public void setSaldoDisponible(BigDecimal saldoDisponible) {
        this.saldoDisponible = saldoDisponible;
    }

    public Moneda getMoneda() {
        return moneda;
    }

    public void setMoneda(Moneda moneda) {
        this.moneda = moneda;
    }

    public Long getCuentaId() {
        return cuentaId;
    }

    public void setCuentaId(Long cuentaId) {
        this.cuentaId = cuentaId;
    }
}