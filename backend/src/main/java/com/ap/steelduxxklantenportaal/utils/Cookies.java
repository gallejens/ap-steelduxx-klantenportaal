package com.ap.steelduxxklantenportaal.utils;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

public class Cookies {
    public static void setCookie(HttpServletResponse response, String name, String value, long maxAge) {
        ResponseCookie authTokenCookie = ResponseCookie
                .from(name, value)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, authTokenCookie.toString());
    }
}
