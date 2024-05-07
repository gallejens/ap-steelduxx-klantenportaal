package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.CompanyInfo.CreateSubAccountDto;
import com.ap.steelduxxklantenportaal.dtos.DeleteAccountDto;
import com.ap.steelduxxklantenportaal.services.CompanyInfoService;
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
        return ResponseEntity.ok(companyInfoList);
    }

    @PostMapping("/new")
    @PreAuthorize("hasAnyAuthority('CREATE_USER_ACCOUNTS', 'CREATE_ADMIN_ACCOUNTS')")
    public ResponseEntity<Object> createSubAccount(@RequestBody CreateSubAccountDto createSubaccountDto) {
        return companyInfoService.createSubAccount(createSubaccountDto);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAnyAuthority('DELETE_USER_ACCOUNTS', 'DELETE_ADMIN_ACCOUNTS')")
    public ResponseEntity<Object> deleteAccount(@RequestBody DeleteAccountDto deleteAccountDto) {
        return companyInfoService.deleteSubAccount(deleteAccountDto.email());
    }
}
