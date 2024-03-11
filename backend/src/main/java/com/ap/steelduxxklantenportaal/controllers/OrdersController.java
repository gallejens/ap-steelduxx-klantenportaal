package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.ExternalApiService;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/orders")
public class OrdersController {

    private final ExternalApiService externalApiService;

    @Autowired
    public OrdersController(ExternalApiService externalApiService) {
        this.externalApiService = externalApiService;
    }

    @GetMapping("/all")
    public ResponseEntity<String> getAllOrders() {
        try {
            String orders = externalApiService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch orders");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> getOrderDetail(@PathVariable Long id) {
        try {
            String orderDetail = externalApiService.getOrderDetail(id);
            return ResponseEntity.ok(orderDetail);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to fetch order detail");
        }
    }
}
