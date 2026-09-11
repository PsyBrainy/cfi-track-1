package com.alkywall.backend.services;

import com.alkywall.backend.repositories.CuentaRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
public class CuentaGeneratorService {

    private final CuentaRepository cuentaRepository;
    private final SecureRandom random = new SecureRandom();

    private static final List<String> PALABRAS = List.of(
            "sol", "luna", "rio", "monte", "cielo", "mar", "piedra", "nube",
            "viento", "fuego", "hoja", "arena", "puente", "estrella", "campo",
            "bosque", "lago", "torre", "valle", "roca", "nieve", "trueno",
            "cristal", "sombra", "aurora", "cometa", "brisa", "pluma", "eco", "faro"
    );

    public CuentaGeneratorService(CuentaRepository cuentaRepository) {
        this.cuentaRepository = cuentaRepository;
    }

    public String generarCbuUnico() {
        String cbu;
        do {
            cbu = generarCbu();
        } while (cuentaRepository.findByCbu(cbu).isPresent());
        return cbu;
    }

    public String generarAliasUnico() {
        String alias;
        do {
            alias = generarAlias();
        } while (cuentaRepository.findByAlias(alias).isPresent());
        return alias;
    }

    private String generarCbu() {
        StringBuilder sb = new StringBuilder(22);
        for (int i = 0; i < 22; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    private String generarAlias() {
        String palabra1 = PALABRAS.get(random.nextInt(PALABRAS.size()));
        String palabra2 = PALABRAS.get(random.nextInt(PALABRAS.size()));
        String palabra3 = PALABRAS.get(random.nextInt(PALABRAS.size()));
        return palabra1 + "." + palabra2 + "." + palabra3;
    }
}