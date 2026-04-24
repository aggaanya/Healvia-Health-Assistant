package com.healthvia.backend.service.notification;


import com.healthvia.backend.dto.notifications.*;
import com.healthvia.backend.entity.Notification;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.ResourceNotFoundException;
import com.healthvia.backend.exception.UnauthorizedException;
import com.healthvia.backend.repository.notification.NotificationRepository;
import com.healthvia.backend.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService implements NotificationServiceInterface {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // =========================
    // GET CURRENT USER
    // =========================
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // =========================
    // SEND NOTIFICATION
    // =========================
    @Override
    public void sendNotification(NotificationRequestDTO request) {

        User user = getCurrentUser();

        Notification notification = Notification.builder()
                .user(user)
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        log.info("Notification sent to userId: {}", user.getId());
    }

    // =========================
    // APPOINTMENT NOTIFICATION
    // =========================
    @Override
    public void sendAppointmentNotification(String message) {

        sendNotification(NotificationRequestDTO.builder()
                .title("Appointment Update")
                .message(message)
                .type(NotificationType.APPOINTMENT)
                .build());
    }

    // =========================
    // REMINDER NOTIFICATION
    // =========================
    @Override
    public void sendReminderNotification(String message) {

        sendNotification(NotificationRequestDTO.builder()
                .title("Reminder")
                .message(message)
                .type(NotificationType.REMINDER)
                .build());
    }

    // =========================
    // GET USER NOTIFICATIONS
    // =========================
    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getMyNotifications() {

        User user = getCurrentUser();

        return notificationRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // =========================
    // MARK AS READ
    // =========================
    @Override
    public void markAsRead(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        validateOwnership(notification);

        notification.setIsRead(true);
    }

    // =========================
    // DELETE
    // =========================
    @Override
    public void deleteNotification(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        validateOwnership(notification);

        notificationRepository.delete(notification);
    }

    // =========================
    // SECURITY
    // =========================
    private void validateOwnership(Notification notification) {

        Long currentUserId = getCurrentUser().getId();

        if (!Objects.equals(notification.getUser().getId(), currentUserId)) {
            throw new UnauthorizedException("Unauthorized access");
        }
    }

    // =========================
    // MAPPER
    // =========================
    private NotificationResponseDTO mapToDTO(Notification notification) {
        return NotificationResponseDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}