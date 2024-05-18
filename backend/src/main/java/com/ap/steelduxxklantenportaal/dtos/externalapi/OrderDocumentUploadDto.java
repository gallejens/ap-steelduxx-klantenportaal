package com.ap.steelduxxklantenportaal.dtos.externalapi;

import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;

public record OrderDocumentUploadDto(
        String referenceNumber,
        OrderDocumentType type,
        byte[] document) {
}