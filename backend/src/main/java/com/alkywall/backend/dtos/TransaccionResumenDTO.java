package com.alkywall.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionResumenDTO {
    private Long id;
    private BigDecimal monto;
    private String tipo;
    private LocalDateTime fecha;
    private String estado;
}