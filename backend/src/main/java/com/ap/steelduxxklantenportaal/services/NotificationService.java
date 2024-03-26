package com.ap.steelduxxklantenportaal.services;

import com.ap.steelduxxklantenportaal.models.Notification;
import com.ap.steelduxxklantenportaal.repositories.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public List<Notification> getUnreadNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false);
    }

    public void markNotificationAsRead(Long notificationId, boolean isRead) {
        Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);
        notificationOptional.ifPresent(notification -> {
            notification.setRead(isRead);
            notificationRepository.save(notification);
        });
    }
}
