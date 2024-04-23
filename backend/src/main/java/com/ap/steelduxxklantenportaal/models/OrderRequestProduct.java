package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.dtos.OrderRequests.NewOrderRequestDto;
import com.ap.steelduxxklantenportaal.dtos.OrderRequests.OrderRequestProductDto;
import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_request_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderRequestId;
    private String hsCode;
    private String name;
    private long quantity;
    private long weight;
    @Column(name = "container_nr")
    private String containerNumber;
    @Enumerated(EnumType.STRING)
    private ContainerSizeEnum containerSize;
    @Enumerated(EnumType.STRING)
    private ContainerTypeEnum containerType;

    public static OrderRequestProduct fromDto(OrderRequestProductDto dto) {
        var product = new OrderRequestProduct();
        product.setHsCode(dto.hsCode());
        product.setName(dto.name());
        product.setQuantity(dto.quantity());
        product.setWeight(dto.weight());
        product.setContainerNumber(dto.containerNumber());
        product.setContainerSize(dto.containerSize());
        product.setContainerType(dto.containerType());
        return product;
    }
}
