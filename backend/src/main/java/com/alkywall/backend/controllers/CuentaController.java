package com.alkywall.backend.controllers;

import com.alkywall.backend.dtos.BalanceDTO;
import com.alkywall.backend.dtos.CuentaDTO;
import com.alkywall.backend.security.services.CustomUserDetails;
import com.alkywall.backend.services.ICuentaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cuentas")
public class CuentaController {

    private final ICuentaService cuentaService;

    public CuentaController(ICuentaService cuentaService) {
        this.cuentaService = cuentaService;
    }

    @GetMapping
    public ResponseEntity<CuentaDTO> obtenerCuenta(@AuthenticationPrincipal CustomUserDetails user) {
        Long idUsuario = user.getIdUsuario();

        CuentaDTO cuentaDTO = cuentaService.obtenerCuentaPorIdUsuario(idUsuario);

        return ResponseEntity.ok(cuentaDTO);
    }

    @GetMapping("/balance")
    public ResponseEntity<BalanceDTO> obtenerBalance(@AuthenticationPrincipal CustomUserDetails user) {

        String email = user.getUsername();

        BalanceDTO balanceDTO = cuentaService.obtenerBalancePorEmail(email);

        return ResponseEntity.ok(balanceDTO);
    }
}
