package com.ap.steelduxxklantenportaal.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class ExternalApiService {
    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String group;
    private final String apiKey;

    public ExternalApiService(RestTemplate restTemplate,
            @Value("${external.api.base-url}") String baseUrl,
            @Value("${external.api.group}") String group,
            @Value("${external.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.group = group;
        this.apiKey = apiKey;
    }

    private String getToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("group", this.group);
        body.put("apiKey", this.apiKey);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + "/authenticate/token", entity,
                String.class);

        return response.getBody();
    }

    public String getAllOrders() {
        String token = getToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(baseUrl + "/order/all", HttpMethod.GET, entity,
                String.class);

        return response.getBody();
    }

    public String getOrderDetail(Long orderId) {
        String token = getToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(baseUrl + "/order/" + orderId, HttpMethod.GET, entity,
                String.class);

        return response.getBody();
    }
}
