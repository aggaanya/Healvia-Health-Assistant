package com.healthvia.backend.repository.notification;

import com.healthvia.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications for a user
    List<Notification> findByUserId(Long userId);

    // Get unread notifications
    List<Notification> findByUserIdAndIsReadFalse(Long userId);

    // Count unread notifications (useful for badge)
    long countByUserIdAndIsReadFalse(Long userId);
}