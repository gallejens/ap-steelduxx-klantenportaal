package com.ap.steelduxxklantenportaal.enums;

import lombok.Getter;

@Getter
public enum StatusEnum {
    PENDING("Pending"),
    APPROVED("Approved"),
    DENIED("Denied"),
    DEACTIVATED("Deactivated");

    private final String value;

    StatusEnum(String value) {
        this.value = value;
    }
}