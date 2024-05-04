package com.ap.steelduxxklantenportaal.dtos.ExternalAPI;

public record DocumentRequestDto(
        String referenceNumber,
        String type,
        byte[] document) {
}
