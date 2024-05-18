package com.ap.steelduxxklantenportaal.orderrequest;

import java.util.List;

import com.ap.steelduxxklantenportaal.dtos.orderrequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.orderrequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;
import com.ap.steelduxxklantenportaal.enums.TransportTypeEnum;
import com.ap.steelduxxklantenportaal.models.Company;

public class OrderRequestObjectMother {
        static final OrderRequestProductDto product1 = new OrderRequestProductDto("1234", "Steel pipes", 12, 123000,
                        "12345",
                        ContainerSizeEnum.SIZE_20, ContainerTypeEnum.OT);
        static final OrderRequestProductDto product2 = new OrderRequestProductDto("4321", "Steel pipes", 5, 1000,
                        "54321",
                        ContainerSizeEnum.SIZE_20, ContainerTypeEnum.OT);
        static final NewOrderRequestDto orderRequest1 = new NewOrderRequestDto(TransportTypeEnum.IMPORT, "NLROT",
                        "BEANR", true,
                        List.of(product1, product2));

        static final NewOrderRequestDto orderRequest2 = new NewOrderRequestDto(TransportTypeEnum.IMPORT, "NLROT",
                        "BEANR", true,
                        List.of());

        static final Company company1 = new Company("C123", null, null, null, null, null, null, null, null, null,
                        null);
}
