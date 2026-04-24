package com.healthvia.backend.service.progress;


import com.healthvia.backend.dto.progress.*;

import java.util.List;

//ProgressService is a service interface responsible for handling
//all health analytics and user progress tracking logic.
//It provides methods to calculate and retrieve user progress data
//such as weekly, monthly, and yearly trends, health scores,
//streak statistics, achievements, and AI-based health insights.



public interface ProgressServiceInterface {
    // CREATE / TRACK PROGRESS
    HealthProgressResponseDTO addHealthProgress(Long userId, CreateHealthProgressRequestDTO request);
    // DASHBOARD
    ProgressDashboardDTO getDashboard(Long userId);
    // TIME-BASED ANALYTICS
    List<WeeklyProgressDTO> getWeeklyProgress(Long userId);
    List<MonthlyProgressDTO> getMonthlyProgress(Long userId);
    List<YearlyProgressDTO> getYearlyProgress(Long userId);
    // HEALTH METRICS
    HealthScoreDTO getHealthScore(Long userId);
    StreakStatsDTO getStreakStats(Long userId);
    // INSIGHTS & ACHIEVEMENTS
    List<HealthInsightDTO> getHealthInsights(Long userId);
    List<AchievementDTO> getAchievements(Long userId);
}