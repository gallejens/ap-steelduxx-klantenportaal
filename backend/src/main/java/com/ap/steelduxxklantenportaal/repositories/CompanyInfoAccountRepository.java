package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.CompanyInfoAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyInfoAccountRepository extends JpaRepository<CompanyInfoAccount, String> {
    List<CompanyInfoAccount> findAllByCompanyId(long companyId);
}
