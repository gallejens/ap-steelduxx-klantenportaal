package com.ap.steelduxxklantenportaal.models;

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
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderRequestId;
    private String hsCode;
    private String name;
    private String quantity;
    private String weight;
    @Column(name = "container_nr")
    private String containerNumber;
    private ContainerSizeEnum containerSize;
    private ContainerTypeEnum containerType;
}
