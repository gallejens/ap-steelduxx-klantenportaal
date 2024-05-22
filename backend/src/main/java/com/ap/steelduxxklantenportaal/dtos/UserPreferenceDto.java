package com.ap.steelduxxklantenportaal.dtos;

public record UserPreferenceDto (Long userId, boolean systemNotificationOrderStatus, boolean emailNotificationOrderStatus, boolean systemNotificationOrderRequest, boolean emailNotificationOrderRequest) {
}
