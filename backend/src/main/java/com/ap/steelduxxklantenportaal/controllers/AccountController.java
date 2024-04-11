package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.AccountService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ap.steelduxxklantenportaal.dtos.Accounts.AccountDto;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('VIEW_ACCOUNTS')")
    public ResponseEntity<Object> getAllAccounts() {
        List<AccountDto> accounts = accountService.getAllAccounts();
        return ResponseHandler.generate("", HttpStatus.OK, accounts);
    }
}
