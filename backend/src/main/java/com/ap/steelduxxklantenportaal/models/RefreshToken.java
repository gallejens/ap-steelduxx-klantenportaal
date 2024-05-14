package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RefreshToken {
    @Id
    @Column(name = "token")
    private String token;
    @Column(name = "user_id")
    private long userId;
    @Column(name = "expiry_date")
    private long expiryDate;

    public boolean isExpired() {
        return this.expiryDate < new Date().getTime();
    }
}
