package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.externalapi.DocumentRequestDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDetailsDto;
import com.ap.steelduxxklantenportaal.dtos.externalapi.OrderDto;
import com.ap.steelduxxklantenportaal.enums.PermissionEnum;
import com.ap.steelduxxklantenportaal.models.User;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

@Service
public class OrdersService {

    private final ExternalApiService externalApiService;

    public OrdersService(ExternalApiService externalApiService) {
        this.externalApiService = externalApiService;
    }

    public OrderDto[] getAllOrders() {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return new OrderDto[0];

        boolean isAdmin = user.hasPermission(PermissionEnum.ADMIN);
        String endpoint = isAdmin ? "/admin/order/all" : "/order/all";

        return externalApiService.doRequest(endpoint, HttpMethod.GET, OrderDto[].class);
    }

    public OrderDetailsDto getOrderDetails(long orderId, String customerCode) {
        var user = AuthService.getCurrentUser();
        if (user == null)
            return null;

        // if user is admin and customercode was provided then use admin endpoint
        boolean isAdmin = user.hasPermission(PermissionEnum.ADMIN);
        String endpoint;
        if (isAdmin && customerCode != null) {
            endpoint = String.format("/admin/order/%s/%s", customerCode, orderId);
        } else {
            endpoint = String.format("/order/%s", orderId);
        }

        return externalApiService.doRequest(endpoint, HttpMethod.GET, OrderDetailsDto.class);
    }

    public boolean uploadDocument(DocumentRequestDto documentRequest, User user, String customerCode) {
        return externalApiService.uploadDocument(documentRequest, user, customerCode);
    }
}
