package com.ap.steelduxxklantenportaal.services;

import org.springframework.beans.factory.annotation.Autowired;
import com.ap.steelduxxklantenportaal.repositories.NotificationRepository;
import com.ap.steelduxxklantenportaal.models.Notification;

import java.util.Date;
import java.util.List;

public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification createTestNotification() {
        Notification notification = new Notification();
        notification.setTitle("Test Notification");
        notification.setMessage("This is a test notification.");
        notification.setCreatedAt(new Date());
        notification.setRead(false);
        return notificationRepository.save(notification);
    }
}
