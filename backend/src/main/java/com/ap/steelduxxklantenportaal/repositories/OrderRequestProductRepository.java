package com.ap.steelduxxklantenportaal.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ap.steelduxxklantenportaal.models.OrderRequestProduct;

@Repository
public interface OrderRequestProductRepository extends JpaRepository<OrderRequestProduct, Long> {
    List<OrderRequestProduct> findAllByOrderRequestId(long orderRequestId);
}
