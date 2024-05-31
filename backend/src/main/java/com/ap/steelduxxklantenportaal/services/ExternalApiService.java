package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.externalapi.ExternalApiTokenResponseDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.ExternalApiTokenRequestDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

@Service
public class ExternalApiService {
    private final RestTemplate restTemplate;
    private final CompanyRepository companyRepository;
    @Value("${external.api.base-url}")
    private String baseUrl;
    private final HashMap<String, String> tokens;

    public ExternalApiService(RestTemplate restTemplate, CompanyRepository companyRepository) {
        this.restTemplate = restTemplate;
        this.companyRepository = companyRepository;
        this.tokens = new HashMap<>();
    }

    private String getToken(String referenceCode) {
        String existingToken = tokens.get(referenceCode);
        if (existingToken != null) {
            return existingToken;
        }

        try {
            var body = new ExternalApiTokenRequestDto(referenceCode, String.format("SECRET-KEY-%s", referenceCode));
            var response = execute(null, "/authenticate/token", HttpMethod.POST, body, ExternalApiTokenResponseDto.class);

            var responseBody = response.getBody();
            if (responseBody == null) {
                return null;
            }

            var newToken = responseBody.token();
            tokens.put(referenceCode, newToken);

            return newToken;
        } catch (RestClientException e) {
            return null;
        }
    }

    public <T> T doRequest(String referenceCode, String endpoint, HttpMethod method, Class<T> responseType) {
        return internalRequest(referenceCode, endpoint, method, null, responseType, false);
    }

    public <T> T doRequest(String referenceCode, String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        return internalRequest(referenceCode, endpoint, method, body, responseType, false);
    }

    public <T> T doRequest(String endpoint, HttpMethod method, Class<T> responseType) {
        return doRequest(endpoint, method, null, responseType);
    }

    public <T> T doRequest(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        var user = AuthService.getCurrentUser();
        if (user == null) {
            return null;
        }

        var referenceCode = getReferenceCodeForUser(user);
        if (referenceCode == null) {
            return null;
        }

        return internalRequest(referenceCode, endpoint, method, body, responseType, false);
    }

    private <T> T internalRequest(String referenceCode, String endpoint, HttpMethod method, Object body, Class<T> responseType,
                                  boolean isRetry) {
        String token = getToken(referenceCode);
        if (token == null)
            return null;

        try {
            var response = execute(token, endpoint, method, body, responseType);
            return response.getBody();
        } catch (RestClientException e) {
            if (isRetry) {
                return null;
            }

            tokens.remove(referenceCode);
            return internalRequest(referenceCode, endpoint, method, body, responseType, true);
        }
    }

    private String getReferenceCodeForUser(User user) {
        if (user.hasPermission(PermissionEnum.ADMIN)) {
            return "ADMIN";
        }

        var company = companyRepository.findByUserId(user.getId()).orElse(null);
        if (company == null) {
            return null;
        }

        return company.getReferenceCode();
    }

    private <T> ResponseEntity<T> execute(String token, String endpoint, HttpMethod method, Object body, Class<T> responseType) throws RestClientException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (token != null) {
            headers.setBearerAuth(token);
        }
        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        return restTemplate.exchange(baseUrl + endpoint, method, entity, responseType);
    }
}
