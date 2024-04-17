package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.dtos.Accounts.AccountDto;
import com.ap.steelduxxklantenportaal.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "ACCOUNT_VIEW")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Account {
    @Id
    private String email;
    private String firstName;
    private String lastName;
    @Enumerated(EnumType.STRING)
    private RoleEnum role;
    private String companyName;
    private Long companyId;

    public AccountDto toDto() {
        return new AccountDto(email, firstName, lastName, companyName, role);
    }
}
