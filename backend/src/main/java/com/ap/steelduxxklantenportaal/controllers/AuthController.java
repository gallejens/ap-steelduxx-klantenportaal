package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.SignInRequestDTO;
import com.ap.steelduxxklantenportaal.services.AuthService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> signIn(@RequestBody SignInRequestDTO signInRequestDTO, HttpServletResponse response) {
        String jwt = authService.signIn(signInRequestDTO);

        System.out.println(jwt);
        if (jwt == null) {
            return ResponseHandler.generateResponse("login_denied", HttpStatus.UNAUTHORIZED, null);
        }

        ResponseCookie cookie = ResponseCookie.from("auth-token", jwt).httpOnly(true).secure(false).path("/").maxAge(24 * 60 * 60).build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseHandler.generateResponse("login_accepted", HttpStatus.ACCEPTED, jwt);
    }

    @GetMapping("/testpublic")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> testpublic() {
        System.out.println("Public endpoint called");
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getDetails());
        return ResponseHandler.generateResponse("success", HttpStatus.ACCEPTED, null);
    }

    @GetMapping("/testprivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> testprivate() {
        System.out.println("Private endpoint called");
        return ResponseHandler.generateResponse("success", HttpStatus.ACCEPTED, null);
    }
}
