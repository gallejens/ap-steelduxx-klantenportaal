package com.ap.steelduxxklantenportaal.dtos;

import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;

public record ProductDto(String hsCode, String name, long quantity, long weight, String containerNumber,
        ContainerSizeEnum containerSize, ContainerTypeEnum containerType) {
}
