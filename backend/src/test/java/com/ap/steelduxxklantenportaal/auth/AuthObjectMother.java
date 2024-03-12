package com.ap.steelduxxklantenportaal.auth;

public class AuthObjectMother {

    static final String validUserEmail = "test@test.com";
    static final String validUserPassword = "test";
    static final String invalidUserEmail = "invalid@test.com";
    static final String invalidUserPassword = "invalid";

    static final String validSignInBody = String.format("{\"email\":\"%s\",\"password\":\"%s\" }", validUserEmail, validUserPassword);
    static final String invalidSignInBody = String.format("{\"email\":\"%s\",\"password\":\"%s\" }", invalidUserEmail, invalidUserPassword);

}
