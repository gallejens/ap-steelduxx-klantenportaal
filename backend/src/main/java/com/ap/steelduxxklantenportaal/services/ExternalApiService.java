package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.ExternalApiAuthDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.DocumentRequestDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
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

    public byte[] downloadDocument(String referenceNumber, String documentType, User user) {
        String token = getToken(user);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        String downloadUrl = String.format(baseUrl + "/document/download/%s/%s", referenceNumber, documentType);

        ResponseEntity<byte[]> response = restTemplate.exchange(downloadUrl, HttpMethod.GET, entity, byte[].class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        } else {
            throw new RestClientException("Failed to download document");
        }
    }

    public boolean uploadDocument(DocumentRequestDto documentRequest, User user, String customerCode) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(getToken(user));

        String uploadUrl = determineUploadEndpoint(user, documentRequest, customerCode);

        HttpEntity<DocumentRequestDto> entity = new HttpEntity<>(documentRequest, headers);
        ResponseEntity<Void> response = restTemplate.postForEntity(uploadUrl, entity, Void.class);

        return response.getStatusCode().is2xxSuccessful();
    }

    private String determineUploadEndpoint(User user, DocumentRequestDto documentRequest, String customerCode) {
        RoleEnum role = user.getRole();
        if (role == RoleEnum.ROLE_ADMIN || role == RoleEnum.ROLE_HEAD_ADMIN) {
            if (customerCode == null || customerCode.isEmpty()) {
                throw new IllegalArgumentException("Customer code is required for admin upload.");
            }
            return baseUrl + "/admin/upload/" + customerCode;
        } else {
            return baseUrl + "/document/upload";
        }
    }



    public void createOrder(OrderRequestDto orderDto) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RestClientException("Unauthorized access");
        }

        var user = (User) auth.getPrincipal();
        if (user == null) {
            throw new RestClientException("User not found");
        }

        String token = getToken(user);
        if (token == null) {
            throw new RestClientException("Failed to get token");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<OrderRequestDto> entity = new HttpEntity<>(orderDto, headers);

        try {
            ResponseEntity<Void> response = restTemplate.postForEntity(baseUrl + "/order/new", entity, Void.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RestClientException("Failed to create order");
            }
        } catch (RestClientException e) {
            throw new RestClientException("Failed to create order: " + e.getMessage());
        }
    }
}
