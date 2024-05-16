package com.ap.steelduxxklantenportaal.dtos;

import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;
import org.springframework.web.multipart.MultipartFile;

public record OrderDocumentUploadDto(String orderId, MultipartFile file, OrderDocumentType type, String customerCode) {
}
