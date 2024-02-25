package com.ap.steelduxxklantenportaal.repositories;

import com.ap.steelduxxklantenportaal.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}