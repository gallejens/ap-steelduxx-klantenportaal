package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.dtos.UserPreferenceDto;
import com.ap.steelduxxklantenportaal.enums.UserPreferenceType;
import com.ap.steelduxxklantenportaal.models.UserPreference;
import com.ap.steelduxxklantenportaal.repositories.UserPreferenceRepository;
import com.ap.steelduxxklantenportaal.utils.ResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
                userPreference.isEmailNotificationOrderRequest());
    }
    public UserPreferenceDto getPreferences(Long userId){
        Optional<UserPreference> userPreference = userPreferenceRepository.findByUserId(userId);
        return convertToDto(userPreference.get());
    }

    public ResponseEntity<Object> enableNotification(Long userId, UserPreferenceType userPreferenceType) {
        Optional<UserPreference> userPreference = userPreferenceRepository.findByUserId(userId);
        UserPreferenceDto userPreferenceDto = convertToDto(userPreference.get());
        updateSystemNotificationOrderStatus(userPreferenceDto, userPreferenceType);
        return ResponseHandler.generate("userPreference:response:success", HttpStatus.CREATED);
    }
    public ResponseEntity<Object> disableNotification(Long userId,UserPreferenceType userPreferenceType) {
        Optional<UserPreference> userPreference = userPreferenceRepository.findByUserId(userId);
        UserPreferenceDto userPreferenceDto = convertToDto(userPreference.get());
        updateSystemNotificationOrderStatus(userPreferenceDto, userPreferenceType);
        return ResponseHandler.generate("userPreference:response:success", HttpStatus.CREATED);
    }

    public void updateSystemNotificationOrderStatus(UserPreferenceDto userPreferenceDto, UserPreferenceType userPreferenceType){
        Optional<UserPreference> optionalUserPreference = userPreferenceRepository.findByUserId(userPreferenceDto.userId());
        if(optionalUserPreference.isPresent()){
            UserPreference userPreference = optionalUserPreference.get();
            if(userPreferenceType == UserPreferenceType.SYSTEMNOTIFICATIONORDERSTATUS){
                userPreference.setSystemNotificationOrderStatus(userPreferenceDto.systemNotificationOrderStatus());
            }
            if(userPreferenceType == UserPreferenceType.EMAILNOTIFICATIONORDERSTATUS){
                userPreference.setEmailNotificationOrderStatus(userPreferenceDto.emailNotificationOrderStatus());
            }
            if(userPreferenceType == UserPreferenceType.SYSTEMNOTIFICATIONORDERREQUEST){
                userPreference.setSystemNotificationOrderRequest(userPreferenceDto.systemNotificationOrderRequest());
            }
            if(userPreferenceType == UserPreferenceType.EMAILNOTIFICATIONORDERREQUEST){
                userPreference.setEmailNotificationOrderRequest(userPreferenceDto.emailNotificationOrderRequest());
            }
            userPreferenceRepository.save(userPreference);
        }
    }
}
