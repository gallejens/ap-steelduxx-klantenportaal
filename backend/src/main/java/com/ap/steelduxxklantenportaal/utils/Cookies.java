package com.ap.steelduxxklantenportaal.utils;

import com.ap.steelduxxklantenportaal.services.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

public class Cookies {
    public static void setCookie(HttpServletResponse response, String name, String value, long maxAge, String path) {
        ResponseCookie authTokenCookie = ResponseCookie
                .from(name, value)
                .httpOnly(true)
                .secure(true)
                .path(path)
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, authTokenCookie.toString());
    }

    public static void setCookie(HttpServletResponse response, String name, String value, long maxAge) {
        setCookie(response, name, value, maxAge, "/");
    }

    public static String getValue(HttpServletRequest request, String cookieName) {
        var cookies = request.getCookies();
        if (cookies == null) return null;

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(cookieName)) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
