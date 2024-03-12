package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.ChoosePasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChoosePasswordTokenRepository extends JpaRepository<ChoosePasswordToken, Long> {
    Optional<ChoosePasswordToken> findByToken(String token);

    void deleteByUserId(long userId);
}
