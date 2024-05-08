package com.ap.steelduxxklantenportaal.utils;

import com.ap.steelduxxklantenportaal.services.OrdersService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrderStatusChecker {
    private final OrdersService ordersService;

    public OrderStatusChecker(OrdersService ordersService) {
        this.ordersService = ordersService;
    }
    @Scheduled(fixedRate = 50000)

    public void checkAllOrderStatus(){
        var orders = ordersService.getAllOrdersForCheck();
        System.out.println(orders.length);
        ordersService.checkForOrderStatusChanges(orders);
    }
}
