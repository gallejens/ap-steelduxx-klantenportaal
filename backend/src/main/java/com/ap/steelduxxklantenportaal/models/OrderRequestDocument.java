package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.enums.DocumentType;
import com.ap.steelduxxklantenportaal.models.idclasses.OrderRequestDocumentId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_request_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(OrderRequestDocumentId.class)
public class OrderRequestDocument {
    @Id
    @Column(name = "order_request_id")
    private long orderRequestId;

    @Id
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private DocumentType type;

    @Column(name = "file_name")
    private String fileName;
}
