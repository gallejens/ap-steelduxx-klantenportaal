package com.ap.steelduxxklantenportaal.filters;

import com.ap.steelduxxklantenportaal.services.JwtService;
import com.ap.steelduxxklantenportaal.services.UserDetailsServiceImp;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsServiceImp userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String cookieToken = null;
        var cookies = request.getHeader("Cookie");
        System.out.println(cookies);
        if (cookies != null ) {
//            for (Cookie cookie : cookies) {
//                System.out.println("Cookiename: " + cookie.getName());
//                if (cookie.getName().equals("auth-token")) {
//                    cookieToken = cookie.getName();
//                }
//            }
        }

        if (cookieToken != null) {
            System.out.println("Authtoken in cookie: " + cookieToken);

        }

        if (cookieToken == null || !cookieToken.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = cookieToken.substring(7);
        String username = jwtService.extractClaim(token, Claims::getSubject);

        SecurityContext securityContext = SecurityContextHolder.getContext();
        if (username != null && securityContext.getAuthentication() == null) {
            var userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isValid(token, userDetails)) {
                var authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                var authDetails = new WebAuthenticationDetailsSource().buildDetails(request);
                authToken.setDetails(authDetails);
                securityContext.setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
