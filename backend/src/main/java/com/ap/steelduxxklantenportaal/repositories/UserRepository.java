package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
