package com.healthvia.backend.dto.progress;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthProgressResponseDTO {

    private Long id;

    private String metricType;

    private double value;

    private LocalDateTime recordedAt;

}

// Database
// ↓
// HealthProgress Entity
// ↓
// HealthProgressService
// ↓
// HealthProgressResponseDTO
// ↓
// HealthProgressController
// ↓
// Frontend