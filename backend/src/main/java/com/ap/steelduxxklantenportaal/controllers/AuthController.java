package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.LoginValuesDTO;
import com.ap.steelduxxklantenportaal.repositories.UserRequestValueRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserRequestValueRepository accountValueRepository;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/login")
    public boolean login(@RequestBody LoginValuesDTO loginValuesDTO) {
        System.out.println(loginValuesDTO);
        return true;
    }
}
