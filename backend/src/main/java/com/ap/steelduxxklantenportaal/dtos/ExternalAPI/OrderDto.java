package com.ap.steelduxxklantenportaal.dtos.ExternalAPI;

import java.lang.reflect.Array;
import java.util.List;

import com.ap.steelduxxklantenportaal.enums.OrderStateEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;

public record OrderDto(
                String customerCode,
                String referenceNumber,
                String customerReferenceNumber,
                OrderStateEnum state,
                OrderTransportTypeEnum transportType,
                String portOfOriginCode,
                String portOfOriginName,
                String portOfDestinationCode,
                String portOfDestinationName,
                String shipName,
                String ets,
                String ats,
                String eta,
                String ata,
                long totalWeight,
<<<<<<< backend/src/main/java/com/ap/steelduxxklantenportaal/dtos/ExternalAPI/OrderDto.java
                long totalContainers,
                List<String> containerTypes) {
=======
                long totalContainers) {
>>>>>>> backend/src/main/java/com/ap/steelduxxklantenportaal/dtos/ExternalAPI/OrderDto.java
}
