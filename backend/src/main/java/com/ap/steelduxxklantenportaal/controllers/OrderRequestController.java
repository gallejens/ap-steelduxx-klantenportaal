package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.dtos.OrderRequestDto;
import com.ap.steelduxxklantenportaal.services.OrderRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("order-request")
public class OrderRequestController {
    private final OrderRequestService orderRequestService;

    public OrderRequestController(OrderRequestService orderRequestService){
        this.orderRequestService = orderRequestService;
    }

    @PostMapping("/all")
    @PreAuthorize("hasAnyAuthority('MANAGE_ORDER_REQUEST')")
    public List<OrderRequestDto> getAllOrderRequests(){return orderRequestService.getAll();}

}
