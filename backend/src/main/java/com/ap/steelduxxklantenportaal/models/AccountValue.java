package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class AccountValue {
    public AccountValue() {
    }

    public AccountValue(String companyName, String email, String phoneNr, String vatNr, String postalCode,
            String district, String street, String streetNr, String boxNr, String firstName, String lastName) {
        this.companyName = companyName;
        this.email = email;
        this.phoneNr = phoneNr;
        this.vatNr = vatNr;
        this.postalCode = postalCode;
        this.district = district;
        this.street = street;
        this.streetNr = streetNr;
        this.boxNr = boxNr;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "company_name")
    private String companyName;
    @Column(name = "email")
    private String email;
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
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;

    public Long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNr() {
        return phoneNr;
    }

    public void setPhoneNr(String phoneNr) {
        this.phoneNr = phoneNr;
    }

    public String getVatNr() {
        return vatNr;
    }

    public void setVatNr(String vatNr) {
        this.vatNr = vatNr;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getStreetNr() {
        return streetNr;
    }

    public void setStreetNr(String streetNr) {
        this.streetNr = streetNr;
    }

    public String getBoxNr() {
        return boxNr;
    }

    public void setBoxNr(String boxNr) {
        this.boxNr = boxNr;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastNamel(String lastName) {
        this.lastName = lastName;
    }

    @Override
    public String toString() {
        return "AccountValue [id=" + id + ", companyName=" + companyName + ", email=" + email + ", phoneNr=" + phoneNr
                + ", vatNr=" + vatNr + ", postalCode=" + postalCode + ", district=" + district + ", street=" + street
                + ", streetNr=" + streetNr + ", boxNr=" + boxNr + ", firstName=" + firstName + ", lastName="
                + lastName + "]";
    }
}
