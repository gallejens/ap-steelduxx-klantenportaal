package com.ap.steelduxxklantenportaal.auth;

import com.ap.steelduxxklantenportaal.models.User;
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
    void should_returnToken_when_generatingAccessToken() {
        User user = new User();
        user.setEmail("test");

        String token = jwtService.generateAccessToken(user);
        assertThat(token).isNotEmpty();
    }

    @Test
    void should_returnToken_when_generatingRefreshToken() {
        User user = new User();
        user.setEmail("test");

        String token = jwtService.generateRefreshToken(user);
        assertThat(token).isNotEmpty();
    }

    @Test
    void should_findUsername_when_gettingClaimsFromAccessToken() {
        User user = new User();
        user.setEmail("test");

        String token = jwtService.generateAccessToken(user);

        String username = jwtService.extractClaimFromAccessToken(token, Claims::getSubject);
        assertThat(username.equals(user.getUsername())).isTrue();
    }

    @Test
    void should_findUsername_when_gettingClaimsFromRefreshToken() {
        User user = new User();
        user.setEmail("test");

        String token = jwtService.generateRefreshToken(user);

        String username = jwtService.extractClaimFromRefreshToken(token, Claims::getSubject);
        assertThat(username.equals(user.getUsername())).isTrue();
    }

    @Test
    void expect_newAccessToken_is_notExpired() {
        User user = new User();
        user.setEmail("test");

        String token = jwtService.generateAccessToken(user);

        assertThat(jwtService.isNonExpiredAccessToken(token)).isTrue();
    }

    @Test
    void expect_newRefreshToken_is_notExpired() {
        User user = new User();
        user.setEmail("test");

        String token = jwtService.generateRefreshToken(user);

        assertThat(jwtService.isNonExpiredRefreshToken(token)).isTrue();
    }
}
