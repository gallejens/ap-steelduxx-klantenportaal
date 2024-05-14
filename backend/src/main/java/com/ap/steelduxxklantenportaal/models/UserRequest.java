package com.ap.steelduxxklantenportaal.models;

import com.ap.steelduxxklantenportaal.enums.StatusEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_requests")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserRequest {
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
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "email")
    private String email;
    @Column(name = "created_on")
    private Long createdOn;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusEnum status;
    @Column(name = "deny_message")
    private String denyMessage;

    public UserRequest(String companyName, String country, String phoneNr, String vatNr, String postalCode,
            String district, String street, String streetNr, String boxNr, String extraInfo, String firstName,
            String lastName,
            String email, Long createdOn, StatusEnum status, String denyMessage) {
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
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdOn = createdOn;
        this.status = status;
        this.denyMessage = denyMessage;
    }
}
