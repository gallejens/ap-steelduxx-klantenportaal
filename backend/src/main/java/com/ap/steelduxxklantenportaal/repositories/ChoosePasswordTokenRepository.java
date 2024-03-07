package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.ChoosePasswordToken;
import com.ap.steelduxxklantenportaal.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChoosePasswordTokenRepository extends JpaRepository<ChoosePasswordToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUserId(long userId);
}
