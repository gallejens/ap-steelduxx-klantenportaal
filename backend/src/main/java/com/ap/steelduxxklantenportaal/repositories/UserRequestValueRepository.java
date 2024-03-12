package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.UserRequestValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRequestValueRepository extends JpaRepository<UserRequestValue, Long> {
    Optional<UserRequestValue> findByVatNrAndEmail(String vatNr, String email);

    UserRequestValue findById(Number id);
}

