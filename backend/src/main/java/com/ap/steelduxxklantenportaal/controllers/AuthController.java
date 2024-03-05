package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.SignInRequestDTO;
import com.ap.steelduxxklantenportaal.services.AuthService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> signOut(HttpServletResponse response) {
        authService.signOut(response);
        return ResponseHandler.generate("logout_successful", HttpStatus.OK);
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
        return ResponseHandler.generate("success", HttpStatus.OK);
    }

    @GetMapping("/testprivate")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> testprivate() {
        System.out.println("Private endpoint called");
        return ResponseHandler.generate("success", HttpStatus.OK);
    }
}
