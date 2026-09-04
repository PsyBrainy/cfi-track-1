package com.alkywall.backend.controllers;

import com.alkywall.backend.dtos.TransferenciaRequestDTO;
import com.alkywall.backend.services.ITransaccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    private final ITransaccionService transaccionService;

    public TransaccionController(ITransaccionService transaccionService) {
        this.transaccionService = transaccionService;
    }

    @PostMapping("/deposito")
    public ResponseEntity<Void> realizarDeposito(@RequestParam Long cuentaId, @RequestParam BigDecimal monto) {
        transaccionService.realizarDeposito(cuentaId, monto);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/transferencia/{cuentaOrigenId}")
    public ResponseEntity<Void> realizarTransferencia(@PathVariable Long cuentaOrigenId, @RequestBody TransferenciaRequestDTO request) {
        transaccionService.realizarTransferencia(cuentaOrigenId, request.getCuentaDestinoId(), request.getMonto());

        return ResponseEntity.ok().build();
    }
}
