package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "choose_password_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChoosePasswordToken {
    @Id
    @Column(name = "user_id")
    private long userId;
    @Column(name = "expiry_date")
    private long expiryDate;
    @Column(name = "token")
    private String token;

    public boolean isExpired() {
        return this.expiryDate < new Date().getTime();
    }
}
