package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;

@Entity
@Table(name = "company")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "company_name")
    private String companyName;
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

    public Company() {
    }

    public Company(String companyName, String country, String phoneNr, String vatNr, String postalCode, String district,
            String street, String streetNr, String boxNr, String extraInfo, String referenceCode) {
        this.companyName = companyName;
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

    public Long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
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

    public String getExtraInfo() {
        return extraInfo;
    }

    public void setExtraInfo(String extraInfo) {
        this.extraInfo = extraInfo;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    @Override
    public String toString() {
        return "Company [id=" + id + ", companyName=" + companyName + ", country=" + country + ", phoneNr=" + phoneNr
                + ", vatNr=" + vatNr + ", postalCode=" + postalCode + ", district=" + district + ", street=" + street
                + ", streetNr=" + streetNr + ", boxNr=" + boxNr + ", extraInfo=" + extraInfo + ", referenceCode="
                + referenceCode + "]";
    }

}
