package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import java.util.List;

public record OrderRequestDto(
          String companyName,
          String transportType,
          String portCode,
          String cargoType,
          List<OrderRequestProductDto> products) {
}
