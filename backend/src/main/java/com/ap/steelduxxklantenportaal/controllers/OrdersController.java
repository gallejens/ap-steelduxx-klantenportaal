package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.OrderDetailsDto;
import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.OrderDto;
import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/orders")
public class OrdersController {

    private final ExternalApiService externalApiService;

    public OrdersController(ExternalApiService externalApiService) {
        this.externalApiService = externalApiService;
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllOrders() {
        var orders = externalApiService.doRequest("/order/all", HttpMethod.GET, OrderDto[].class);
        return ResponseHandler.generate("", HttpStatus.OK, orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOrderDetail(@PathVariable Long id) {
        var orderDetails = externalApiService.doRequest(String.format("/order/%s", id), HttpMethod.GET, OrderDetailsDto.class);
        System.out.println(orderDetails);
        return ResponseHandler.generate("", HttpStatus.OK, orderDetails);
    }
}
