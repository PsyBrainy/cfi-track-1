package com.alkywall.backend.security.services;

import com.alkywall.backend.models.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${JWT_SECRET_KEY}")
    private String JWT_SECRET_KEY;

    private SecretKey signingKey;

    private static final long TOKEN_EXPIRATION = 1000L * 60 * 60 * 24;

    // Se ejecuta una sola vez después de que Spring inyecta las dependencias
    @PostConstruct
    public void init() {
        // Decodifica la JWT_SECRET_KEY
        byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET_KEY);

        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // Generar Token
    public String generateToken(Map<String, Object> extraClaims, Usuario user) {
        Date now = new Date();

        return Jwts.builder()
                .claims(extraClaims)
                .subject(user.getEmail())
                .issuedAt(now)
                .expiration(new Date( now.getTime() + TOKEN_EXPIRATION))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public String generateToken(Usuario user) {
        return generateToken(new HashMap<>(), user);
    }

    public String extractUsername(String token) {
        return extractClaim(token, claims -> claims.getSubject());
    }

    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> claims.get("roles", List.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String tokenUsername = extractUsername(token);
        return (tokenUsername.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, claims -> claims.getExpiration()).before(new Date());
    }

    private Claims getAllClaims(String token) {
        return Jwts
            .parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

}
