package com.ap.steelduxxklantenportaal.dtos.OrderRequests;

import java.util.List;

import com.ap.steelduxxklantenportaal.enums.TransportTypeEnum;

public record NewOrderRequestDto(
        TransportTypeEnum transportType,
        String portOfOriginCode,
        String portOfDestinationCode,
        List<OrderRequestProductDto> products
) {
}
