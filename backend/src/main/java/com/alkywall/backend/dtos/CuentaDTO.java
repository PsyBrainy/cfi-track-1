package com.alkywall.backend.dtos;

import com.alkywall.backend.models.Moneda;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CuentaDTO {
    private BigDecimal saldoDisponible;
    private Moneda moneda;
    private String alias;
    private String cbu;
    private Long id_usuario;
    private Long cuentaId;
    private BigDecimal cotizacionDolar;
    private LocalDateTime fechaCotizacion;

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

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getCbu() {
        return cbu;
    }

    public void setCbu(String cbu) {
        this.cbu = cbu;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public Long getCuentaId() {
        return cuentaId;
    }

    public void setCuentaId(Long cuentaId) {
        this.cuentaId = cuentaId;
    }

    public LocalDateTime getFechaCotizacion() {
        return fechaCotizacion;
    }

    public void setFechaCotizacion(LocalDateTime fechaCotizacion) {
        this.fechaCotizacion = fechaCotizacion;
    }

    public BigDecimal getCotizacionDolar() {
        return cotizacionDolar;
    }

    public void setCotizacionDolar(BigDecimal cotizacionDolar) {
        this.cotizacionDolar = cotizacionDolar;
    }
}