package com.alkywall.backend.repositories;

import com.alkywall.backend.models.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, Long> {
    Optional<Cuenta> findByUsuarioEmail(String email);

    Optional<Cuenta> findByUsuario_IdUsuario(Long id);
}