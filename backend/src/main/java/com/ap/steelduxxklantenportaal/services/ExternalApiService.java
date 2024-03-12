package com.ap.steelduxxklantenportaal.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.ap.steelduxxklantenportaal.DTOs.ExternalApiAuthDto;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;

@Service
public class ExternalApiService {
    private final RestTemplate restTemplate;
    @Value("${external.api.base-url}")
    private String baseUrl;
    @Value("${external.api.group}")
    private String group;
    @Value("${external.api.key}")
    private String apiKey;

    public ExternalApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("group", group);
        body.put("apiKey", apiKey);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<ExternalApiAuthDto> response = restTemplate.postForEntity(baseUrl + "/authenticate/token",
                entity, ExternalApiAuthDto.class);

        return response.getBody().token();
    }

    public String getAllOrders() {
        String token = getToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(baseUrl + "/order/all", HttpMethod.GET, entity,
                String.class);

        System.out.println("getAllOrders response: " + response.getBody());
        return response.getBody();
    }

    public String getOrderDetail(Long orderId) {
        String token = getToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(baseUrl + "/order/" + orderId, HttpMethod.GET, entity,
                String.class);

        System.out.println("getOrderDetail response: " + response.getBody());
        return response.getBody();
    }
}
