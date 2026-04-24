package com.healthvia.backend.dto.reminder;


import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationReminderResponseDTO {

    private Long id;

    private String medicationName;

    private List<String> daysOfWeek;

    private Boolean continuous;

    private LocalDate startDate;

    private LocalDate endDate;



}

//Database
//   ↓
//MedicationReminder Entity
//   ↓
//ReminderService
//   ↓
//MedicationReminderResponseDTO
//   ↓
//ReminderController
//   ↓
//Frontend