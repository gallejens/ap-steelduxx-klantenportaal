package com.ap.steelduxxklantenportaal.dtos.externalapi;

import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;

import java.util.List;

public record ExternalApiOrderRequestDto(
        String customerReferenceNumber,
        OrderTransportTypeEnum transportType,
        String portCode,
        OrderTypeEnum cargoType,
        List<OrderRequestProductDto> products
) {
}
