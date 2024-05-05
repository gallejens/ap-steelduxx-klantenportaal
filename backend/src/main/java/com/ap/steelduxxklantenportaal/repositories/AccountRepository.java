package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    @Query(value = """
            SELECT * FROM account_view WHERE company_id = (
                SELECT company_id
                FROM user_company
                WHERE user_id = ?1
            )
            """, nativeQuery = true)
    List<Account> findAllFromSameCompanyAsUser(long userId);
}
