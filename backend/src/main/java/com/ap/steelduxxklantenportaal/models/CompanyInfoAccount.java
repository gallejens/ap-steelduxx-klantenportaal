package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "company_info_accounts_view")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompanyInfoAccount {
    @Id
    private String email;
    private String firstName;
    private String lastName;
    @Enumerated(EnumType.STRING)
    private RoleEnum role;
    private Long companyId;
}
