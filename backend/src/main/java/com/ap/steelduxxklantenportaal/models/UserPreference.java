package com.ap.steelduxxklantenportaal.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "userpreferences")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "system_notification_order_status")
    private boolean systemNotificationOrderStatus = true;

    @Column(name = "email_notification_order_status")
    private boolean emailNotificationOrderStatus = true;

    @Column(name = "system_notification_order_request")
    private boolean systemNotificationOrderRequest = true;

    @Column(name = "email_notification_order_request")
    private boolean emailNotificationOrderRequest = true;

    public UserPreference(Long userId) {
        this.userId = userId;
        this.systemNotificationOrderStatus = true;
        this.emailNotificationOrderStatus = true;
        this.systemNotificationOrderRequest = true;
        this.emailNotificationOrderRequest = true;
    }
}