package com.healthvia.backend.service.tracker;

import com.healthvia.backend.dto.tracker.CreateDailyHealthLogRequestDTO;
import com.healthvia.backend.dto.tracker.DailyHealthLogResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface HealthTrackerServiceInterface {
    // =========================
    // CREATE
    // =========================
    DailyHealthLogResponseDTO createDailyLog(CreateDailyHealthLogRequestDTO request);

    // =========================
    // READ
    // =========================
    List<DailyHealthLogResponseDTO> getMyLogs();

    DailyHealthLogResponseDTO getLogByDate(LocalDate date);

    // =========================
    // UPDATE
    // =========================
    DailyHealthLogResponseDTO updateDailyLog(Long logId,
                                             CreateDailyHealthLogRequestDTO request);

    // =========================
    // DELETE
    // =========================
    void deleteDailyLog(Long logId);
}

