package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.RefreshToken;
import com.ap.steelduxxklantenportaal.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUserId(long userId);
}


