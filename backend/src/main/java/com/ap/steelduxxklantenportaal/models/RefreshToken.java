package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "user_id")
    private long userId;
    private String token;

    public RefreshToken() {}
    public RefreshToken(long id, long userId, String token) {
        this.id = id;
        this.userId = userId;
        this.token = token;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        return "RefreshToken{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", token='" + token + '\'' +
                '}';
    }
}
