package com.healthvia.backend.controller.notification;

import com.healthvia.backend.dto.notifications.NotificationRequestDTO;
import com.healthvia.backend.dto.notifications.NotificationResponseDTO;
import com.healthvia.backend.service.notification.NotificationServiceInterface;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationServiceInterface notificationService;

    // =========================
    // SEND NOTIFICATION
    // =========================
    @PostMapping
    public ResponseEntity<?> sendNotification(
            @Valid @RequestBody NotificationRequestDTO request) {

        notificationService.sendNotification(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "message", "Notification sent successfully",
                        "timestamp", LocalDateTime.now()
                )
        );
    }

    // =========================
    // GET ALL NOTIFICATIONS
    // =========================
    @GetMapping
    public ResponseEntity<?> getMyNotifications() {

        List<NotificationResponseDTO> data = notificationService.getMyNotifications();

        return ResponseEntity.ok(
                Map.of(
                        "message", "Notifications fetched successfully",
                        "data", data,
                        "count", data.size(),
                        "timestamp", LocalDateTime.now()
                )
        );
    }

    // =========================
    // MARK AS READ
    // =========================
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {

        notificationService.markAsRead(id);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Notification marked as read",
                        "timestamp", LocalDateTime.now()
                )
        );
    }

    // =========================
    // DELETE NOTIFICATION
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {

        notificationService.deleteNotification(id);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Notification deleted successfully",
                        "timestamp", LocalDateTime.now()
                )
        );
    }
}