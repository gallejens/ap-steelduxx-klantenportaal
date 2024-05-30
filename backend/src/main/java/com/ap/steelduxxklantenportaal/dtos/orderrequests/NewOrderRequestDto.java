package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;

import java.util.List;

public record NewOrderRequestDto(
                OrderTransportTypeEnum transportType,
                String portOfOriginCode,
                String portOfDestinationCode,
                boolean isContainerOrder,
                List<OrderRequestProductDto> products) {
}
