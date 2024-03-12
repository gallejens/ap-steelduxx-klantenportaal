package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.TestValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestValueRepository extends JpaRepository<TestValue, Long> {
}
