package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.LoginValuesDTO;
import com.ap.steelduxxklantenportaal.DTOs.AccountValuesDTO;
import com.ap.steelduxxklantenportaal.models.AccountValue;
import com.ap.steelduxxklantenportaal.repositories.AccountValueRepository;
import com.ap.steelduxxklantenportaal.services.AccountValueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AccountValueService accountValueService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/login")
    public boolean login(@RequestBody LoginValuesDTO loginValuesDTO) {
        System.out.println(loginValuesDTO);
        return true;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public AccountValue saveRequest(@RequestBody AccountValuesDTO accountValuesDTO) {
        System.out.println(accountValuesDTO);

        return accountValueService.add(accountValuesDTO);
    }
}
