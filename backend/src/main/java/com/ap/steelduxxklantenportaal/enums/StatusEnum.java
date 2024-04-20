package com.ap.steelduxxklantenportaal.enums;

public enum StatusEnum {
    PENDING("Pending"),
    APPROVED("Approved"),
    DENIED("Denied"),
    DEACTIVATED("Deactivated");

    private final String value;

    StatusEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}