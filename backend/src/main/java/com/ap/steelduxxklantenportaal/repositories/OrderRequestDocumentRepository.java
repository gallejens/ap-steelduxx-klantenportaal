package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.OrderRequestDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRequestDocumentRepository extends JpaRepository<OrderRequestDocument, Long> {
    List<OrderRequestDocument> findAllByOrderRequestId(long orderRequestId);

}