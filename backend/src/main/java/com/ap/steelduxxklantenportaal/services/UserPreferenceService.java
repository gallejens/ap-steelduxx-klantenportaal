package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.UserPreferenceDto;
import com.ap.steelduxxklantenportaal.models.UserPreference;
import com.ap.steelduxxklantenportaal.repositories.UserPreferenceRepository;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
public class UserPreferenceService {
    private final UserPreferenceRepository userPreferenceRepository;

    public UserPreferenceService(UserPreferenceRepository userPreferenceRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
    }

    public UserPreferenceDto getPreferences(Long userId) {
        var userPreferences = userPreferenceRepository.findByUserId(userId);
        if (userPreferences.isPresent()) {
            return userPreferences.get().toDto();
        }

        var newUserPreferences = new UserPreference(userId);
        userPreferenceRepository.save(newUserPreferences);

        return newUserPreferences.toDto();
    }

    public void updateNotification(Long userId, Integer userPreferenceType, boolean enabled) {
        var userPreferences = userPreferenceRepository.findByUserId(userId).orElse(null);
        if (userPreferences == null) return;
        updatePreference(userPreferences, userPreferenceType, enabled);
        userPreferenceRepository.save(userPreferences);
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
}
