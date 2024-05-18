package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.OrderDocumentUploadDto;
import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;
import com.ap.steelduxxklantenportaal.services.OrdersService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> getAllOrders() {
        var orders = ordersService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> getOrderDetail(@PathVariable String orderId,
                                                 @RequestParam(required = false) String customerCode) {
        var orderDetails = ordersService.getOrderDetails(orderId, customerCode);
        return ResponseEntity.ok(orderDetails);
    }

    @GetMapping("/document/download/{orderId}/{type}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> downloadDocument(@PathVariable String orderId,
                                                   @PathVariable OrderDocumentType type) {
        return ordersService.downloadDocument(orderId, type);
    }

    @PostMapping("/document/upload")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> uploadDocument(@ModelAttribute OrderDocumentUploadDto orderDocumentUploadDto) {
        var success = ordersService.uploadDocument(
                orderDocumentUploadDto.orderId(),
                orderDocumentUploadDto.file(),
                orderDocumentUploadDto.type(),
                orderDocumentUploadDto.customerCode()
        );
        if (!success) {
            return ResponseHandler.generate("failed", HttpStatus.NO_CONTENT);
        }
        return ResponseHandler.generate("success", HttpStatus.OK);
    }
}