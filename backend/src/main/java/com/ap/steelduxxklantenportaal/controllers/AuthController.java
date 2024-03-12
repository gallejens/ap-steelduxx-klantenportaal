package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.ChangePasswordDto;
import com.ap.steelduxxklantenportaal.DTOs.ChoosePasswordDto;
import com.ap.steelduxxklantenportaal.DTOs.ResetPasswordDto;
import com.ap.steelduxxklantenportaal.DTOs.SignInRequestDTO;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.services.AuthService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signin")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> signIn(@RequestBody SignInRequestDTO signInRequestDTO, HttpServletResponse response) {
        return authService.signIn(signInRequestDTO, response);
    }

    @PostMapping("/signout")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> signOut(HttpServletRequest request, HttpServletResponse response) {
        authService.signOut(request, response);
        return ResponseHandler.generate("logout_successful", HttpStatus.OK);
    }

    @PostMapping("/refresh")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> refresh(HttpServletRequest request, HttpServletResponse response) {
        return authService.refresh(request, response);
    }

    @PostMapping("/reset-password")
    @PreAuthorize("permitAll")
    @ResponseStatus(HttpStatus.OK)
    public void resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) throws MessagingException {
        authService.requestPasswordReset(resetPasswordDto.email());
    }

    @GetMapping("/choose-password/{token}")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> getEmailForChoosePasswordToken(@PathVariable String token) {
        return authService.getEmailForChoosePasswordToken(token);
    }

    @PostMapping("/choose-password")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> choosePassword(@RequestBody ChoosePasswordDto choosePasswordDto) {
        return authService.choosePassword(choosePasswordDto.token(), choosePasswordDto.password());
    }

    @GetMapping("/info")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> getUserInfo() {
        var user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseHandler.generate("", HttpStatus.OK, user.getUserInfo());
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> changePassword(@RequestBody ChangePasswordDto changePasswordDto, HttpServletResponse response) {
        return authService.changePassword(changePasswordDto, response);
    }
}
