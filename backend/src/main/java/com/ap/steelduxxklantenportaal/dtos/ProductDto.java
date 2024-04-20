package com.ap.steelduxxklantenportaal.dtos;

import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;

public record ProductDto(String hsCode, String item, String quantity, String weight, String containerNr,
        ContainerSizeEnum containerSize, ContainerTypeEnum containerType) {
}
