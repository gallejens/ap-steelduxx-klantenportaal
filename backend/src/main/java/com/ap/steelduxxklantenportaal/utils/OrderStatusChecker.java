package com.ap.steelduxxklantenportaal.utils;

import com.ap.steelduxxklantenportaal.services.OrdersService;

import jakarta.annotation.PostConstruct;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrderStatusChecker {
    private final OrdersService ordersService;

    public OrderStatusChecker(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    @PostConstruct
    public void init() {
        checkAllOrderStatus();
    }

    @Scheduled(fixedRate = 60000 * 5)
    public void checkAllOrderStatus() {
        var orders = ordersService.getAllOrdersForCheck();
        if (orders != null) {
            ordersService.checkForOrderStatusChanges(orders);
        }
    }
}
