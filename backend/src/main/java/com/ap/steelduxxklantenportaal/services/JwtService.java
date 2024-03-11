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
    @Value("${jwt_access_token_secret}")
    private String accessTokenSecret;
    @Value("${jwt_refresh_token_secret}")
    private String refreshTokenSecret;

    private SecretKey getAccessTokenKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(accessTokenSecret));
    }

    private SecretKey getRefreshTokenKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshTokenSecret));
    }

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
        return extractClaim(token, resolver, getAccessTokenKey());
    }

    public <T> T extractClaimFromRefreshToken(String token, Function<Claims, T> resolver) {
        return extractClaim(token, resolver, getRefreshTokenKey());
    }

    private boolean isNonExpired(String token, SecretKey key) {
        Date expiryDate = extractClaim(token, Claims::getExpiration, key);
        return expiryDate.after(new Date());
    }

    public boolean isNonExpiredAccessToken(String token) {
        return isNonExpired(token, getAccessTokenKey());
    }

    public boolean isNonExpiredRefreshToken(String token) {
        return isNonExpired(token, getRefreshTokenKey());
    }

    private String generateToken(User user, SecretKey key, long maxAge) {
        var currentTime = System.currentTimeMillis();

        return Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + maxAge * 1000))
                .id(UUID.randomUUID().toString())
                .signWith(key)
                .compact();
    }

    public String generateAccessToken(User user) {
        return generateToken(user, getAccessTokenKey(), AuthService.ACCESS_TOKEN_COOKIE_MAX_AGE);
    }

    public String generateRefreshToken(User user) {
        return generateToken(user, getRefreshTokenKey(), AuthService.REFRESH_TOKEN_COOKIE_MAX_AGE);
    }
}
