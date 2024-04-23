package com.ap.steelduxxklantenportaal.dtos.OrderRequests;

import com.ap.steelduxxklantenportaal.enums.DocumentType;
import org.springframework.web.multipart.MultipartFile;

public record OrderRequestUploadDto(Long orderRequestId, MultipartFile file, DocumentType type) {
}
