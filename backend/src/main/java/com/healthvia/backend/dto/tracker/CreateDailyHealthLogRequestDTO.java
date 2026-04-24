package com.healthvia.backend.dto.tracker;


import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDailyHealthLogRequestDTO {

    @Size(max = 500, message = "Medications taken cannot exceed 500 characters")
    private String medicationsTaken;

    @Size(max = 500, message = "Side effects cannot exceed 500 characters")
    private String sideEffects;

    @Size(max = 1000, message = "Symptoms description cannot exceed 1000 characters")
    private String symptoms;

    @Size(max = 500, message = "Exercise description cannot exceed 500 characters")
    private String exercise;

    @Min(value = 0, message = "Sleep hours cannot be negative")
    @Max(value = 24, message = "Sleep hours cannot exceed 24")
    private Double sleepHours;

    @Min(value = 0, message = "Water intake cannot be negative")
    @Max(value = 20, message = "Water intake value seems unrealistic")
    private Double waterIntakeLiters;

    @Size(max = 1000, message = "Additional notes cannot exceed 1000 characters")
    private String additionalNotes;

    private LocalDate logDate;

}

