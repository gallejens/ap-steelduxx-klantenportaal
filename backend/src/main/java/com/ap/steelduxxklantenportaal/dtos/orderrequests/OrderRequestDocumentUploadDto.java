package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;
import org.springframework.web.multipart.MultipartFile;

public record OrderRequestDocumentUploadDto(Long orderRequestId, MultipartFile file, OrderDocumentType type) {
}
