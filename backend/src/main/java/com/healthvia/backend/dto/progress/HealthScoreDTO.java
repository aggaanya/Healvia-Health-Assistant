package com.healthvia.backend.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthScoreDTO {
    private Double overallScore;
    private Integer sleepScore;
    private Integer exerciseScore;
    private Integer hydrationScore;
    private Integer moodScore;
    private LocalDateTime lastCalculated;
    private int score;
}
