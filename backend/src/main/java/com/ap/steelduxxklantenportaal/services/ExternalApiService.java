package com.ap.steelduxxklantenportaal.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class ExternalApiService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://sw11-1.devops-ap.be";
    private final String group = "SOF3";
    private final String apiKey = "SECRET-KEY-SOF3";

    public String getToken() {
        System.out.println(
                "Attempting to get token with baseUrl: " + baseUrl + ", group: " + group + ", apiKey: " + apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("group", group);
        body.put("apiKey", apiKey);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(baseUrl + "/authenticate/token", entity,
                String.class);

        System.out.println("Token retrieval response: " + response.getBody());
        return response.getBody();
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
