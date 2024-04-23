package com.ap.steelduxxklantenportaal.models.IdClasses;

import com.ap.steelduxxklantenportaal.enums.DocumentType;
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
    private DocumentType type;
}
