package com.healthvia.backend.dto.tracker;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyHealthLogResponseDTO {

    private Long id;

    private LocalDate logDate;

    private String medicationsTaken;

    private String sideEffects;

    private String symptoms;

    private String exercise;

    private Double sleepHours;

    private Double waterIntakeLiters;

    private String additionalNotes;

}

//Database
//   ↓
//DailyHealthLog Entity
//   ↓
//HealthLogService
//   ↓
//DailyHealthLogResponseDTO
//   ↓
//HealthLogController
//   ↓
//Frontend