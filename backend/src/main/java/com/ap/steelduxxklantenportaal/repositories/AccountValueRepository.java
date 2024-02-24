package com.ap.steelduxxklantenportaal.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ap.steelduxxklantenportaal.models.AccountValue;

public interface AccountValueRepository extends JpaRepository<AccountValue, Long> {
    Optional<AccountValue> checkIfCompanyExists(String vatNr, String email);
}
