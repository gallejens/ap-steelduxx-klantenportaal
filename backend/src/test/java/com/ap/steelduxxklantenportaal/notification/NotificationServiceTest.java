package com.ap.steelduxxklantenportaal.notification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.ap.steelduxxklantenportaal.models.Notification;
import com.ap.steelduxxklantenportaal.repositories.NotificationRepository;
import com.ap.steelduxxklantenportaal.services.NotificationService;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    public void testGetNotificationsByUserId() {
        Notification notification = new Notification();
        notification.setTitle("Title Notification");
        notification.setMessage("Test Notification");
        notification.setUserId(1L);
        when(notificationRepository.findByUserId(1L)).thenReturn(List.of(notification));

        List<Notification> notifications = notificationService.getNotificationsByUserId(1L);

        assertNotNull(notifications);
        assertFalse(notifications.isEmpty());
        assertEquals("Test Notification", notifications.get(0).getMessage());
    }

    @Test
    public void testCreateNotification() {
        Notification notification = new Notification();
        notification.setTitle("New Title Notification");
        notification.setMessage("New Notification");
        notification.setUserId(2L);
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        Notification savedNotification = notificationService.createNotification(notification);

        assertNotNull(savedNotification);
        assertEquals("New Notification", savedNotification.getMessage());
    }
}
