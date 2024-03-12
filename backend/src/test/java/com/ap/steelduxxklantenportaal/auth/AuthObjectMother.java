package com.ap.steelduxxklantenportaal.auth;

public class AuthObjectMother {

    static String validUserEmail = "test@test.com";
    static String validUserPassword = "test";
    static String invalidUserEmail = "invalid@test.com";
    static String invalidUserPassword = "invalid";

    static String validSignInBody = String.format("{\"email\":\"%s\",\"password\":\"%s\" }", validUserEmail, validUserPassword);
    static String invalidSignInBody = String.format("{\"email\":\"%s\",\"password\":\"%s\" }", invalidUserEmail, invalidUserPassword);

}
