package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(long id);
}
