package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashSet;
import java.util.function.Function;

@Service
public class JwtService {
    private final String SECRET_KEY;
    private final HashSet<String> tokens;

    public JwtService() {
        SECRET_KEY = "4bb6d1dfbafb64a681139d1586b6f1160d18159afd57c8c79136d7490630407c";
        tokens =  new HashSet<>();
    }

    private SecretKey getSigninKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSigninKey())
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

        boolean tokenExists = tokens.contains(token);
        boolean notExpired = expiryDate.after(new Date());
        boolean correctUser = username.equals(userDetails.getUsername());

        return tokenExists && notExpired && correctUser;
    }

    public String generateToken(User user) {
        var currentTime = System.currentTimeMillis();

        String token = Jwts
                .builder()
                .subject(user.getUsername())
                .issuedAt(new Date(currentTime))
                .expiration(new Date(currentTime + 24 * 60 * 60 * 1000))
                .signWith(getSigninKey())
                .compact();

        tokens.add(token);

        return token;
    }
}
