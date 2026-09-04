package com.alkywall.backend.controllers;

import com.alkywall.backend.services.ITransaccionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
