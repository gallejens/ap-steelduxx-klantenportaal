package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import java.util.List;

import com.ap.steelduxxklantenportaal.enums.TransportTypeEnum;

public record NewOrderRequestDto(
                TransportTypeEnum transportType,
                String portOfOriginCode,
                String portOfDestinationCode,
                boolean isContainerOrder,
                List<OrderRequestProductDto> products) {
}
