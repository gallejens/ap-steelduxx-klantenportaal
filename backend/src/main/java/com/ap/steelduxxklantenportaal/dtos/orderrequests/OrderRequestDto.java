package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import java.util.List;

import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;

public record OrderRequestDto(
        Long id,
        String companyName,
        StatusEnum status,
        OrderTypeEnum orderType,
        OrderTransportTypeEnum transportType,
        String portOfOriginCode,
        String portOfDestinationCode,
        List<OrderRequestProductDto> products) {

}
