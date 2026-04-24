package com.healthvia.backend.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthInsightDTO {
    private String type; // e.g. "SLEEP", "EXERCISE"
    private String title;
    private String message;
    private String priority; // e.g. "HIGH", "MEDIUM", "INFO"
    private LocalDateTime generatedAt;
}
