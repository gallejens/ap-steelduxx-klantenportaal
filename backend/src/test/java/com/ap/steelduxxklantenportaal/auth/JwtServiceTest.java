package com.ap.steelduxxklantenportaal.auth;

import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.services.AuthService;
import com.ap.steelduxxklantenportaal.services.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class JwtServiceTest {
    @Autowired
    private JwtService jwtService;

    @Test
    void contextLoads() throws Exception {
        assertThat(jwtService).isNotNull();
    }

    @Test
    void should_returnToken_when_generatingToken() {
        String username = "test";
        String token = jwtService.generateToken(username, 60);
        assertThat(token).isNotEmpty();
    }

    @Test
    void should_findUsername_when_gettingClaimsFromToken() {
        String username = "test";
        String token = jwtService.generateToken(username, 60);

        String extractedUsername = jwtService.extractClaim(token, Claims::getSubject);
        assertThat(extractedUsername.equals(username)).isTrue();
    }

    @Test
    void expect_newToken_is_notExpired() {
        String username = "test";
        String token = jwtService.generateToken(username, 60);

        assertThat(jwtService.isNonExpired(token)).isTrue();
    }
}
