package com.ap.steelduxxklantenportaal.dtos.orderrequests;

import java.util.List;

public record OrderRequestDto(
          String companyName,
          String transportType,
          String portOfOriginCode,
          String portOfDestinationCode,
          String cargoType,
          List<OrderRequestProductDto> products) {
}
