package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    private String token;
    @Column(name = "user_id")
    private long userId;

    @Column(name = "expiry_date")
    private long expiryDate;

    public RefreshToken() {
    }

    public RefreshToken(String token, long userId, long expiryDate) {
        this.token = token;
        this.userId = userId;
        this.expiryDate = expiryDate;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(long expiryDate) {
        this.expiryDate = expiryDate;
    }

    @Override
    public String toString() {
        return "RefreshToken{" +
                "token='" + token + '\'' +
                ", userId=" + userId +
                ", expiryDate=" + expiryDate +
                '}';
    }

    public boolean isExpired() {
        return this.expiryDate < new Date().getTime();
    }
}
