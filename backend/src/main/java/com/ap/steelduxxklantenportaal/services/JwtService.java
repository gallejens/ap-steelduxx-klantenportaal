package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt_secret}")
    private String secret;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    public boolean isNonExpired(String token) {
        Date expiryDate = extractClaim(token, Claims::getExpiration);
        return expiryDate.after(new Date());
    }

    public String generateToken(String subject, long maxAge) {
        var currentTime = System.currentTimeMillis();

        return Jwts
                .builder()
                .subject(subject)
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + maxAge * 1000))
                .id(UUID.randomUUID().toString())
                .signWith(getSecretKey())
                .compact();
    }
}
