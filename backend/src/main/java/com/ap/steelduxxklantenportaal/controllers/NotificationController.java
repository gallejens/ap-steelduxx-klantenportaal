package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.annotations.IsLoggedIn;
import com.ap.steelduxxklantenportaal.services.NotificationService;
import com.ap.steelduxxklantenportaal.models.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/")
    @PreAuthorize("denyAll")
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationService.createNotification(notification);
    }

    @GetMapping("/user/{userId}")
    @IsLoggedIn
    public List<Notification> getNotificationsByUserId(@PathVariable Long userId) {
        return notificationService.getNotificationsByUserId(userId);
    }
}
