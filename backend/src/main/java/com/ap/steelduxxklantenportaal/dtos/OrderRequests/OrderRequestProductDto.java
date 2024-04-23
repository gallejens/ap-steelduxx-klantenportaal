package com.ap.steelduxxklantenportaal.dtos.OrderRequests;

import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;

public record OrderRequestProductDto(
        String hsCode,
        String name,
        long quantity,
        long weight,
        String containerNumber,
        ContainerSizeEnum containerSize,
        ContainerTypeEnum containerType
) {
}
