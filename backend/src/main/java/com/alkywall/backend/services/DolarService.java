package com.alkywall.backend.services;

import com.alkywall.backend.dtos.DolarApiResponseDTO;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class DolarService {

    private final RestClient restClient;

    private BigDecimal cotizacionDolar;
    private LocalDateTime fechaCotizacion;

    public DolarService(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("https://dolarapi.com")
                .build();
    }

    public void actualizarCotizacion() {

        DolarApiResponseDTO response = restClient
                .get()
                .uri("/v1/dolares/oficial")
                .retrieve()
                .body(DolarApiResponseDTO.class);

        if(response != null && response.getVenta() != null) {
            this.cotizacionDolar = response.getVenta();
            this.fechaCotizacion = LocalDateTime.now();
        }
    }

    public BigDecimal obtenerCotizacion() {
        return cotizacionDolar;
    }

    public LocalDateTime obtenerFechaCotizacion() {
        return fechaCotizacion;
    }

    @PostConstruct
    public void inicializar() {
        actualizarCotizacion();
    }

    @Scheduled(
            cron = "0 0 9 * * *",
            zone = "America/Argentina/Buenos_Aires"
    )
    public void actualizarCotizacionProgramada() {
        actualizarCotizacion();
    }
}
