package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.ExternalApiAuthDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestDto;
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
    private  String systemToken;

    public ExternalApiService(RestTemplate restTemplate, CompanyRepository companyRepository) {
        this.restTemplate = restTemplate;
        this.companyRepository = companyRepository;
        this.userTokens = new HashMap<>();
    }
    public String getSystemToken() {
        String existingSystemToken = systemToken;
        if(existingSystemToken != null){
            return existingSystemToken;
        }
        String referenceCode = "ADMIN";
        String token = requestToken(referenceCode);
        systemToken = token;
        return token;
    }

    public <T> T doSystemRequest(String endpoint, HttpMethod method, Class<T> responseType) {
        return internalSystemRequest(endpoint, method, responseType, false);
    }
    private <T> T internalSystemRequest(String endpoint, HttpMethod method, Class<T> responseType,
                                        boolean isRetry) {
        String token = getSystemToken();

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
            return internalSystemRequest(endpoint,method,responseType,true);
        }
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
        if (token == null) {
            return null;
        }

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

        var responseBody = response.getBody();
        if (responseBody == null) {
            return null;
        }

        return responseBody.token();
    }

    public <T> T doRequest(String endpoint, HttpMethod method, Class<T> responseType) {
        return doRequest(endpoint, method, null, responseType);
    }

    public <T> T doRequest(String endpoint, HttpMethod method, Object body, Class<T> responseType) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }

        var user = (User) auth.getPrincipal();
        if (user == null) {
            return null;
        }

        return internalRequest(user, endpoint, method, body, responseType, false);
    }

    private <T> T internalRequest(User user, String endpoint, HttpMethod method, Object body, Class<T> responseType,
            boolean isRetry) {
        String token = getToken(user);
        if (token == null)
            return null;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<T> response = restTemplate.exchange(baseUrl + endpoint, method, entity, responseType);
            return response.getBody();
        } catch (RestClientException e) {
            if (isRetry) {
                return null;
            }

            // if call is not a retry, remove existing token and retry;
            userTokens.remove(user.getId());
            return internalRequest(user, endpoint, method, body, responseType, true);
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
