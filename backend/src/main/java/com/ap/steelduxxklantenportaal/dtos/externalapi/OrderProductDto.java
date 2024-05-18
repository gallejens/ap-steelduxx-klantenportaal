package com.ap.steelduxxklantenportaal.dtos.externalapi;

public record OrderProductDto(
                String hsCode,
                String name,
                long quantity,
                long weight,
                String containerNumber,
                String containerSize,
                String containerType) {
}
