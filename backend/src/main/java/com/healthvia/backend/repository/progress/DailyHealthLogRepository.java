package com.healthvia.backend.repository.progress;


import com.healthvia.backend.entity.DailyHealthLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyHealthLogRepository extends JpaRepository<DailyHealthLog, Long> {

    List<DailyHealthLog> findByUserId(Long userId);

    Optional<DailyHealthLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);
    Optional<DailyHealthLog> findByUserIdAndDate(Long userId, LocalDate date);

}