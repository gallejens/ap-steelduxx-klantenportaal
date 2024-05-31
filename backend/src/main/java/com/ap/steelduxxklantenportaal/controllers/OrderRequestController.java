package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.orderrequests.*;
import com.ap.steelduxxklantenportaal.services.OrderRequestService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("order-requests")
public class OrderRequestController {
    private final OrderRequestService orderRequestService;

    public OrderRequestController(OrderRequestService orderRequestService) {
        this.orderRequestService = orderRequestService;
    }

    @PostMapping("/new")
    @PreAuthorize("hasAuthority('CREATE_NEW_ORDERS')")
    public ResponseEntity<Object> createOrderRequest(@RequestBody NewOrderRequestDto newOrderRequestDto) {
        return orderRequestService.createNewOrderRequest(newOrderRequestDto);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('MANAGE_ORDER_REQUESTS')")
    @ResponseStatus(HttpStatus.OK)
    public List<OrderRequestDto> getAllOrderRequests() {
        return orderRequestService.getAll();
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('MANAGE_ORDER_REQUESTS')")
    @ResponseStatus(HttpStatus.OK)
    public OrderRequestDto getOrderRequestById(@PathVariable Long id) {
        return orderRequestService.getOrderRequest(id);
    }

    @PostMapping("/upload-file")
    @PreAuthorize("hasAuthority('CREATE_NEW_ORDERS')")
    public ResponseEntity<Object> uploadOrderRequestFile(@ModelAttribute OrderRequestDocumentUploadDto orderRequestDocumentUploadDto) {
        orderRequestService.saveOrderRequestDocument(orderRequestDocumentUploadDto);
        return ResponseHandler.generate("", HttpStatus.OK);
    }

    @PostMapping("/{id}/deny")
    @PreAuthorize("hasAuthority('MANAGE_ORDER_REQUESTS')")
    public ResponseEntity<Object> denyOrderRequest(@PathVariable Long id) {
        return orderRequestService.denyOrderRequest(id);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('MANAGE_ORDER_REQUESTS')")
    public ResponseEntity<Object> approveOrderRequest(@PathVariable Long id) {
        return orderRequestService.approveOrderRequest(id);
    }

    @PutMapping("/{id}/edit")
    @PreAuthorize("hasAuthority('MANAGE_ORDER_REQUESTS')")
    public ResponseEntity<Object> editOrderRequest(@PathVariable Long id, @RequestBody OrderRequestEditDto orderRequestEditDto) {
        orderRequestService.editOrderRequest(id, orderRequestEditDto);
        return ResponseHandler.generate("orderRequestReviewPage:response:edited", HttpStatus.OK);

    }

    @PutMapping("/{id}/product/edit")
    @PreAuthorize("hasAuthority('MANAGE_ORDER_REQUESTS')")
    public ResponseEntity<Object> editOrderRequestProduct(@PathVariable Long id, @RequestBody OrderRequestProductEditDto orderRequestProductEditDto) {
        orderRequestService.editOrderRequestProduct(id, orderRequestProductEditDto);
        return ResponseHandler.generate("orderRequestReviewPage:editProductModal:response:success", HttpStatus.OK);
    }
}
