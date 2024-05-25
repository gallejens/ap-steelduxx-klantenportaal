package com.ap.steelduxxklantenportaal.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ContainerSizeEnum {
    SIZE_20(20),
    SIZE_40(40);

    ContainerSizeEnum(int value) {
        this.value = value;
    }

    private final int value;

    @Override
    public String toString() {
        return Integer.toString(value);
    }

    public int getValue() {
        return value;
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static ContainerSizeEnum fromValue(Integer value) {
        if (value == null) {
            return null;
        }
        for (ContainerSizeEnum cse : ContainerSizeEnum.values()) {
            if (cse.getValue() == value) {
                return cse;
            }
        }
        throw new IllegalArgumentException();
    }
}
