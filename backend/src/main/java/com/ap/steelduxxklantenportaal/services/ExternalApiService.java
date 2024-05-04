package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.ExternalApiAuthDto;
import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.DocumentExistenceResponse;
import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.DocumentRequestDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.repositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
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

    private String getToken(User user) {
        String existingToken = userTokens.get(user.getId());
        if (existingToken != null) {
            return existingToken;
        }

        String referenceCode;
        if (user.hasPermission(PermissionEnum.ADMIN)) {
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
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        var user = (User) auth.getPrincipal();
        if (user == null) {
            return null;
        }

        return internalRequest(user, endpoint, method, responseType, false);
    }

    private <T> T internalRequest(User user, String endpoint, HttpMethod method, Class<T> responseType,
            boolean isRetry) {
        String token = getToken(user);
        if (token == null)
            return null;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<T> response = restTemplate.exchange(baseUrl + endpoint, method, entity, responseType);
            return response.getBody();
        } catch (RestClientException e) {
            if (isRetry) {
                return null;
            }

            // if call is not a retry, remove existing token and retry;
            userTokens.remove(user.getId());
            return internalRequest(user, endpoint, method, responseType, true);
        }
    }

    public byte[] downloadDocument(String endpoint) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RestClientException("Unauthorized access");
        }

        var user = (User) auth.getPrincipal();
        String token = getToken(user);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<byte[]> response = restTemplate.exchange(baseUrl + endpoint,
                HttpMethod.GET, entity,
                byte[].class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RestClientException("Failed to download document");
        }

        return response.getBody();
    }

    public boolean uploadDocument(String endpoint, DocumentRequestDto dto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(getToken(AuthService.getCurrentUser()));

        HttpEntity<DocumentRequestDto> entity = new HttpEntity<>(dto, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + endpoint, entity, String.class);
        return response.getStatusCode().is2xxSuccessful();
    }

    public boolean checkDocumentExistence(String referenceNumber, String documentType) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        var user = (User) auth.getPrincipal();
        if (user == null) {
            return false;
        }

        String token = getToken(user);
        if (token == null)
            return false;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String endpoint = String.format("/document/existence/%s/%s", referenceNumber, documentType);
        ResponseEntity<DocumentExistenceResponse> response = restTemplate.exchange(baseUrl + endpoint,
                HttpMethod.GET, entity, DocumentExistenceResponse.class);

        return response.getBody().exists();
    }
}
