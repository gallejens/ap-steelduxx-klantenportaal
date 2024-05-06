package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.Accounts.CreateSubaccountDto;
import com.ap.steelduxxklantenportaal.services.CompanyInfoService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/company-info")
public class CompanyInfoController {
    private final CompanyInfoService companyInfoService;

    public CompanyInfoController(CompanyInfoService companyInfoService) {
        this.companyInfoService = companyInfoService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('VIEW_COMPANIES')")
    public ResponseEntity<Object> getAllAccounts() {
        var companyInfoList = companyInfoService.getAll();
        return ResponseHandler.generate("", HttpStatus.OK, companyInfoList);
    }

    @PostMapping("/new")
    @PreAuthorize("hasAnyAuthority('CREATE_USER_ACCOUNTS', 'CREATE_ADMIN_ACCOUNTS')")
    public ResponseEntity<Object> createSubAccount(@RequestBody CreateSubaccountDto createSubaccountDto) {
        return companyInfoService.createSubaccount(createSubaccountDto);
    }
}
