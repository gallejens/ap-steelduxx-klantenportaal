package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.enums.OrderTypeEnum;
import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import com.ap.steelduxxklantenportaal.enums.OrderTransportTypeEnum;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long companyId;
    private String customerReferenceNumber;
    @Enumerated(EnumType.STRING)
    private OrderTransportTypeEnum transportType;
    private String portOfOriginCode;
    private String portOfDestinationCode;
    @Enumerated(EnumType.STRING)
    private StatusEnum status;
    @Enumerated(EnumType.STRING)
    private OrderTypeEnum orderType;

    public OrderRequest(Long companyId, String customerReferenceNumber, OrderTransportTypeEnum transportType, String portOfOriginCode,
            String portOfDestinationCode, StatusEnum status, OrderTypeEnum orderType) {
        this.companyId = companyId;
        this.customerReferenceNumber = customerReferenceNumber;
        this.transportType = transportType;
        this.portOfOriginCode = portOfOriginCode;
        this.portOfDestinationCode = portOfDestinationCode;
        this.status = status;
        this.orderType = orderType;
    }
}
