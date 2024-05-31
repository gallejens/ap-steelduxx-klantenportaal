package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;

import java.util.List;

public record NewOrderRequestDto(
        String customerReferenceNumber,
        OrderTransportTypeEnum transportType,
        OrderTypeEnum orderType,
        String portOfOriginCode,
        String portOfDestinationCode,
        List<OrderRequestProductDto> products) {
}
