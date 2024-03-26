package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRequestRepository extends JpaRepository<UserRequest, Long> {
    Optional<UserRequest> findByVatNrOrEmail(String vatNr, String email);

    UserRequest findById(Number id);

    void deleteById(Number id);
}
