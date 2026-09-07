package com.alkywall.backend.controllers;

import com.alkywall.backend.dtos.DepositoRequestDTO;
import com.alkywall.backend.dtos.ReporteGastosDTO;
import com.alkywall.backend.dtos.TransaccionResumenDTO;
import com.alkywall.backend.dtos.TransferenciaRequestDTO;
import com.alkywall.backend.security.services.CustomUserDetails;
import com.alkywall.backend.services.ITransaccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    private final ITransaccionService transaccionService;

    public TransaccionController(ITransaccionService transaccionService) {
        this.transaccionService = transaccionService;
    }

    @PostMapping("/deposito")
    public ResponseEntity<Void> realizarDeposito(@AuthenticationPrincipal CustomUserDetails user, @RequestBody DepositoRequestDTO request) {
        String userEmail = user.getUsername();

        transaccionService.realizarDeposito(userEmail, request.getMonto());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/transferencia")
    public ResponseEntity<Void> realizarTransferencia(@AuthenticationPrincipal CustomUserDetails user, @RequestBody TransferenciaRequestDTO request) {
        String userEmail = user.getUsername();

        transaccionService.realizarTransferencia(userEmail, request.getAlias(), request.getCbu(), request.getMonto());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/reporte-gastos")
    public ResponseEntity<List<ReporteGastosDTO>> listarReporteDeGastos(@AuthenticationPrincipal CustomUserDetails user) {
        String userEmail = user.getUsername();

        List<ReporteGastosDTO> reportes = transaccionService.obtenerReporteGastosUsuario(userEmail);

        return ResponseEntity.ok(reportes);
    }

    @GetMapping("/historial")
    public ResponseEntity<List<TransaccionResumenDTO>> obtenerHistorial(@AuthenticationPrincipal CustomUserDetails user) {
        String userEmail = user.getUsername();

        List<TransaccionResumenDTO> historial = transaccionService.obtenerHistorialUsuario(userEmail);

        return ResponseEntity.ok(historial);
    }
}