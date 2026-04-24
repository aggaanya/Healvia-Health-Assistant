package com.healthvia.backend.dto.reminder;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.util.List;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMedicationReminderRequestDTO {
    @NotBlank(message = "Medication name is required")
    private String medicationName;

    // e.g. ["MONDAY", "WEDNESDAY"]
    private List<String> daysOfWeek;

    @NotNull(message = "Continuous flag is required")
    private Boolean continuous;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    @Min(1)
    private Integer numberOfDays;
}


//Frontend
//   ↓
//POST /reminders
//   ↓
//CreateMedicationReminderRequestDTO
//   ↓
//ReminderController
//   ↓
//ReminderService
//   ↓
//MedicationReminder Entity
//   ↓
//MedicationReminderRepository
//   ↓
//Database