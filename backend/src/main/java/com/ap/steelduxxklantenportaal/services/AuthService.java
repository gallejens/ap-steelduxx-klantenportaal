package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.DTOs.SignInRequestDTO;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.utils.Cookies;
import com.ap.steelduxxklantenportaal.utils.Utils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.security.core.AuthenticationException;

@Service
public class AuthService {
    public static final String AUTH_TOKEN_COOKIE_NAME = "auth-token";
    public static final long AUTH_TOKEN_COOKIE_MAX_AGE = 24 * 60 * 60;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    public ResponseEntity<Object> signIn(SignInRequestDTO signInRequestDTO, HttpServletResponse response) {
        var authToken = new UsernamePasswordAuthenticationToken(signInRequestDTO.getEmail(), signInRequestDTO.getPassword());

        Authentication auth;
        try {
            auth = authenticationManager.authenticate(authToken);
        } catch (AuthenticationException e) {
            auth = null;
        }

        if (auth == null || !auth.isAuthenticated()) {
            return Utils.generateResponse("loginpage:loginFailed", HttpStatus.UNAUTHORIZED );
        };

        var user = userRepository.findByEmail(signInRequestDTO.getEmail()).orElseThrow();
        String jwtToken = jwtService.generateToken(user);
        Cookies.setCookie(response, AUTH_TOKEN_COOKIE_NAME, jwtToken, AUTH_TOKEN_COOKIE_MAX_AGE);

        return Utils.generateResponse("loginpage:loginSuccess", HttpStatus.ACCEPTED);

    }


}
