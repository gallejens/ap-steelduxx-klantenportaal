package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.OrderRequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestListDto;
import com.ap.steelduxxklantenportaal.enums.DocumentType;
import com.ap.steelduxxklantenportaal.services.OrderRequestService;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("order-requests")
public class OrderRequestController {
    private final OrderRequestService orderRequestService;

    public OrderRequestController(OrderRequestService orderRequestService){
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

    @PostMapping("/upload-files")
    @PreAuthorize("hasAuthority('CREATE_NEW_ORDERS')")
    public ResponseEntity<Object> uploadOrderRequestFiles(@RequestParam Map<DocumentType, MultipartFile> documents) {
        orderRequestService.saveOrderRequestDocuments(documents);
        return ResponseHandler.generate("", HttpStatus.OK);
    }

}
