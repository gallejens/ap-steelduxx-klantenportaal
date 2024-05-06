package com.ap.steelduxxklantenportaal.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ap.steelduxxklantenportaal.models.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByReferenceCode(String referenceCode);

    Optional<Company> findById(Long id);

    void deleteById(Number id);

    @Query(value = """
            SELECT c.*
            FROM companies AS c
            LEFT JOIN user_company AS uc ON uc.company_id = c.id
            LEFT JOIN users AS u ON uc.user_id = u.id
            WHERE u.id = ?1
            """, nativeQuery = true)
    Optional<Company> findByUserId(Long id);
}
