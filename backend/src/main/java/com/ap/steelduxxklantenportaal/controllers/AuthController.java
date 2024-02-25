package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.DTOs.LoginValuesDTO;
import com.ap.steelduxxklantenportaal.DTOs.AccountValuesDTO;
import com.ap.steelduxxklantenportaal.models.AccountValue;
import com.ap.steelduxxklantenportaal.repositories.AccountValueRepository;
import com.ap.steelduxxklantenportaal.services.AccountValueService;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AccountValueRepository accountValueRepository;

    @Autowired
    private AccountValueService accountValueService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/login")
    public boolean login(@RequestBody LoginValuesDTO loginValuesDTO) {
        System.out.println(loginValuesDTO);
        return true;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> saveRequest(@RequestBody AccountValuesDTO accountValuesDTO) {
        System.out.println(accountValuesDTO);
        if (accountValueRepository.findByVatNrAndEmail(accountValuesDTO.getVatNr(),
                accountValuesDTO.getEmail()).isPresent()) {

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("success", false);
            responseMap.put("message", "Account request already exists");
            return new ResponseEntity<>(responseMap, HttpStatus.OK);
        }

        AccountValue savedAccountValue = accountValueService.add(accountValuesDTO);
        return new ResponseEntity<>(savedAccountValue, HttpStatus.CREATED);
    }

    // @GetMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    // public Map<String, Object> getString() {

    // }

}
