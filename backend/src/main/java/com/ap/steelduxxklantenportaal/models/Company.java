package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "companies")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "country")
    private String country;
    @Column(name = "phone_nr")
    private String phoneNr;
    @Column(name = "vat_nr")
    private String vatNr;
    @Column(name = "postal_code")
    private String postalCode;
    @Column(name = "district")
    private String district;
    @Column(name = "street")
    private String street;
    @Column(name = "street_nr")
    private String streetNr;
    @Column(name = "box_nr")
    private String boxNr;
    @Column(name = "extra_info")
    private String extraInfo;
    @Column(name = "reference_code")
    private String referenceCode;

    @Override
    public String toString() {
        return "Company [id=" + id + ", name=" + name + ", country=" + country + ", phoneNr=" + phoneNr
                + ", vatNr=" + vatNr + ", postalCode=" + postalCode + ", district=" + district + ", street=" + street
                + ", streetNr=" + streetNr + ", boxNr=" + boxNr + ", extraInfo=" + extraInfo + ", referenceCode="
                + referenceCode + "]";
    }
}
