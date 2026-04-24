package com.healthvia.backend.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YearlyProgressDTO {
    private Integer year;
    private Integer totalActiveDays;
    private Double totalExerciseHours;
    private Double totalHydrationLiters;
    private Double averageScore;
    private List<String> topAchievementsEarned;
    private String month;
    private double averageValue;
}
