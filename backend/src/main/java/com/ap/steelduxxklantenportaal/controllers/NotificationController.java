package com.ap.steelduxxklantenportaal.controllers;

import com.ap.steelduxxklantenportaal.models.Notification;
import com.ap.steelduxxklantenportaal.services.NotificationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/")
    @PreAuthorize("denyAll")
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationService.createNotification(notification);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("permitAll")
    public List<Notification> getNotificationsByUserId(@PathVariable Long userId) {
        return notificationService.getNotificationsByUserId(userId);
    }

    @GetMapping("/user/new/{userId}")
    @PreAuthorize("permitAll")
    public List<Notification> getNewNotificationsByUserId(@PathVariable Long userId) {
        return notificationService.getUnreadNotificationsByUserId(userId);
    }

    @PutMapping("/{notificationId}/read")
    @PreAuthorize("permitAll")
    public void markNotificationAsRead(@PathVariable Long notificationId, @RequestBody Map<String, Boolean> isReadData) {
        boolean isRead = isReadData.get("isRead");
        notificationService.markNotificationAsRead(notificationId, isRead);
    }
}
