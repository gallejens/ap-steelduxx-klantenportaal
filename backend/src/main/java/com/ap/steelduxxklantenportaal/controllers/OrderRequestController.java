package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.orderrequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestUploadDto;
import com.ap.steelduxxklantenportaal.services.OrderRequestService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

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
    public ResponseEntity<List<OrderRequestListDto>> getAllOrderRequests() {
        var orderRequests = orderRequestService.getAll();
        return ResponseEntity.ok(orderRequests);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('MANAGE_ORDER_REQUESTS')")
    public OrderRequestListDto getOrderRequestById(@PathVariable String id) {
        return orderRequestService.getOrderRequest(Long.parseLong(id));
    }

    @PostMapping("/upload-file")
    @PreAuthorize("hasAuthority('CREATE_NEW_ORDERS')")
    public ResponseEntity<Object> uploadOrderRequestFile(@ModelAttribute OrderRequestUploadDto orderRequestUploadDto) {
        orderRequestService.saveOrderRequestDocument(orderRequestUploadDto);
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
    public ResponseEntity<Object> editOrderRequest(@PathVariable Long id, @RequestBody OrderRequestDto orderRequestDto) {
        orderRequestService.editOrderRequest(id, orderRequestDto);
        return ResponseHandler.generate("orderRequestReviewPage:response:edited", HttpStatus.OK);

    }

    @PutMapping("/{id}/product/edit")
    public ResponseEntity<Object> editOrderRequestProduct(@PathVariable Long id, @RequestBody OrderRequestProductDto orderRequestProductDto) {
        orderRequestService.editOrderRequestProduct(id, orderRequestProductDto);
        return ResponseHandler.generate("orderRequestReviewPage:editProductModal:response:success", HttpStatus.OK);
    }

}
