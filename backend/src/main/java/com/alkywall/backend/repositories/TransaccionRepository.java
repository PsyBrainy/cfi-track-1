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
    //Consulta: historial con WHERE y ORDER BY
    @Query("SELECT new com.alkywall.backend.dtos.TransaccionResumenDTO(t.idTransaccion, t.monto, cast(t.tipo as string), t.fechaHora, cast(t.estado as string)) " +
            "FROM Transaccion t " +
            "WHERE t.cuentaOrigen.idCuenta = :cuentaId " +
            "ORDER BY t.fechaHora DESC")
    List<TransaccionResumenDTO> obtenerHistorialPorCuenta(@Param("cuentaId") Long cuentaId);

    // Consulta: Agrupa con JOIN, GROUP BY y SUM
    @Query("SELECT new com.alkywall.backend.dtos.ReporteGastosDTO(cast(t.tipo as string), SUM(t.monto)) " +
            "FROM Transaccion t " +
            "JOIN t.cuentaOrigen c " +
            "WHERE c.idCuenta = :cuentaId " +
            "GROUP BY t.tipo")
    List<ReporteGastosDTO> obtenerTotalAgrupadoPorTipo(@Param("cuentaId") Long cuentaId);
}