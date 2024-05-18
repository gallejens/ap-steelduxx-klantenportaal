package com.ap.steelduxxklantenportaal.dtos.externalapi;

public record DocumentRequestDto(
        String referenceNumber,
        String type,
        byte[] document) {
}
