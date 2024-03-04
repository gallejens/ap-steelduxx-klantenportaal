package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey accessTokenKey = Jwts.SIG.HS512.key().build();
    private final SecretKey refreshTokenKey = Jwts.SIG.HS512.key().build();

    private Claims extractAllClaims(String token, SecretKey key) {
        return Jwts
                .parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver, SecretKey key) {
        Claims claims = extractAllClaims(token, key);
        return resolver.apply(claims);
    }

    public <T> T extractClaimFromAccessToken(String token, Function<Claims, T> resolver) {
        return extractClaim(token, resolver, accessTokenKey);
    }

    public <T> T extractClaimFromRefreshToken(String token, Function<Claims, T> resolver) {
        return extractClaim(token, resolver, refreshTokenKey);
    }

    private boolean isNonExpired(String token, SecretKey key) {
        Date expiryDate = extractClaim(token, Claims::getExpiration, key);
        return expiryDate.after(new Date());
    }

    public boolean isNonExpiredAccessToken(String token) {
        return isNonExpired(token, accessTokenKey);
    }

    public boolean isNonExpiredRefreshToken(String token) {
        return isNonExpired(token, refreshTokenKey);
    }

    private String generateToken(User user, SecretKey key, long maxAge) {
        var currentTime = System.currentTimeMillis();

        return Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + maxAge * 1000))
                .signWith(key)
                .compact();
    }

    public String generateAccessToken(User user) {
        return generateToken(user, accessTokenKey, AuthService.ACCESS_TOKEN_COOKIE_MAX_AGE);
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, refreshTokenKey, AuthService.REFRESH_TOKEN_COOKIE_MAX_AGE);
    }
}
