package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.orderrequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestUploadDto;
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
    public List<OrderRequestListDto> getAllOrderRequests() {
        return orderRequestService.getAll();
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

}
