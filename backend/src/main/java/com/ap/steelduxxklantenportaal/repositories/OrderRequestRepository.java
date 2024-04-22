package com.ap.steelduxxklantenportaal.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ap.steelduxxklantenportaal.models.OrderRequest;

@Repository
public interface OrderRequestRepository extends JpaRepository<OrderRequest, Long> {

}
