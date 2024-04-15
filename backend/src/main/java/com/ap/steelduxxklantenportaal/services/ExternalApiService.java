package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.OrderDto;
import com.ap.steelduxxklantenportaal.dtos.ExternalApiAuthDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExternalApiService {
    private final RestTemplate restTemplate;
    private final CompanyRepository companyRepository;
    @Value("${external.api.base-url}")
    private String baseUrl;
    private final HashMap<Long, String> userTokens;

    public ExternalApiService(RestTemplate restTemplate, CompanyRepository companyRepository) {
        this.restTemplate = restTemplate;
        this.companyRepository = companyRepository;
        this.userTokens = new HashMap<>();
    }

    private String getToken() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        var user = (User) auth.getPrincipal();
        if (user == null) {
            return null;
        }

        String existingToken = userTokens.get(user.getId());
        if (existingToken != null) {
            return existingToken;
        }

        // If user is admin, set ref to admin else get ref from company
        String referenceCode;
        if (user.hasPermission(PermissionEnum.EXTERNAL_API_ADMIN)) {
            referenceCode = "ADMIN";
        } else {
            var company = companyRepository.findByUserId(user.getId()).orElseThrow();
            referenceCode = company.getReferenceCode();
        }

        // Save requested token to userId
        String token = requestToken(referenceCode);
        userTokens.put(user.getId(), token);

        return token;
    }

    private String requestToken(String referenceCode) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("group", referenceCode);
        body.put("apiKey", String.format("SECRET-KEY-%s", referenceCode));

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<ExternalApiAuthDto> response = restTemplate.postForEntity(baseUrl + "/authenticate/token",
                entity, ExternalApiAuthDto.class);

        return response.getBody().token();
    }

    public <T> T doRequest(String endpoint, HttpMethod method, Class<T> responseType) {
        String token = getToken();
        if (token == null) return null;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<T> response = restTemplate.exchange(baseUrl + endpoint, method, entity, responseType);

        return response.getBody();
    }
}
