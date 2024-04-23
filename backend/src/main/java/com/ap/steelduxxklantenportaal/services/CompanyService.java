package com.ap.steelduxxklantenportaal.services;

import org.springframework.stereotype.Service;

import com.ap.steelduxxklantenportaal.dtos.CompanyDto;
import com.ap.steelduxxklantenportaal.models.Company;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public CompanyDto convertCompanyToDTO(Company company) {
        return new CompanyDto(
                company.getCompanyName(),
                company.getCountry(),
                company.getPhoneNr(),
                company.getVatNr(),
                company.getPostalCode(),
                company.getDistrict(),
                company.getStreet(),
                company.getStreetNr(),
                company.getBoxNr(),
                company.getExtraInfo(),
                company.getReferenceCode());
    }

    public CompanyDto getCompanyByUserId(CompanyDto companyDto, Long userId) {
        Company company = companyRepository.findByUserId(userId).orElseThrow();
        return convertCompanyToDTO(company);
    }

}
