package com.alkywall.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteGastosDTO {
    private String tipoTransaccion;
    private BigDecimal total;
}