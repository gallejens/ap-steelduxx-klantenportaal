package com.ap.steelduxxklantenportaal.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ContainerSizeEnum {
    SIZE_20("20"),
    SIZE_40("40");

    ContainerSizeEnum(String value) {
        this.value = value;
    }

    private final String value;

    @Override
    public String toString() {
        return value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static ContainerSizeEnum fromValue(String value) {
        if (value == null) {
            return null;
        }
        for (ContainerSizeEnum cse : ContainerSizeEnum.values()) {
            if (cse.getValue().equals(value)) {
                return cse;
            }
        }
        throw new IllegalArgumentException();
    }
}
