package com.ap.steelduxxklantenportaal.DTOs;

public class AccountValuesDTO {
    private String companyName;
    private String email;
    private String phoneNr;
    private String vatNr;
    private String postalCode;
    private String district;
    private String street;
    private String streetNr;
    private String boxNr;
    private String firstName;
    private String lastName;
    // private String intrisCode;

    public AccountValuesDTO() {
    }

    public AccountValuesDTO(String companyName, String email, String phoneNr, String vatNr, String postalCode,
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

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Override
    public String toString() {
        return "RegisterValuesDTO [companyName=" + companyName + ", email=" + email + ", phoneNr=" + phoneNr
                + ", vatNr=" + vatNr + ", postalCode=" + postalCode + ", distric=" + district + ", street=" + street
                + ", streetNr=" + streetNr + ", boxNr=" + boxNr + ", firstName=" + firstName + ", lastName=" + lastName
                + "]";
    }
}
