package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.SignInRequestDTO;
import com.ap.steelduxxklantenportaal.annotations.IsLoggedIn;
import com.ap.steelduxxklantenportaal.services.AuthService;
import com.ap.steelduxxklantenportaal.utils.Cookies;
import com.ap.steelduxxklantenportaal.utils.Utils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        return authService.signIn(signInRequestDTO, response);
    }

    @PostMapping("/signout")
    @IsLoggedIn
    public ResponseEntity<Object> signOut(HttpServletResponse response) {
        authService.signOut(response);
        return Utils.generateResponse("logout_successful", HttpStatus.OK);
    }

    @PostMapping("/refresh")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> refresh(HttpServletRequest request, HttpServletResponse response) {
        return authService.refresh(request, response);
    }

    @GetMapping("/testpublic")
    @PreAuthorize("permitAll")
    public ResponseEntity<Object> testpublic() {
        System.out.println("Public endpoint called");
        return Utils.generateResponse("success", HttpStatus.ACCEPTED);
    }

    @GetMapping("/testprivate")
    @IsLoggedIn
    public ResponseEntity<Object> testprivate() {
        System.out.println("Private endpoint called");
        return Utils.generateResponse("success", HttpStatus.ACCEPTED);
    }
}
