package com.ap.steelduxxklantenportaal.orderrequest;

import com.ap.steelduxxklantenportaal.dtos.orderrequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;
import com.ap.steelduxxklantenportaal.models.Company;

import java.util.List;

public class OrderRequestObjectMother {
    static final OrderRequestProductDto product1 = new OrderRequestProductDto(1, "1234", "Steel pipes", 12, 123000,
            "12345",
            ContainerSizeEnum.SIZE_20, ContainerTypeEnum.OT);
    static final OrderRequestProductDto product2 = new OrderRequestProductDto(2, "4321", "Steel pipes", 5, 1000,
            "54321",
            ContainerSizeEnum.SIZE_20, ContainerTypeEnum.OT);
    static final NewOrderRequestDto orderRequest1 = new NewOrderRequestDto("test-order-request-1", OrderTransportTypeEnum.IMPORT, OrderTypeEnum.CONTAINER, "NLROT",
            "BEANR",
            List.of(product1, product2));

    static final NewOrderRequestDto orderRequest2 = new NewOrderRequestDto("test-order-request-2", OrderTransportTypeEnum.IMPORT, OrderTypeEnum.CONTAINER, "NLROT",
            "BEANR",
            List.of());

    static final Company company1 = new Company("C123", null, null, null, null, null, null, null, null, null,
            null);
}
