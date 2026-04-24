package com.healthvia.backend.dto.reminder;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateMedicationReminderRequestDTO {

    @NotBlank(message = "Medication name is required")
    private String medicationName;

    private List<String> daysOfWeek;

    @NotNull(message = "Continuous flag is required")
    private Boolean continuous;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private Integer numberOfDays;
}