package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import java.util.List;

import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;

public record NewOrderRequestDto(
                OrderTransportTypeEnum transportType,
                String portOfOriginCode,
                String portOfDestinationCode,
                boolean isContainerOrder,
                List<OrderRequestProductDto> products) {
}
