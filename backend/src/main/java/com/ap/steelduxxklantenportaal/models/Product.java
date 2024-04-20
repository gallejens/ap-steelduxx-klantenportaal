package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.enums.ContainerSizeEnum;
import com.ap.steelduxxklantenportaal.enums.ContainerTypeEnum;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_request_products")
@Getter
@Setter
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String hsCode;
    private String name;
    private String quantity;
    private String weight;
    @Column(name = "container_nr")
    private String containerNumber;
    private ContainerSizeEnum containerSize;
    private ContainerTypeEnum containerType;

    @ManyToOne
    @JoinColumn(name = "order_request_id", nullable = false)
    private OrderRequest orderRequest;

    public Product(String hsCode, String name, String quantity, String weight, String containerNumber,
            ContainerSizeEnum containerSize,
            ContainerTypeEnum containerType, OrderRequest orderRequest) {
        this.hsCode = hsCode;
        this.name = name;
        this.quantity = quantity;
        this.weight = weight;
        this.containerNumber = containerNumber;
        this.containerSize = containerSize;
        this.containerType = containerType;
        this.orderRequest = orderRequest;
    }

}
