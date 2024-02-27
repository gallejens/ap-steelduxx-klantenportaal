package com.ap.steelduxxklantenportaal.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ap.steelduxxklantenportaal.models.UserRequestValue;

public interface UserRequestValueRepository extends JpaRepository<UserRequestValue, Long> {
    Optional<UserRequestValue> findByVatNrAndEmail(String vatNr, String email);
}
