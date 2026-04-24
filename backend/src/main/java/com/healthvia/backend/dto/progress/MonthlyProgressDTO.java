package com.healthvia.backend.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyProgressDTO {
    private Integer month;
    private Integer year;
    private Integer totalWorkouts;
    private Double totalExerciseMinutes;
    private Double averageSleepHours;
    private Double averageHydrationLiters;
    private Integer goalsMet;
    private int day;
    private double averageValue;
}
