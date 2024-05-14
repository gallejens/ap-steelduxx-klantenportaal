package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_company")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserCompany {
    @Id
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "company_id")
    private Long companyId;
}
