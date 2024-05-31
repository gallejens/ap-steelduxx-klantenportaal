package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;

public record OrderRequestEditDto(
        OrderTransportTypeEnum transportType,
        String portOfOriginCode,
        String portOfDestinationCode
) {

}
