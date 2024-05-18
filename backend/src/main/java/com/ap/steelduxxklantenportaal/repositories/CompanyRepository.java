package com.ap.steelduxxklantenportaal.repositories;

import java.util.Optional;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ap.steelduxxklantenportaal.models.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
        Optional<Company> findByReferenceCode(String referenceCode);

        @Query(value = """
                        SELECT c.*
                        FROM companies AS c
                        LEFT JOIN user_company AS uc ON uc.company_id = c.id
                        LEFT JOIN users AS u ON uc.user_id = u.id
                        WHERE u.id = ?1 AND u.deleted = false AND c.deleted = false
                        """, nativeQuery = true)
        Optional<Company> findByUserId(Long id);

        @Query(value = """
                        SELECT u.id
                        FROM users AS u
                        LEFT JOIN user_company AS uc ON uc.user_id = u.id
                        LEFT JOIN companies AS c ON uc.company_id = c.id
                        WHERE c.id = ?1 AND u.role = "ROLE_HEAD_USER" AND u.deleted = false AND c.deleted = false
                        """, nativeQuery = true)
        Optional<Long> findHeadUserIdByCompanyId(Long id);

        @Query(value = """
                            UPDATE companies SET deleted = true WHERE id = ?1
                        """, nativeQuery = true)
        @Modifying
        @Transactional
        void setDeleted(long id);
}
