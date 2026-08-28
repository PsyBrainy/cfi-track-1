package com.alkywall.backend.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaccion")
    private Long idTransaccion;

    @ManyToOne
    @JoinColumn(name = "id_cuenta_origen")
    private Cuenta cuentaOrigen;

    @ManyToOne
    @JoinColumn(name = "id_cuenta_destino")
    private Cuenta cuentaDestino;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", length = 20, nullable = false)
    private TipoTransaccion tipo;

    @Column(name = "monto", precision = 14, scale = 2, nullable = false)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(name = "moneda", length = 3, nullable = false)
    private Moneda moneda;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(name = "descripcion", length = 140)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20, nullable = false)
    private EstadoTransaccion estado;

    public Transaccion() {
    }

    public Transaccion(Cuenta cuentaOrigen, Cuenta cuentaDestino, TipoTransaccion tipo, BigDecimal monto, Moneda moneda, String descripcion) {
        this.cuentaOrigen = cuentaOrigen;
        this.cuentaDestino = cuentaDestino;
        this.tipo = tipo;
        this.monto = monto;
        this.moneda = moneda;
        this.descripcion = descripcion;
        this.fechaHora = LocalDateTime.now();
        this.estado = EstadoTransaccion.APROBADA;
    }

    //GETTERS

    public Long getIdTransaccion() { return idTransaccion; }
    public Cuenta getCuentaOrigen() { return cuentaOrigen; }
    public Cuenta getCuentaDestino() { return cuentaDestino; }
    public TipoTransaccion getTipo() { return tipo; }
    public BigDecimal getMonto() { return monto; }
    public Moneda getMoneda() { return moneda; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public String getDescripcion() { return descripcion; }
    public EstadoTransaccion getEstado() { return estado; }

    //SETTERS
    public void setIdTransaccion(Long idTransaccion) { this.idTransaccion = idTransaccion; }
    public void setCuentaOrigen(Cuenta cuentaOrigen) { this.cuentaOrigen = cuentaOrigen; }
    public void setCuentaDestino(Cuenta cuentaDestino) { this.cuentaDestino = cuentaDestino; }
    public void setTipo(TipoTransaccion tipo) { this.tipo = tipo; }
    public void setMoneda(Moneda moneda) { this.moneda = moneda; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setEstado(EstadoTransaccion estado) { this.estado = estado; }
}