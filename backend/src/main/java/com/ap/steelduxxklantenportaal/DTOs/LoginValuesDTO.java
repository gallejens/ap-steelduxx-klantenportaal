package com.ap.steelduxxklantenportaal.DTOs;

public class LoginValuesDTO {
    private String email;
    private String password;

    public LoginValuesDTO() {}

    public LoginValuesDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginValuesDTO {" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
