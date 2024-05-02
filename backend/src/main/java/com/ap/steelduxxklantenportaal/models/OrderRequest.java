package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.enums.TransportTypeEnum;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_requests")
@Getter
@Setter
@NoArgsConstructor
public class OrderRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String customerCode;
    @Enumerated(EnumType.STRING)
    private TransportTypeEnum transportType;
    private String portOfOriginCode;
    private String portOfDestinationCode;
    @Enumerated(EnumType.STRING)
    private StatusEnum status;
    @Enumerated(EnumType.STRING)
    private OrderTypeEnum orderType;

    public OrderRequest(String customerCode, TransportTypeEnum transportType, String portOfOriginCode,
            String portOfDestinationCode, StatusEnum status, OrderTypeEnum orderType) {
        this.customerCode = customerCode;
        this.transportType = transportType;
        this.portOfOriginCode = portOfOriginCode;
        this.portOfDestinationCode = portOfDestinationCode;
        this.status = status;
        this.orderType = orderType;
    }
}
