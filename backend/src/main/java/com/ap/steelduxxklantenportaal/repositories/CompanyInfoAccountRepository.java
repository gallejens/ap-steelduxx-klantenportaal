package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.CompanyInfoAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyInfoAccountRepository extends JpaRepository<CompanyInfoAccount, String> {
    @Query(value = """ 
            SELECT email, first_name, last_name, role FROM company_info_accounts_view WHERE company_id = ?1
            """, nativeQuery = true)
    List<CompanyInfoAccount> findAllByCompanyId(long companyId);

    @Query(value = """ 
            SELECT email, first_name, last_name, role FROM company_info_accounts_view WHERE company_id IS NULL
            """, nativeQuery = true)
    List<CompanyInfoAccount> findAdmin();
}
