package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;

@Entity
@Table(name = "user_company")
public class UserCompany {
    @Id
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "company_id")
    private Long companyId;

    public UserCompany() {
    }

    public UserCompany(Long userId, Long companyId) {
        this.userId = userId;
        this.companyId = companyId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getCompanyId() {
        return companyId;
    }
}
