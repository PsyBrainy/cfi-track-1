package com.alkywall.backend.repositories;

import com.alkywall.backend.models.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.alkywall.backend.dtos.ReporteGastosDTO;
import com.alkywall.backend.dtos.TransaccionResumenDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    //Consulta: historial con WHERE y ORDER BY (incluye depósitos, egresos e ingresos)
    @Query("SELECT new com.alkywall.backend.dtos.TransaccionResumenDTO(t.idTransaccion, t.monto, cast(t.tipo as string), t.fechaHora, cast(t.estado as string)) " +
            "FROM Transaccion t " +
            "WHERE " +
            "(t.cuentaOrigen.idCuenta = :cuentaId AND t.tipo = 'EGRESO') " +
            "OR " +
            "(t.cuentaDestino.idCuenta = :cuentaId AND t.tipo = 'INGRESO') " +
            "OR " +
            "(t.cuentaDestino.idCuenta = :cuentaId AND t.tipo = 'DEPOSITO') " +
            "ORDER BY t.fechaHora DESC")
    List<TransaccionResumenDTO> obtenerHistorialPorCuenta(@Param("cuentaId") Long cuentaId);

    // Consulta: Agrupa con WHERE, GROUP BY y SUM (egresos/extracciones por cuenta origen + depósitos por cuenta destino)
    @Query("SELECT new com.alkywall.backend.dtos.ReporteGastosDTO(cast(t.tipo as string), SUM(t.monto)) " +
            "FROM Transaccion t " +
            "WHERE " +
            "(t.cuentaOrigen.idCuenta = :cuentaId AND t.tipo IN ('EGRESO', 'EXTRACCION')) " +
            "OR " +
            "(t.cuentaDestino.idCuenta = :cuentaId AND t.tipo = 'DEPOSITO') " +
            "GROUP BY t.tipo")
    List<ReporteGastosDTO> obtenerTotalAgrupadoPorTipo(@Param("cuentaId") Long cuentaId);
}