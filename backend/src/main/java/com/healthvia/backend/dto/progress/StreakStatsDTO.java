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
public class StreakStatsDTO {
    private Integer currentStreak;
    private Integer longestStreak;
    private LocalDate lastActiveDate;
    private Integer totalActiveDays;
}
