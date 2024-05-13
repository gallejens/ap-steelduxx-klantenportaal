package com.ap.steelduxxklantenportaal.dtos.OrderRequests;

import java.util.List;

public record OrderRequestDto(
          String companyName,
          String transportType,
          String portCode,
          String cargoType,
          List<OrderRequestProductDto> products) {
}
