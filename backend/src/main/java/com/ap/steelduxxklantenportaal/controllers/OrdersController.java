package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.ExternalAPI.DocumentRequestDto;
import com.ap.steelduxxklantenportaal.models.User;
import com.ap.steelduxxklantenportaal.services.ExternalApiService;
import com.ap.steelduxxklantenportaal.services.OrdersService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @GetMapping("/download-document/{referenceNumber}/{documentType}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Resource> downloadDocument(@PathVariable String referenceNumber,
            @PathVariable String documentType) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            byte[] data = externalApiService.downloadDocument(referenceNumber, documentType, user);
            String fileName = referenceNumber + "-" + documentType + ".pdf";
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(new ByteArrayResource(data));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource(new byte[] {}));
        }
    }

    @PostMapping("/upload-document")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> uploadDocument(@RequestParam("file") MultipartFile file,
            @RequestParam("referenceNumber") String referenceNumber,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "customerCode", required = false) String customerCode) {
        if (file.isEmpty() || referenceNumber.isBlank() || documentType.isBlank()) {
            return ResponseHandler.generate("Invalid request parameters", HttpStatus.BAD_REQUEST, null);
        }

        try {
            byte[] fileContent = file.getBytes();
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            DocumentRequestDto documentRequestDto = new DocumentRequestDto(referenceNumber, documentType, fileContent);
            boolean isUploaded = ordersService.uploadDocument(documentRequestDto, user, customerCode);
            if (isUploaded) {
                return ResponseHandler.generate("File uploaded successfully", HttpStatus.OK, null);
            } else {
                return ResponseHandler.generate("Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR, null);
            }
        } catch (Exception ex) {
            return ResponseHandler.generate("Error processing file", HttpStatus.INTERNAL_SERVER_ERROR, null);
        }
    }

}
