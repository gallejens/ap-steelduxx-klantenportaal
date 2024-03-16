package com.ap.steelduxxklantenportaal.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ap.steelduxxklantenportaal.models.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

}
