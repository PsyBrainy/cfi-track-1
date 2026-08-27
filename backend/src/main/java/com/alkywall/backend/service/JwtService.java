package com.alkywall.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${JWT_SECRET_KEY}")
    private String SECRET_KEY;

    private static final long TOKEN_EXPIRATION = 1000 * 60 * 60 * 24;




}
