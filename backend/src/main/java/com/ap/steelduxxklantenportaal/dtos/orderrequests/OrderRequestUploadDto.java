package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import com.ap.steelduxxklantenportaal.enums.DocumentType;
import org.springframework.web.multipart.MultipartFile;

public record OrderRequestUploadDto(Long orderRequestId, MultipartFile file, DocumentType type) {
}
