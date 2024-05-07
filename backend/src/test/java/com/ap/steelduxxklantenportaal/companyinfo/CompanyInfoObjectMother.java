package com.ap.steelduxxklantenportaal.companyinfo;

import com.ap.steelduxxklantenportaal.dtos.CompanyInfo.CreateSubAccountDto;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import com.ap.steelduxxklantenportaal.models.Company;
import com.ap.steelduxxklantenportaal.models.User;

import java.util.UUID;

public class CompanyInfoObjectMother {
    static final String headAdminEmail = "admin@test.com";
    static final String headNormalEmail = "normal@test.com";
    static final User headAdminUser = createNewUser(headAdminEmail, "HeadAdmin", "Test", RoleEnum.ROLE_HEAD_ADMIN);
    static final User headNormalUser = createNewUser(headNormalEmail, "HeadNormal", "Test", RoleEnum.ROLE_HEAD_USER);
    static final Company company = new Company(null, "", "", "", "", "", "", "", "", "", "", "");
    static final String createAdminSubAccountEmail = "newadmin@test.com";
    static final String createNormalSubAccountEmail = "newnormal@test.com";

    private static User createNewUser(String email, String firstName, String lastName, RoleEnum role) {
        var user = new User();
        user.setEmail(email);
        user.setPassword(UUID.randomUUID().toString());
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        return user;
    }

}
