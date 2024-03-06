package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.DTOs.SignInRequestDTO;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.RefreshToken;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.RefreshTokenRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.utils.Cookies;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    public static final long ACCESS_TOKEN_COOKIE_MAX_AGE = 5 * 60; // 5 minutes
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
    public static final long REFRESH_TOKEN_COOKIE_MAX_AGE = 72 * 60 * 60; // 3 days
    public static final String REFRESH_TOKEN_COOKIE_PATH = "/api/auth/refresh";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<Object> signIn(SignInRequestDTO signInRequestDTO, HttpServletResponse response) {
        var authToken = new UsernamePasswordAuthenticationToken(signInRequestDTO.email(), signInRequestDTO.password());

        Authentication auth;
        try {
            auth = authenticationManager.authenticate(authToken);
        } catch (AuthenticationException e) {
            auth = null;
        }

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseHandler.generate("loginpage:loginFailed", HttpStatus.UNAUTHORIZED);
        }

        var user = userRepository.findByEmail(signInRequestDTO.email()).orElseThrow();
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        Cookies.setCookie(response, ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_MAX_AGE);
        Cookies.setCookie(response, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_MAX_AGE, REFRESH_TOKEN_COOKIE_PATH);
        saveRefreshToken(user.getId(), refreshToken);

        return ResponseHandler.generate("loginpage:loginSuccess", HttpStatus.ACCEPTED);
    }

    @Transactional // without this the deleteByUserId throws an error
    public void signOut(HttpServletResponse response) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return;

        var user = (User) auth.getPrincipal();

        refreshTokenRepository.deleteByUserId(user.getId());
        Cookies.setCookie(response, AuthService.ACCESS_TOKEN_COOKIE_NAME, null, 0);
        Cookies.setCookie(response, AuthService.REFRESH_TOKEN_COOKIE_NAME, null, 0, AuthService.REFRESH_TOKEN_COOKIE_PATH);
        SecurityContextHolder.clearContext();
    }

    public ResponseEntity<Object> refresh(HttpServletRequest request, HttpServletResponse response) {
        String token = Cookies.getValue(request, REFRESH_TOKEN_COOKIE_NAME);
        if (token == null || !jwtService.isNonExpiredRefreshToken(token)) {
            return ResponseHandler.generate("refresh_failed", HttpStatus.FORBIDDEN);
        }

        try {
            RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow();
            User user = userRepository.findById(refreshToken.getUserId()).orElseThrow();

            String accessToken = jwtService.generateAccessToken(user);
            Cookies.setCookie(response, ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_MAX_AGE);
        } catch (Exception e) {
            return ResponseHandler.generate("refresh_failed", HttpStatus.FORBIDDEN);
        }

        return ResponseHandler.generate("refresh_successful", HttpStatus.OK);
    }

    public boolean doesUserExist(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User addNewUser(String email, String password, String firstName, String lastName, RoleEnum role) throws UserAlreadyExistsException  {
        if (doesUserExist(email)) {
            throw new UserAlreadyExistsException(String.format("User with email %s already exists", email));
        }

        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(email, encodedPassword, firstName, lastName, role);
        return userRepository.save(user);
    }

    private void saveRefreshToken(long userId, String token) {
        var refreshToken = new RefreshToken();
        refreshToken.setUserId(userId);
        refreshToken.setToken(token);
        refreshTokenRepository.save(refreshToken);
    }
}
