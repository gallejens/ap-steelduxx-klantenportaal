package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
public class OrdersController {

    private final ExternalApiService externalApiService;

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
