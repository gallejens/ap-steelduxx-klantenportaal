package com.ap.steelduxxklantenportaal.dtos.externalapi;

import com.ap.steelduxxklantenportaal.enums.OrderStateEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;

public record OrderDetailsDto(
        String referenceNumber,
        String customerReferenceNumber,
        OrderStateEnum state,
        OrderTransportTypeEnum transportType,
        String portOfOriginCode,
        String portOfOriginName,
        String portOfDestinationCode,
        String portOfDestinationName,
        String shipName,
        String shipIMO,
        String shipMMSI,
        String shipType,
        String ets,
        String ats,
        String eta,
        String ata,
        String preCarriage,
        String estimatedTimeCargoOnQuay,
        String actualTimeCargoLoaded,
        String billOfLadingDownloadLink,
        String packingListDownloadLink,
        String customsDownloadLink,
        OrderProductDto[] products
) {
}
