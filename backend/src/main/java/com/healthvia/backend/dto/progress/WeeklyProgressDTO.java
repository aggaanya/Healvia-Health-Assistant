package com.healthvia.backend.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyProgressDTO {
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private Integer daysActive;
    private Integer goalsMet;
    private Double avgSleepHours;
    private Double avgHydrationLiters;
    private Double avgExerciseMinutes;
    private String day;
    private double averageValue;
}
