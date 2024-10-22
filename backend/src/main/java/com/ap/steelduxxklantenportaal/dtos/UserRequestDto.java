package com.ap.steelduxxklantenportaal.dtos;

import com.ap.steelduxxklantenportaal.enums.StatusEnum;

public record UserRequestDto(long followId, String companyName, String country, String phoneNr, String vatNr,
                String postalCode,
                String district, String street, String streetNr, String boxNr, String extraInfo, String firstName,
                String lastName, String email, long createdOn, StatusEnum status,
                String denyMessage) {

}
