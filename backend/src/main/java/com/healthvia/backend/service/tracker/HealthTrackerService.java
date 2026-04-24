package com.healthvia.backend.service.tracker;

import com.healthvia.backend.dto.tracker.CreateDailyHealthLogRequestDTO;
import com.healthvia.backend.dto.tracker.DailyHealthLogResponseDTO;
import com.healthvia.backend.entity.DailyHealthLog;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.ResourceNotFoundException;
import com.healthvia.backend.exception.UnauthorizedException;
import com.healthvia.backend.repository.progress.DailyHealthLogRepository;
import com.healthvia.backend.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HealthTrackerService implements HealthTrackerServiceInterface {

    private final DailyHealthLogRepository logRepository;
    private final UserRepository userRepository;

    private static final String USER_NOT_FOUND = "User not found";
    private static final String LOG_NOT_FOUND = "Health log not found";
    private static final String UNAUTHORIZED = "Unauthorized access";

    // =========================
    // GET CURRENT USER
    // =========================
    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND))
                .getId();
    }

    private User getCurrentUser() {
        return userRepository.findById(getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public DailyHealthLogResponseDTO createDailyLog(CreateDailyHealthLogRequestDTO request) {

        User user = getCurrentUser();

        DailyHealthLog logEntity = DailyHealthLog.builder()
                .user(user) // ✅ FIXED
                .logDate(request.getLogDate())
                .medicationsTaken(request.getMedicationsTaken())
                .sideEffects(request.getSideEffects())
                .symptoms(request.getSymptoms())
                .exercise(request.getExercise())
                .sleepHours(request.getSleepHours())
                .waterIntakeLiters(request.getWaterIntakeLiters())
                .additionalNotes(request.getAdditionalNotes())
                .build();

        logRepository.save(logEntity);

        return mapToDTO(logEntity);
    }

    // =========================
    // READ ALL
    // =========================
    @Override
    @Transactional(readOnly = true)
    public List<DailyHealthLogResponseDTO> getMyLogs() {

        return logRepository.findByUserId(getCurrentUserId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // =========================
    // READ BY DATE
    // =========================
    @Override
    @Transactional(readOnly = true)
    public DailyHealthLogResponseDTO getLogByDate(LocalDate date) {

        DailyHealthLog logEntity = logRepository
                .findByUserIdAndLogDate(getCurrentUserId(), date) // ✅ FIXED
                .orElseThrow(() -> new ResourceNotFoundException(LOG_NOT_FOUND));

        return mapToDTO(logEntity);
    }

    // =========================
    // UPDATE
    // =========================
    @Override
    public DailyHealthLogResponseDTO updateDailyLog(Long logId,
                                                    CreateDailyHealthLogRequestDTO request) {

        DailyHealthLog logEntity = logRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException(LOG_NOT_FOUND));

        validateOwnership(logEntity);

        logEntity.setLogDate(request.getLogDate());
        logEntity.setMedicationsTaken(request.getMedicationsTaken());
        logEntity.setSideEffects(request.getSideEffects());
        logEntity.setSymptoms(request.getSymptoms());
        logEntity.setExercise(request.getExercise());
        logEntity.setSleepHours(request.getSleepHours());
        logEntity.setWaterIntakeLiters(request.getWaterIntakeLiters());
        logEntity.setAdditionalNotes(request.getAdditionalNotes());

        return mapToDTO(logEntity);
    }

    // =========================
    // DELETE
    // =========================
    @Override
    public void deleteDailyLog(Long logId) {

        DailyHealthLog logEntity = logRepository.findById(logId)
                .orElseThrow(() -> new ResourceNotFoundException(LOG_NOT_FOUND));

        validateOwnership(logEntity);

        logRepository.delete(logEntity);
    }

    // =========================
    // SECURITY
    // =========================
    private void validateOwnership(DailyHealthLog log) {
        Long currentUserId = getCurrentUserId();

        if (!Objects.equals(log.getUser().getId(), currentUserId)) {
            throw new UnauthorizedException("Unauthorized access");
        }
    }

    // =========================
    // MAPPER
    // =========================
    private DailyHealthLogResponseDTO mapToDTO(DailyHealthLog log) {
        return DailyHealthLogResponseDTO.builder()
                .id(log.getId())
                .logDate(log.getLogDate()) // ✅ FIXED
                .medicationsTaken(log.getMedicationsTaken())
                .sideEffects(log.getSideEffects())
                .symptoms(log.getSymptoms())
                .exercise(log.getExercise())
                .sleepHours(log.getSleepHours())
                .waterIntakeLiters(log.getWaterIntakeLiters())
                .additionalNotes(log.getAdditionalNotes())
                .build();
    }
}