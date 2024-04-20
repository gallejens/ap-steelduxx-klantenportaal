package com.ap.steelduxxklantenportaal.notification;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.hamcrest.Matchers.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.ap.steelduxxklantenportaal.controllers.NotificationController;
import com.ap.steelduxxklantenportaal.models.Notification;
import com.ap.steelduxxklantenportaal.services.NotificationService;

@ExtendWith(MockitoExtension.class)
public class NotificationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    @Test
    public void testGetNotificationsByUserId() throws Exception {
        Notification notification = new Notification();
        notification.setTitle("Title User Notification");
        notification.setMessage("User Notification");
        notification.setUserId(1L);
        when(notificationService.getNotificationsByUserId(1L)).thenReturn(List.of(notification));

        mockMvc = standaloneSetup(notificationController).build();

        mockMvc.perform(get("/notifications/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message", is("User Notification")));
    }

    @Test
    public void testCreateNotification() throws Exception {
        Notification notification = new Notification();
        notification.setTitle("Title Notification");
        notification.setMessage("Create Test");
        notification.setUserId(1L);
        when(notificationService.createNotification(Mockito.<Notification>any())).thenReturn(notification);

        mockMvc = standaloneSetup(notificationController).build();

        ObjectMapper objectMapper = new ObjectMapper();
        String notificationJson = objectMapper.writeValueAsString(notification);

        mockMvc.perform(post("/notifications/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(notificationJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Create Test")));
    }

    @Test
    public void testGetNewNotificationsByUserId() throws Exception {
        Notification notification = new Notification();
        notification.setTitle("New Title User Notification");
        notification.setMessage("New User Notification");
        notification.setUserId(1L);
        when(notificationService.getUnreadNotificationsByUserId(1L)).thenReturn(List.of(notification));

        mockMvc = standaloneSetup(notificationController).build();

        mockMvc.perform(get("/notifications/user/new/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message", is("New User Notification")));
    }

    @Test
    public void testMarkNotificationAsRead() throws Exception {
        mockMvc = standaloneSetup(notificationController).build();

        Long notificationId = 1L;
        Map<String, Boolean> requestBody = new HashMap<>();
        requestBody.put("isRead", true);
        String requestBodyJson = new ObjectMapper().writeValueAsString(requestBody);

        mockMvc.perform(put("/notifications/{notificationId}/read", notificationId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBodyJson))
                .andExpect(status().isOk());

        verify(notificationService, times(1)).markNotificationAsRead(notificationId, true);
    }
}
