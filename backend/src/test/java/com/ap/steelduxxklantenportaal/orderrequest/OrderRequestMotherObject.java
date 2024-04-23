package com.ap.steelduxxklantenportaal.orderrequest;

import java.util.List;

import com.ap.steelduxxklantenportaal.dtos.OrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.ProductDto;
import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;
import com.ap.steelduxxklantenportaal.enums.TransportTypeEnum;

public class OrderRequestMotherObject {
        static final ProductDto product1 = new ProductDto("1234", "Steel pipes", 12, 123000, "12345",
                        ContainerSizeEnum.SIZE_20, ContainerTypeEnum.OT);
        static final ProductDto product2 = new ProductDto("4321", "Steel pipes", 5, 1000, "54321",
                        ContainerSizeEnum.SIZE_20, ContainerTypeEnum.OT);
        static final OrderRequestDto orderRequest1 = new OrderRequestDto(TransportTypeEnum.IMPORT, "NLROT", "BEANR",
                        List.of(product1, product2));

        static final OrderRequestDto orderRequest2 = new OrderRequestDto(TransportTypeEnum.IMPORT, "NLROT", "BEANR",
                        List.of());
}
