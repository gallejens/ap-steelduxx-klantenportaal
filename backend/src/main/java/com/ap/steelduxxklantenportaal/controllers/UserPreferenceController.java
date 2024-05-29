package com.ap.steelduxxklantenportaal.controllers;


import com.ap.steelduxxklantenportaal.services.UserPreferenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/preferences")
public class UserPreferenceController {
    private final UserPreferenceService userPreferenceService;

    public UserPreferenceController(UserPreferenceService userPreferenceService) {
        this.userPreferenceService = userPreferenceService;
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> getPreferences(@PathVariable Long userId){
        return ResponseEntity.ok(userPreferenceService.getPreferences(userId));
    }

    @PostMapping("/{userId}/on")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> onRequest(@PathVariable Long userId, @RequestBody Integer userPreferenceType) {
        return userPreferenceService.enableNotification(userId, userPreferenceType);
    }

    @PostMapping("/{userId}/off")
    @PreAuthorize("hasAuthority('ACCESS')")
    public ResponseEntity<Object> offRequest(@PathVariable Long userId, @RequestBody Integer userPreferenceType) {
        return userPreferenceService.disableNotification(userId, userPreferenceType);
    }

}
