package com.ap.steelduxxklantenportaal.dtos.OrderRequests;

import java.util.List;

import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.enums.TransportTypeEnum;

public record OrderRequestListDto(
        Long id,
        String customerCode,
        StatusEnum status,
        OrderTypeEnum orderType,
        TransportTypeEnum transportType,
        String portOfOriginCode,
        String portOfDestinationCode,
        List<OrderRequestProductDto> product) {

}
