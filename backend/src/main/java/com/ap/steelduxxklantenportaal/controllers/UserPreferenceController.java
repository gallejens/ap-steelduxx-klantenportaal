package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.UserPreferenceService;
import org.springframework.http.HttpStatus;
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
    @ResponseStatus(HttpStatus.OK)
    public void onRequest(@PathVariable Long userId, @RequestBody Integer userPreferenceType) {
        userPreferenceService.updateNotification(userId, userPreferenceType, true);
    }

    @PostMapping("/{userId}/off")
    @PreAuthorize("hasAuthority('ACCESS')")
    @ResponseStatus(HttpStatus.OK)
    public void offRequest(@PathVariable Long userId, @RequestBody Integer userPreferenceType) {
        userPreferenceService.updateNotification(userId, userPreferenceType, false);
    }

}
