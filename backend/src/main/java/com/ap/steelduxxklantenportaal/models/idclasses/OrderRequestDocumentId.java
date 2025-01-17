package com.ap.steelduxxklantenportaal.models.idclasses;

import com.ap.steelduxxklantenportaal.enums.OrderDocumentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderRequestDocumentId implements Serializable {
    private long orderRequestId;
    private OrderDocumentType type;
}
