package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.UserPreferenceDto;
import com.ap.steelduxxklantenportaal.models.UserPreference;
import com.ap.steelduxxklantenportaal.repositories.UserPreferenceRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
public class UserPreferenceService {
    private final UserPreferenceRepository userPreferenceRepository;

    public UserPreferenceService(UserPreferenceRepository userPreferenceRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
    }

    public UserPreferenceDto convertToDto(UserPreference userPreference) {
        return new UserPreferenceDto(
                userPreference.getUserId(),
                userPreference.isSystemNotificationOrderStatus(),
                userPreference.isEmailNotificationOrderStatus(),
                userPreference.isSystemNotificationOrderRequest(),
                userPreference.isEmailNotificationOrderRequest()
        );
    }

    public UserPreferenceDto getPreferences(Long userId) {
        return userPreferenceRepository.findByUserId(userId)
                .map(this::convertToDto)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public ResponseEntity<Object> updateNotification(Long userId, Integer userPreferenceType, boolean enabled) {
        return userPreferenceRepository.findByUserId(userId)
                .map(userPreference -> {
                    updatePreference(userPreference, userPreferenceType, enabled);
                    userPreferenceRepository.save(userPreference);
                    return ResponseHandler.generate("userPreference:response:success", HttpStatus.CREATED);
                })
                .orElseGet(() -> ResponseHandler.generate("userPreference:response:not found", HttpStatus.NOT_FOUND));
    }

    private void updatePreference(UserPreference userPreference, Integer userPreferenceType, boolean status) {
        Consumer<Boolean> updater;
        switch (userPreferenceType) {
            case 1:
                updater = userPreference::setSystemNotificationOrderStatus;
                break;
            case 2:
                updater = userPreference::setEmailNotificationOrderStatus;
                break;
            case 3:
                updater = userPreference::setSystemNotificationOrderRequest;
                break;
            case 4:
                updater = userPreference::setEmailNotificationOrderRequest;
                break;
            default:
                throw new IllegalArgumentException("Invalid preference type");
        }
        updater.accept(status);
    }

    public ResponseEntity<Object> enableNotification(Long userId, Integer userPreferenceType) {
        return updateNotification(userId, userPreferenceType, true);
    }

    public ResponseEntity<Object> disableNotification(Long userId, Integer userPreferenceType) {
        return updateNotification(userId, userPreferenceType, false);
    }
}
