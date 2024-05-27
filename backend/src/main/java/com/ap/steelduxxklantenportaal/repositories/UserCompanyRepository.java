package com.ap.steelduxxklantenportaal.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ap.steelduxxklantenportaal.models.UserCompany;

import java.util.List;

@Repository
public interface UserCompanyRepository extends JpaRepository<UserCompany, Long> {
    void deleteById(Number id);

    List<UserCompany> findAllByCompanyId(Long id);
}
