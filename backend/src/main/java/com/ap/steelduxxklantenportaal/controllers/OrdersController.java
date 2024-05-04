package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.DocumentRequestDto;
import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import com.ap.steelduxxklantenportaal.services.OrdersService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;

import java.io.IOException;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.core.io.Resource;

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

    @GetMapping("/download-document")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Resource> downloadDocument(@RequestParam String endpoint) {
        try {
            byte[] data = externalApiService.downloadDocument(endpoint);
            String fileName = endpoint.substring(endpoint.lastIndexOf('/') + 1);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(new ByteArrayResource(data));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/upload-document/{referenceNumber}/{documentType}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> uploadDocument(@PathVariable String referenceNumber,
            @PathVariable String documentType, @RequestParam("file") MultipartFile file) {
        try {
            byte[] documentBytes = file.getBytes();
            DocumentRequestDto dto = new DocumentRequestDto(referenceNumber, documentType, documentBytes);
            boolean success = externalApiService.uploadDocument("/document/upload", dto);
            if (success) {
                return ResponseHandler.generate("Document uploaded successfully", HttpStatus.OK, null);
            } else {
                return ResponseHandler.generate("Failed to upload document", HttpStatus.BAD_REQUEST, null);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file upload");
        }
    }
}
