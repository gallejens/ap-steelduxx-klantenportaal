package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;

public record OrderRequestProductEditDto(
        long quantity,
        long weight,
        String containerNumber,
        ContainerSizeEnum containerSize,
        ContainerTypeEnum containerType) {
}
