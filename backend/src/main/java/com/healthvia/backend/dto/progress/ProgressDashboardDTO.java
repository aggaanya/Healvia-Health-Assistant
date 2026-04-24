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
public class ProgressDashboardDTO {
    private HealthScoreDTO healthScore;
    private StreakStatsDTO streakStats;
    private WeeklyProgressDTO weeklyProgress;
    private MonthlyProgressDTO monthlyProgress;
    private YearlyProgressDTO yearlyProgress;
    private List<MetricTrendDTO> metricTrends;
    private List<AchievementDTO> recentAchievements;
    private List<HealthInsightDTO> insights;
    private double averageValue;
    private int totalEntries;
}
