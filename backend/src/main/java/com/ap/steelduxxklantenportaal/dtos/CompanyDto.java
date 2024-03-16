package com.ap.steelduxxklantenportaal.dtos;

public record CompanyDto(Long id, String companyName, String country, String phoneNr, String vatNr,
        String postalCode,
        String district, String street, String streetNr, String boxNr, String extraInfo, String referenceCode) {
}
