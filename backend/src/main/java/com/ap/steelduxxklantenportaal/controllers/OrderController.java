package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.OrderService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import com.ap.steelduxxklantenportaal.dtos.OrderRequestDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService ordersService;

    public OrderController(OrderService ordersService) {
        this.ordersService = ordersService;
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

    @PostMapping("/new")
    @PreAuthorize("hasAuthority('CREATE_NEW_ORDERS')")
    public ResponseEntity<Object> createOrderRequest(@RequestBody OrderRequestDto orderRequestDto) {
        return ordersService.createNewOrderRequest(orderRequestDto);
    }

}
