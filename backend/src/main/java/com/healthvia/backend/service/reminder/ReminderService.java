package com.healthvia.backend.service.reminder;

import com.healthvia.backend.dto.reminder.*;
import com.healthvia.backend.entity.MedicationReminder;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.ResourceNotFoundException;
import com.healthvia.backend.exception.UnauthorizedException;
import com.healthvia.backend.repository.reminder.ReminderRepository;
import com.healthvia.backend.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReminderService implements ReminderServiceInterface {

    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    private static final String USER_NOT_FOUND = "User not found";
    private static final String REMINDER_NOT_FOUND = "Reminder not found";
    private static final String UNAUTHORIZED = "Unauthorized access";

    // =========================
    // GET CURRENT USER (JWT)
    // =========================
    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        log.debug("Fetching userId for email: {}", email);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND))
                .getId();
    }

    private User getCurrentUser() {
        Long userId = getCurrentUserId();

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public MedicationReminderResponseDTO createReminder(CreateMedicationReminderRequestDTO request) {

        User user = getCurrentUser();

        log.info("Creating reminder for userId: {}", user.getId());

        MedicationReminder reminder = MedicationReminder.builder()
                .user(user)
                .medicationName(request.getMedicationName())
                .daysOfWeek(request.getDaysOfWeek())
                .continuous(request.getContinuous())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .numberOfDays(request.getNumberOfDays())
                .build();

        reminderRepository.save(reminder);

        log.info("Reminder created with id: {}", reminder.getId());

        return mapToDTO(reminder);
    }

    // =========================
    // READ ALL
    // =========================
    @Override
    @Transactional(readOnly = true)
    public List<MedicationReminderResponseDTO> getMyReminders() {

        Long userId = getCurrentUserId();

        log.info("Fetching reminders for userId: {}", userId);

        return reminderRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // =========================
    // READ BY ID
    // =========================
    @Override
    @Transactional(readOnly = true)
    public MedicationReminderResponseDTO getReminderById(Long reminderId) {

        Long userId = getCurrentUserId();

        MedicationReminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException(REMINDER_NOT_FOUND));

        validateOwnership(userId, reminder);

        return mapToDTO(reminder);
    }

    // =========================
    // UPDATE
    // =========================
    @Override
    public MedicationReminderResponseDTO updateReminder(Long reminderId,
                                                        UpdateMedicationReminderRequestDTO request) {

        Long userId = getCurrentUserId();

        MedicationReminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException(REMINDER_NOT_FOUND));

        validateOwnership(userId, reminder);

        log.info("Updating reminderId: {}", reminderId);

        reminder.setMedicationName(request.getMedicationName());
        reminder.setDaysOfWeek(request.getDaysOfWeek());
        reminder.setContinuous(request.getContinuous());
        reminder.setStartDate(request.getStartDate());
        reminder.setEndDate(request.getEndDate());
        reminder.setNumberOfDays(request.getNumberOfDays());

        return mapToDTO(reminder);
    }

    // =========================
    // DELETE
    // =========================
    @Override
    public void deleteReminder(Long reminderId) {

        Long userId = getCurrentUserId();

        MedicationReminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException(REMINDER_NOT_FOUND));

        validateOwnership(userId, reminder);

        log.warn("Deleting reminderId: {}", reminderId);

        reminderRepository.delete(reminder);
    }

    // =========================
    // SECURITY
    // =========================
    private void validateOwnership(Long userId, MedicationReminder reminder) {

        // FIXED ❗ (no equals on long)
        if (reminder.getUser().getId() != userId) {
            log.warn("Unauthorized access attempt for reminderId: {}", reminder.getId());
            throw new UnauthorizedException(UNAUTHORIZED);
        }
    }

    // =========================
    // MAPPER
    // =========================
    private MedicationReminderResponseDTO mapToDTO(MedicationReminder reminder) {
        return MedicationReminderResponseDTO.builder()
                .id(reminder.getId())
                .medicationName(reminder.getMedicationName())
                .daysOfWeek(reminder.getDaysOfWeek())
                .continuous(reminder.getContinuous())
                .startDate(reminder.getStartDate())
                .endDate(reminder.getEndDate())
                .build();
    }
}