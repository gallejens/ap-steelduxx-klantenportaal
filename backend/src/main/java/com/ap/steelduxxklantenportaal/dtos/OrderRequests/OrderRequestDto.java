package com.ap.steelduxxklantenportaal.dtos.OrderRequests;

import java.util.List;

public record OrderRequestDto(
     String customerReferenceNumber,
     String transportType,
     String portCode,
     String cargoType,
     List<OrderRequestProductDto> products
) {
} 
    
