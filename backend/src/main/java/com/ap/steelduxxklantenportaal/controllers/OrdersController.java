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

    @GetMapping("/download/{referenceNumber}/{docType}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<ByteArrayResource> downloadDocument(@PathVariable String referenceNumber,
            @PathVariable String docType) {
        String fileUrl = String.format("/document/download/%s/%s", referenceNumber, docType);
        try {
            byte[] data = externalApiService.fetchDocument(fileUrl);
            ByteArrayResource resource = new ByteArrayResource(data);
            String fileName = String.format("%s-%s.pdf", docType, referenceNumber);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentLength(data.length)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json")
                    .body(new ByteArrayResource(e.getMessage().getBytes()));
        }
    }
}
