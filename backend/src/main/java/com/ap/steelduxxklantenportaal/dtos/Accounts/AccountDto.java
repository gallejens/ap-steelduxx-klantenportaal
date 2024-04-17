package com.ap.steelduxxklantenportaal.dtos.Accounts;

import com.ap.steelduxxklantenportaal.enums.RoleEnum;

public record AccountDto(String email, String firstName, String lastName, String company, RoleEnum role) {
}
