package com.healthvia.backend.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricTrendDTO {
    private String metricType;
    private Double currentAverage;
    private Double previousAverage;
    private Double percentageChange;
    private String trendDirection; // e.g. "UP", "DOWN", "STABLE"
}