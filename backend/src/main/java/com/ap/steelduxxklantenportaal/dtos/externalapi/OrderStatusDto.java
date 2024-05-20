package com.ap.steelduxxklantenportaal.dtos.externalapi;


import com.ap.steelduxxklantenportaal.enums.OrderStateEnum;

public record OrderStatusDto(
        String customerCode,
        String referenceNumber,
        OrderStateEnum state
) {
}

