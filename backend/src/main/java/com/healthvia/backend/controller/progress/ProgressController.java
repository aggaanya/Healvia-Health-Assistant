package com.healthvia.backend.controller.progress;

import com.healthvia.backend.dto.progress.*;
import com.healthvia.backend.service.progress.ProgressService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Slf4j
public class ProgressController {
    private final ProgressService progressService;

    // ADD HEALTH DATA
    @PostMapping
    public ResponseEntity<HealthProgressResponseDTO> addHealthProgress(Authentication authentication, @Valid @RequestBody CreateHealthProgressRequestDTO request) {
        Long userId = getUserId(authentication);
        log.info("POST /progress for userId: {}", userId);
        return ResponseEntity.ok(progressService.addHealthProgress(userId, request));
    }
    // DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<ProgressDashboardDTO> getDashboard(Authentication authentication) {
        Long userId = getUserId(authentication);
        log.info("GET /dashboard for userId: {}", userId);
        return ResponseEntity.ok(progressService.getDashboard(userId));
    }
    // WEEKLY
    @GetMapping("/weekly")
    public ResponseEntity<List<WeeklyProgressDTO>> getWeeklyProgress(Authentication authentication) {
        Long userId = getUserId(authentication);
        log.info("GET /weekly for userId: {}", userId);
        return ResponseEntity.ok(progressService.getWeeklyProgress(userId));
    }

    // =========================
    // MONTHLY
    // =========================

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyProgressDTO>> getMonthlyProgress(Authentication authentication) {

        Long userId = getUserId(authentication);

        log.info("GET /monthly for userId: {}", userId);

        return ResponseEntity.ok(progressService.getMonthlyProgress(userId));
    }

    // =========================
    // YEARLY
    // =========================

    @GetMapping("/yearly")
    public ResponseEntity<List<YearlyProgressDTO>> getYearlyProgress(Authentication authentication) {

        Long userId = getUserId(authentication);

        log.info("GET /yearly for userId: {}", userId);

        return ResponseEntity.ok(progressService.getYearlyProgress(userId));
    }

    // =========================
    // HEALTH SCORE
    // =========================

    @GetMapping("/score")
    public ResponseEntity<HealthScoreDTO> getHealthScore(Authentication authentication) {

        Long userId = getUserId(authentication);

        log.info("GET /score for userId: {}", userId);

        return ResponseEntity.ok(progressService.getHealthScore(userId));
    }

    // =========================
    // STREAK
    // =========================

    @GetMapping("/streak")
    public ResponseEntity<StreakStatsDTO> getStreakStats(Authentication authentication) {

        Long userId = getUserId(authentication);

        log.info("GET /streak for userId: {}", userId);

        return ResponseEntity.ok(progressService.getStreakStats(userId));
    }

    // =========================
    // INSIGHTS
    // =========================

    @GetMapping("/insights")
    public ResponseEntity<List<HealthInsightDTO>> getHealthInsights(Authentication authentication) {

        Long userId = getUserId(authentication);

        log.info("GET /insights for userId: {}", userId);

        return ResponseEntity.ok(progressService.getHealthInsights(userId));
    }

    // =========================
    // ACHIEVEMENTS
    // =========================

    @GetMapping("/achievements")
    public ResponseEntity<List<AchievementDTO>> getAchievements(Authentication authentication) {

        Long userId = getUserId(authentication);

        log.info("GET /achievements for userId: {}", userId);

        return ResponseEntity.ok(progressService.getAchievements(userId));
    }

    // =========================
    // HELPER METHOD
    // =========================

    private Long getUserId(Authentication authentication) {

        String email = authentication.getName();

        // Make sure this exists in service
        return progressService.getUserIdByEmail(email);
    }
}