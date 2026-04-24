package com.healthvia.backend.controller.reminder;

import com.healthvia.backend.dto.reminder.*;
import com.healthvia.backend.service.reminder.ReminderServiceInterface;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderServiceInterface reminderService;

    // =========================
    // CREATE REMINDER
    // =========================
    @PostMapping
    public ResponseEntity<MedicationReminderResponseDTO> createReminder(
            @Valid @RequestBody CreateMedicationReminderRequestDTO request) {

        MedicationReminderResponseDTO response = reminderService.createReminder(request);

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET ALL REMINDERS (CURRENT USER)
    // =========================
    @GetMapping
    public ResponseEntity<List<MedicationReminderResponseDTO>> getMyReminders() {

        List<MedicationReminderResponseDTO> reminders = reminderService.getMyReminders();

        return ResponseEntity.ok(reminders);
    }

    // =========================
    // GET REMINDER BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<MedicationReminderResponseDTO> getReminderById(
            @PathVariable Long id) {

        MedicationReminderResponseDTO reminder = reminderService.getReminderById(id);

        return ResponseEntity.ok(reminder);
    }

    // =========================
    // UPDATE REMINDER
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<MedicationReminderResponseDTO> updateReminder(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMedicationReminderRequestDTO request) {

        MedicationReminderResponseDTO updated =
                reminderService.updateReminder(id, request);

        return ResponseEntity.ok(updated);
    }

    // =========================
    // DELETE REMINDER
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReminder(@PathVariable Long id) {

        reminderService.deleteReminder(id);

        return ResponseEntity.ok("Reminder deleted successfully");
    }
}