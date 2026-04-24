package com.healthvia.backend.service.progress;

import com.healthvia.backend.dto.progress.*;
import com.healthvia.backend.entity.HealthProgress;

import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.UserNotFoundException;
import com.healthvia.backend.repository.progress.HealthProgressRepository;
import com.healthvia.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProgressService implements  ProgressServiceInterface{

    private final HealthProgressRepository progressRepository;
    private final UserRepository userRepository;
    // ADD PROGRESS

    @Override
    @Transactional
    public HealthProgressResponseDTO addHealthProgress(Long userId, CreateHealthProgressRequestDTO request) {
        log.info("Adding health progress for userId: {}", userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        HealthProgress progress = HealthProgress.builder()
                .user(user)
                .metricType(request.getMetricType())
                .value(request.getValue())
                .recordedAt(LocalDateTime.now())
                .build();

        progressRepository.save(progress);

        log.info("Health progress saved for userId: {}", userId);

        return mapToResponseDTO(progress);
    }
    // DASHBOARD
    @Override
    public ProgressDashboardDTO getDashboard(Long userId) {
        log.info("Fetching dashboard for userId: {}", userId);
        List<HealthProgress> data = getUserProgress(userId);
        double avg = calculateAverage(data);
        return ProgressDashboardDTO.builder().averageValue(avg).totalEntries(data.size()).build();
    }
    // WEEKLY
    @Override
    public List<WeeklyProgressDTO> getWeeklyProgress(Long userId) {
        log.info("Fetching weekly progress for userId: {}", userId);
        List<HealthProgress> data = getUserProgress(userId);
        return data.stream().collect(Collectors.groupingBy(p -> p.getRecordedAt().getDayOfWeek())).entrySet().stream().map(entry -> WeeklyProgressDTO.builder().day(entry.getKey().toString()).averageValue(calculateAverage(entry.getValue())).build()).toList();
    }

    // MONTHLY
    @Override
    public List<MonthlyProgressDTO> getMonthlyProgress(Long userId) {
        log.info("Fetching monthly progress for userId: {}", userId);
        List<HealthProgress> data = getUserProgress(userId);
        return data.stream().collect(Collectors.groupingBy(p -> p.getRecordedAt().getDayOfMonth())).entrySet().stream().map(entry -> MonthlyProgressDTO.builder().day(entry.getKey()).averageValue(calculateAverage(entry.getValue())).build()).toList();
    }
    // YEARLY
    @Override
    public List<YearlyProgressDTO> getYearlyProgress(Long userId) {

        log.info("Fetching yearly progress for userId: {}", userId);

        List<HealthProgress> data = getUserProgress(userId);

        return data.stream()
                .collect(Collectors.groupingBy(p -> p.getRecordedAt().getMonth()))
                .entrySet()
                .stream()
                .map(entry -> YearlyProgressDTO.builder()
                        .month(entry.getKey().toString())
                        .averageValue(calculateAverage(entry.getValue()))
                        .build())
                .toList();
    }

    // HEALTH SCORE
    @Override
    public HealthScoreDTO getHealthScore(Long userId) {
        log.info("Calculating health score for userId: {}", userId);
        List<HealthProgress> data = getUserProgress(userId);
        double avg = calculateAverage(data);
        int score = (int) Math.min(100, avg * 10);
        return HealthScoreDTO.builder().score(score).build();
    }

    // STREAK
    @Override
    public StreakStatsDTO getStreakStats(Long userId) {

        log.info("Calculating streak stats for userId: {}", userId);

        List<HealthProgress> data = getUserProgress(userId);

        Set<String> uniqueDays = data.stream()
                .map(p -> p.getRecordedAt().toLocalDate().toString())
                .collect(Collectors.toSet());

        return StreakStatsDTO.builder()
                .currentStreak(uniqueDays.size())
                .build();
    }

    // INSIGHTS
    @Override
    public List<HealthInsightDTO> getHealthInsights(Long userId) {

        log.info("Fetching health insights for userId: {}", userId);

        return List.of(HealthInsightDTO.builder().title("Hydration").message("Increase water intake").build(), HealthInsightDTO.builder().title("Sleep").message("Try to sleep 7-8 hours daily").build());
    }

    // ACHIEVEMENTS
    @Override
    public List<AchievementDTO> getAchievements(Long userId) {
        log.info("Fetching achievements for userId: {}", userId);
        return List.of(AchievementDTO.builder().title("7 Day Streak").description("Completed 7 days tracking").achieved(true).build(), AchievementDTO.builder().title("First Entry").description("Logged first health data").achieved(true).build());
    }

    // HELPER METHODS
    private List<HealthProgress> getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    private double calculateAverage(List<HealthProgress> data) {
        return data.stream()
                .mapToDouble(HealthProgress::getValue)
                .average()
                .orElse(0);
    }

    private HealthProgressResponseDTO mapToResponseDTO(HealthProgress progress) {
        return HealthProgressResponseDTO.builder().metricType(progress.getMetricType()).value(progress.getValue()).recordedAt(progress.getRecordedAt()).build();
    }
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found with email: " + email)).getId();
    }
}