package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    void deleteByEmail(String email);

    @Query(value = """
                UPDATE users SET deleted = true WHERE id = ?1
            """, nativeQuery = true)
    @Modifying
    @Transactional
    void setDeleted(long id);

    @Query(value = """
            SELECT u.*
            FROM users AS u
            LEFT JOIN user_company AS uc ON uc.user_id = u.id
            LEFT JOIN companies AS c ON c.id = uc.company_id
            WHERE c.id = ?1
            """, nativeQuery = true)
    List<User> findAllByCompanyId(Long companyId);
}
