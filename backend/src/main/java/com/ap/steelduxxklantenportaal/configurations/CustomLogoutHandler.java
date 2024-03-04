package com.ap.steelduxxklantenportaal.configurations;

import com.ap.steelduxxklantenportaal.services.AuthService;
import com.ap.steelduxxklantenportaal.utils.Cookies;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
public class CustomLogoutHandler implements LogoutHandler {

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
          Cookies.setCookie(response, AuthService.AUTH_TOKEN_COOKIE_NAME, null, 0);
    }
}
