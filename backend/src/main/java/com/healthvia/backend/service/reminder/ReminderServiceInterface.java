package com.healthvia.backend.service.reminder;

import com.healthvia.backend.dto.reminder.*;

import java.util.List;

public interface ReminderServiceInterface {
    MedicationReminderResponseDTO createReminder(CreateMedicationReminderRequestDTO request);

    List<MedicationReminderResponseDTO> getMyReminders();

    MedicationReminderResponseDTO getReminderById(Long reminderId);

    MedicationReminderResponseDTO updateReminder(Long reminderId, UpdateMedicationReminderRequestDTO request);

    void deleteReminder(Long reminderId);
}