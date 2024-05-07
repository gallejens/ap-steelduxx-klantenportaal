package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.DeleteAccountDto;
import com.ap.steelduxxklantenportaal.dtos.ChangePasswordDto;
import com.ap.steelduxxklantenportaal.dtos.SignInRequestDto;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.exceptions.UserAlreadyExistsException;
import com.ap.steelduxxklantenportaal.models.ChoosePasswordToken;
import com.ap.steelduxxklantenportaal.models.RefreshToken;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.ChoosePasswordTokenRepository;
import com.ap.steelduxxklantenportaal.repositories.RefreshTokenRepository;
import com.ap.steelduxxklantenportaal.repositories.UserRepository;
import com.ap.steelduxxklantenportaal.utils.Cookies;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    public static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    public static final long ACCESS_TOKEN_COOKIE_MAX_AGE = 3 * 60; // 3 minutes
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
    public static final long REFRESH_TOKEN_COOKIE_MAX_AGE = 72 * 60 * 60; // 3 days
    public static final String REFRESH_TOKEN_COOKIE_PATH = "/api/auth";

    @Value("${frontend_url}")
    private String frontendUrl;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final ChoosePasswordTokenRepository choosePasswordTokenRepository;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            ChoosePasswordTokenRepository choosePasswordTokenRepository,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.choosePasswordTokenRepository = choosePasswordTokenRepository;
        this.emailService = emailService;
    }

    public ResponseEntity<Object> signIn(SignInRequestDto signInRequestDTO, HttpServletResponse response) {
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

        // Generate accesstoken and refreshtoken for user and set cookies
        var user = userRepository.findByEmail(signInRequestDTO.email()).orElseThrow();
        String accessToken = jwtService.generateToken(user.getUsername(), ACCESS_TOKEN_COOKIE_MAX_AGE);
        Cookies.setCookie(response, ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_MAX_AGE);

        generateRefreshTokenForUser(user, response);

        return ResponseHandler.generate("loginpage:loginSuccess", HttpStatus.ACCEPTED);
    }

    @Transactional
    public void signOut(HttpServletRequest request, HttpServletResponse response) {
        // Delete current refreshtoken from db, we dont delete all by userid to prevent
        // other devices also logging out
        String currentRefreshToken = Cookies.getValue(request, REFRESH_TOKEN_COOKIE_NAME);
        if (currentRefreshToken != null) {
            refreshTokenRepository.deleteById(currentRefreshToken);
        }

        // Clear cookies
        Cookies.setCookie(response, ACCESS_TOKEN_COOKIE_NAME, null, 0);
        Cookies.setCookie(response, REFRESH_TOKEN_COOKIE_NAME, null, 0, REFRESH_TOKEN_COOKIE_PATH);
        SecurityContextHolder.clearContext();
    }

    public ResponseEntity<Object> refresh(HttpServletRequest request, HttpServletResponse response) {
        String token = Cookies.getValue(request, REFRESH_TOKEN_COOKIE_NAME);

        try {
            if (token == null)
                throw new RuntimeException();

            RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow();
            if (refreshToken.isExpired())
                throw new RuntimeException();

            User user = userRepository.findById(refreshToken.getUserId()).orElseThrow();

            String accessToken = jwtService.generateToken(user.getUsername(), ACCESS_TOKEN_COOKIE_MAX_AGE);
            Cookies.setCookie(response, ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_MAX_AGE);
        } catch (Exception e) {
            return ResponseHandler.generate("refresh_failed", HttpStatus.UNAUTHORIZED);
        }

        return ResponseHandler.generate("refresh_successful", HttpStatus.OK);
    }

    public boolean doesUserExist(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User addNewUser(String email, String password, String firstName, String lastName, RoleEnum role)
            throws UserAlreadyExistsException {
        if (doesUserExist(email)) {
            throw new UserAlreadyExistsException(String.format("User with email %s already exists", email));
        }

        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(email, encodedPassword, firstName, lastName, role);
        return userRepository.save(user);
    }

    // Generate a refreshtoken for a user, save it and add it to cookies
    private void generateRefreshTokenForUser(User user, HttpServletResponse response) {
        String token = UUID.randomUUID().toString();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(new Date().getTime() + REFRESH_TOKEN_COOKIE_MAX_AGE * 1000);
        refreshTokenRepository.save(refreshToken);

        Cookies.setCookie(response, REFRESH_TOKEN_COOKIE_NAME, token, REFRESH_TOKEN_COOKIE_MAX_AGE,
                REFRESH_TOKEN_COOKIE_PATH);
    }

    public void requestPasswordReset(String email) throws MessagingException {
        long PASSWORD_RESET_TOKEN_TIME = 30 * 60; // 30 minutes
        sendChoosePasswordEmail(email, PASSWORD_RESET_TOKEN_TIME);
    }

    public void sendChoosePasswordEmail(String email, long expiryTime) throws MessagingException {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return;
        }

        // Generate choose-password token, save it and email it as search params in link
        // to user
        var choosePasswordToken = new ChoosePasswordToken();
        String uuid = UUID.randomUUID().toString();
        choosePasswordToken.setToken(uuid);
        choosePasswordToken.setUserId(user.get().getId());
        choosePasswordToken.setExpiryDate(new Date().getTime() + expiryTime * 1000);
        choosePasswordTokenRepository.save(choosePasswordToken);

        String choosePasswordLink = frontendUrl + "/choose-password?token=" + uuid;
        emailService.sendChoosePasswordLink(user.get(), choosePasswordLink);
    }

    private User getUserForChoosePasswordToken(String token) {
        Optional<ChoosePasswordToken> choosePasswordToken = choosePasswordTokenRepository.findByToken(token);
        if (choosePasswordToken.isEmpty() || choosePasswordToken.get().isExpired()) {
            return null;
        }

        return userRepository.findById(choosePasswordToken.get().getUserId()).orElseThrow();
    }

    public ResponseEntity<Object> getEmailForChoosePasswordToken(String token) {
        User user = getUserForChoosePasswordToken(token);

        if (user == null) {
            return ResponseHandler.generate("invalid_token", HttpStatus.NOT_ACCEPTABLE);
        }

        return ResponseHandler.generate("found_email", HttpStatus.OK, Map.of("email", user.getEmail()));
    }

    @Transactional
    public ResponseEntity<Object> choosePassword(String token, String password) {
        User user = getUserForChoosePasswordToken(token);
        if (user == null) {
            return ResponseHandler.generate("failed", HttpStatus.NOT_ACCEPTABLE);
        }

        // When choosing password (after review or reset) we delete all refreshtokens &
        // update password
        updatePassword(user, password);
        refreshTokenRepository.deleteByUserId(user.getId());
        choosePasswordTokenRepository.deleteByUserId(user.getId());

        return ResponseHandler.generate("success", HttpStatus.OK);
    }

    private void updatePassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    @Transactional
    public ResponseEntity<Object> changePassword(ChangePasswordDto changePasswordDto, HttpServletResponse response) {
        var user = AuthService.getCurrentUser();
        if (user == null) {
            return ResponseHandler.generate("invalidPassword", HttpStatus.UNAUTHORIZED);
        }

        // Check if oldpassword matches actual password
        if (!passwordEncoder.matches(changePasswordDto.oldPassword(), user.getPassword())) {
            return ResponseHandler.generate("invalidPassword", HttpStatus.UNAUTHORIZED);
        }

        // Update password, delete all refreshtokens to sign out on every device but
        // generate new refreshtoken current user
        updatePassword(user, changePasswordDto.newPassword());
        refreshTokenRepository.deleteByUserId(user.getId());
        generateRefreshTokenForUser(user, response);

        return ResponseHandler.generate("success", HttpStatus.OK);
    }

    @Transactional
    public void deleteAccount(long accountId) {
        userRepository.deleteById(accountId);
    }

    public static User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            return null;
        var user = auth.getPrincipal();
        if (user == null)
            return null;
        return (User) user;
    }
}
