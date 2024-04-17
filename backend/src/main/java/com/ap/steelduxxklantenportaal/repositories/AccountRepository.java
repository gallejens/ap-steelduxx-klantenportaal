package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.dtos.Accounts.AccountDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AccountRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public List<AccountDto> findAccountsForUserCompany(Long userId) {
        Query query = entityManager.createNativeQuery("""
            SELECT u.email, u.first_name, u.last_name, c.company_name, u.role
            FROM users AS u
            LEFT JOIN user_company AS uc ON u.id = uc.user_id
            LEFT JOIN company AS c ON uc.company_id = c.id
            WHERE c.id = (
                SELECT company_id
                FROM user_company
                WHERE user_id = :userId
            )
            """, AccountDto.class).setParameter("userId", userId);
        return (List<AccountDto>) query.getResultList();
    };

    public List<AccountDto> findAllAccounts() {
        Query query = entityManager.createNativeQuery("""
            SELECT u.email, u.first_name, u.last_name, c.company_name, u.role
            FROM users AS u
            LEFT JOIN user_company AS uc ON u.id = uc.user_id
            LEFT JOIN company AS c ON uc.company_id = c.id
            """, AccountDto.class);
        return (List<AccountDto>) query.getResultList();
    };
}
