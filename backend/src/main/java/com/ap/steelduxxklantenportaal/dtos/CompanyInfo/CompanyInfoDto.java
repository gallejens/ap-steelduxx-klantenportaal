package com.ap.steelduxxklantenportaal.dtos.CompanyInfo;

import com.ap.steelduxxklantenportaal.models.Company;
import com.ap.steelduxxklantenportaal.models.CompanyInfoAccount;

import java.util.List;

public record CompanyInfoDto(
        Company company,
        List<CompanyInfoAccount> accounts
) {
}
