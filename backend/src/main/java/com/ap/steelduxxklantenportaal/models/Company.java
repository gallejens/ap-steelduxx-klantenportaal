package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "companies")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SQLRestriction("deleted=false")
@ToString
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String country;
    private String phoneNr;
    private String vatNr;
    private String postalCode;
    private String district;
    private String street;
    private String streetNr;
    private String boxNr;
    private String extraInfo;
    private String referenceCode;
    private boolean deleted = Boolean.FALSE;

    public Company(String name, String country, String phoneNr, String vatNr, String postalCode, String district,
            String street, String streetNr, String boxNr, String extraInfo, String referenceCode) {
        this.name = name;
        this.country = country;
        this.phoneNr = phoneNr;
        this.vatNr = vatNr;
        this.postalCode = postalCode;
        this.district = district;
        this.street = street;
        this.streetNr = streetNr;
        this.boxNr = boxNr;
        this.extraInfo = extraInfo;
        this.referenceCode = referenceCode;
    }
}
