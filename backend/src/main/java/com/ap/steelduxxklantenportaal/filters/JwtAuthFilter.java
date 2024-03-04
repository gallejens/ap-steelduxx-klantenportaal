package com.ap.steelduxxklantenportaal.filters;

import com.ap.steelduxxklantenportaal.services.AuthService;
import com.ap.steelduxxklantenportaal.services.JwtService;
import com.ap.steelduxxklantenportaal.services.UserDetailsServiceImp;
import com.ap.steelduxxklantenportaal.utils.Cookies;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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
        String accessToken = Cookies.getValue(request, AuthService.ACCESS_TOKEN_COOKIE_NAME);

        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtService.extractClaimFromAccessToken(accessToken, Claims::getSubject);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        if (username != null && securityContext.getAuthentication() == null && jwtService.isNonExpiredAccessToken(accessToken)) {
            var userDetails = userDetailsService.loadUserByUsername(username);
            var authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            var authDetails = new WebAuthenticationDetailsSource().buildDetails(request);
            authToken.setDetails(authDetails);
            securityContext.setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }


}
