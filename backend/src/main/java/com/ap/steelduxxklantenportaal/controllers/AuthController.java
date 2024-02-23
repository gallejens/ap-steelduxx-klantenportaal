package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.LoginValuesDTO;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/login")
    public boolean login(@RequestBody LoginValuesDTO loginValuesDTO) {
        System.out.println(loginValuesDTO);
        return true;
    }

}
