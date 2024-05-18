package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.companyinfo.ChangeCompanyHeadAccountDto;
import com.ap.steelduxxklantenportaal.dtos.companyinfo.CreateSubAccountDto;
import com.ap.steelduxxklantenportaal.dtos.companyinfo.DeleteCompanyDto;
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

    @DeleteMapping("/delete-user")
    @PreAuthorize("hasAnyAuthority('DELETE_USER_ACCOUNTS', 'DELETE_ADMIN_ACCOUNTS')")
    public ResponseEntity<Object> deleteAccount(@RequestBody DeleteAccountDto deleteAccountDto) {
        return companyInfoService.deleteSubAccount(deleteAccountDto.email());
    }

    @PostMapping("/change-head")
    @PreAuthorize("hasAuthority('CHANGE_COMPANY_HEAD_ACCOUNT')")
    public ResponseEntity<Object> changeCompanyHeadAccount(@RequestBody ChangeCompanyHeadAccountDto changeCompanyHeadAccountDto) {
        return companyInfoService.changeCompanyHeadAccount(changeCompanyHeadAccountDto);
    }

    @DeleteMapping("/delete-company")
    @PreAuthorize("hasAuthority('DELETE_COMPANY')")
    public ResponseEntity<Object> deleteCompany(@RequestBody DeleteCompanyDto deleteCompanyDto) {
        return companyInfoService.deleteCompany(deleteCompanyDto.companyId());
    }
}
