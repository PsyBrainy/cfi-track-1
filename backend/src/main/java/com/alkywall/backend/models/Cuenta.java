package com.alkywall.backend.models;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cuentas")
public class Cuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCuenta;

    // FK hacia Usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "cbu", length = 22, unique = true, nullable = false)
    private String cbu;

    @Column(name = "alias", length = 30, unique = true, nullable = false)
    private String alias;

    @Enumerated(EnumType.STRING)
    @Column(name = "moneda", length = 3, nullable = false)
    private Moneda moneda;

    @Column(name = "saldo", precision = 14, scale = 2, nullable = false)
    private BigDecimal saldo;

    @Column(name = "fecha_apertura")
    private LocalDateTime fechaApertura;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private EstadoCuenta estado;

    // Constructor vacío exigido por JPA
    public Cuenta() {
    }

    public Cuenta(Usuario usuario, String cbu, String alias, Moneda moneda) {
        this.usuario=usuario;
        this.cbu=cbu;
        this.alias= alias;
        this.moneda=moneda;
        this.saldo = BigDecimal.ZERO; //se crea la cuenta con saldo inicial 0
        this.fechaApertura= LocalDateTime.now();
        this.estado= EstadoCuenta.ACTIVA;
    }

    // GETTERS & SETTERS
    public Long getIdCuenta() {
        return idCuenta;
    }

    public void setIdCuenta(Long idCuenta) {
        this.idCuenta = idCuenta;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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

    public Moneda getMoneda() {
        return moneda;
    }

    public void setMoneda(Moneda moneda) {
        this.moneda = moneda;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public LocalDateTime getFechaApertura() {
        return fechaApertura;
    }

    public void setFechaApertura(LocalDateTime fechaApertura) {
        this.fechaApertura = fechaApertura;
    }

    public EstadoCuenta getEstado() {
        return estado;
    }

    public void setEstado(EstadoCuenta estado) {
        this.estado = estado;
    }
}