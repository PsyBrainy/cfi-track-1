package com.alkywall.backend.security.filters;

import com.alkywall.backend.security.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        log.info("[JWT-DEBUG] Ruta: {} | Header Authorization crudo: '{}'", request.getRequestURI(), authorization);
        if(authorization == null || !authorization.startsWith("Bearer ")) {
            log.info("[JWT-DEBUG] CORTE #1: header ausente o no empieza con 'Bearer ' -> sigue sin autenticar");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorization.substring(7);
        log.info("[JWT-DEBUG] Token extraído (primeros 20 chars): {}...", token.length() > 20 ? token.substring(0, 20) : token);
        String userEmail = null;

        try {
            userEmail = jwtService.extractUsername(token);
            log.info("[JWT-DEBUG] Username/email extraído del token: {}", userEmail);
        } catch (Exception e) {
            log.info("Token inválido o expirado");
            log.info("[JWT-DEBUG] CORTE #2: excepción al parsear el token -> {}: {}", e.getClass().getSimpleName(), e.getMessage());
        }

        if(userEmail == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            log.info("[JWT-DEBUG] CORTE #3: userEmail null ({}) o ya había Authentication en el contexto ({}) -> sigue sin autenticar",
                    userEmail == null, SecurityContextHolder.getContext().getAuthentication() != null);
            filterChain.doFilter(request, response);
            return;
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
        log.info("[JWT-DEBUG] UserDetails cargado: username={}, authorities={}, enabled={}",
                userDetails.getUsername(), userDetails.getAuthorities(), userDetails.isEnabled());
        boolean tokenValido = jwtService.isTokenValid(token, userDetails);
        log.info("[JWT-DEBUG] ¿Token válido según isTokenValid()?: {}", tokenValido);

        if(tokenValido) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("[JWT-DEBUG] Authentication seteada en el SecurityContext correctamente. Autoridades: {}", userDetails.getAuthorities());
        }else {
            log.info("[JWT-DEBUG] CORTE #4: token inválido -> no se autentica, seguirá como anónimo");
        }

        filterChain.doFilter(request, response);
    }
}
