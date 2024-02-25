package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.services.NotificationService;
import com.ap.steelduxxklantenportaal.models.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/notifications")
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @PostMapping("/notifications/test")
    public Notification createTestNotification() {
        return notificationService.createTestNotification();
    }
}
