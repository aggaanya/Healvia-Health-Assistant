package com.healthvia.backend.service.notification;


import com.healthvia.backend.dto.notifications.NotificationRequestDTO;
import com.healthvia.backend.dto.notifications.NotificationResponseDTO;

import java.util.List;

public interface NotificationServiceInterface {

    void sendNotification(NotificationRequestDTO request);

    void sendAppointmentNotification(String message);

    void sendReminderNotification(String message);

    List<NotificationResponseDTO> getMyNotifications();

    void markAsRead(Long notificationId);

    void deleteNotification(Long notificationId);
}
