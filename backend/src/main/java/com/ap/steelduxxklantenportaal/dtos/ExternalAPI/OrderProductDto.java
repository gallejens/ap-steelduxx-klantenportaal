package com.ap.steelduxxklantenportaal.dtos.ExternalAPI;

public record OrderProductDto(
        String hsCode,
        String name,
        long quantity,
        long weight,
        String containerNumber
) {
}
