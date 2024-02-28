package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.SignInRequestDTO;
import com.ap.steelduxxklantenportaal.services.AuthService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<Object> signIn(@RequestBody SignInRequestDTO signInRequestDTO) {
        authService.signIn(signInRequestDTO);
        return ResponseHandler.generateResponse("login_accepted", HttpStatus.ACCEPTED, null);
    }
}
