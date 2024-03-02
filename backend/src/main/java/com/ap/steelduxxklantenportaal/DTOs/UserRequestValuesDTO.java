package com.ap.steelduxxklantenportaal.DTOs;

import com.ap.steelduxxklantenportaal.enums.StatusEnum;

public class UserRequestValuesDTO {
    private Long followId;
    private String companyName;
    private String phoneNr;
    private String vatNr;
    private String postalCode;
    private String district;
    private String street;
    private String streetNr;
    private String boxNr;
    private String firstName;
    private String lastName;
    private String email;
    private Long createdOn;
    private StatusEnum status;
    private String denyMessage;

    public UserRequestValuesDTO() {
    }

    public UserRequestValuesDTO(Long followId, String companyName, String phoneNr, String vatNr, String postalCode,
            String district, String street, String streetNr, String boxNr, String firstName, String lastName,
            String email, Long createdOn, StatusEnum status, String denyMessage) {
        this.followId = followId;
        this.companyName = companyName;
        this.phoneNr = phoneNr;
        this.vatNr = vatNr;
        this.postalCode = postalCode;
        this.district = district;
        this.street = street;
        this.streetNr = streetNr;
        this.boxNr = boxNr;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdOn = createdOn;
        this.status = status;
        this.denyMessage = denyMessage;
    }

    public Long getFollowId() {
        return followId;
    }

    public void setFollowId(Long followId) {
        this.followId = followId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Long createdOn) {
        this.createdOn = createdOn;
    }

    public StatusEnum getStatus() {
        return status;
    }

    public void setStatus(StatusEnum status) {
        this.status = status;
    }

    public String getDenyMessage() {
        return denyMessage;
    }

    public void setDenyMessage(String denyMessage) {
        this.denyMessage = denyMessage;
    }

    @Override
    public String toString() {
        return "UserRequestValuesDTO [followId=" + followId + "companyName=" + companyName + ", phoneNr=" + phoneNr
                + ", vatNr=" + vatNr
                + ", postalCode=" + postalCode + ", district=" + district + ", street=" + street + ", streetNr="
                + streetNr + ", boxNr=" + boxNr + ", firstName=" + firstName + ", lastName=" + lastName + ", email="
                + email + ", createdOn=" + createdOn + ", status=" + status + ", denyMessage=" + denyMessage + "]";
    }

}
