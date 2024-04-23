package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import com.ap.steelduxxklantenportaal.services.OrdersService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    private final OrdersService ordersService;
    private final ExternalApiService externalApiService;

    public OrdersController(OrdersService ordersService, ExternalApiService externalApiService) {
        this.ordersService = ordersService;
        this.externalApiService = externalApiService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> getAllOrders() {
        var orders = ordersService.getAllOrders();
        return ResponseHandler.generate("", HttpStatus.OK, orders);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> getOrderDetail(@PathVariable Long id,
            @RequestParam(required = false) String customerCode) {
        var orderDetails = ordersService.getOrderDetails(id, customerCode);
        return ResponseHandler.generate("", HttpStatus.OK, orderDetails);
    }

    @GetMapping("/download/{referenceNumber}/{documentType}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> downloadDocument(@PathVariable String referenceNumber,
            @PathVariable String documentType) {
        String endpoint = String.format("/document/download/%s/%s", referenceNumber, documentType);
        try {
            byte[] fileData = externalApiService.doRequest(endpoint, HttpMethod.GET, byte[].class);
            if (fileData == null) {
                return ResponseEntity.notFound().build();
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + documentType + "-" + referenceNumber + ".pdf\"");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf");

            return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to download file: " + e.getMessage());
        }
    }
}
