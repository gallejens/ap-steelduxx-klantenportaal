package com.ap.steelduxxklantenportaal.dtos;

import java.util.List;

import com.ap.steelduxxklantenportaal.enums.TransportTypeEnum;

public record OrderRequestDto(
                TransportTypeEnum transportType, String portOfOriginCode,
                String portOfDestinationCode, List<ProductDto> products) {
}
