package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private final SecretKey secretKey = Jwts.SIG.HS512.key().build();

    public Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    public boolean isValid(String token, UserDetails userDetails) {
        String username = extractClaim(token, Claims::getSubject);
        Date expiryDate = extractClaim(token, Claims::getExpiration);

        boolean notExpired = expiryDate.after(new Date());
        boolean correctUser = username.equals(userDetails.getUsername());

        return notExpired && correctUser;
    }

    public String generateToken(User user) {
        var currentTime = System.currentTimeMillis();

        return Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + 24 * 60 * 60 * 1000))
                .signWith(secretKey)
                .compact();
    }
}
