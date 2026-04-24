package com.healthvia.backend.utility;

import com.healthvia.backend.dto.progress.CreateHealthProgressRequestDTO;
import com.healthvia.backend.dto.progress.HealthProgressResponseDTO;
import com.healthvia.backend.entity.HealthProgress;
import com.healthvia.backend.entity.User;

public class HealthProgressMapper {

    private HealthProgressMapper() {
        // Utility class
    }

    public static HealthProgress toEntity(CreateHealthProgressRequestDTO dto, User user) {
        if (dto == null) {
            return null;
        }

        return HealthProgress.builder().user(user).metricType(dto.getMetricType()).value(dto.getValue()).build();
    }

    public static HealthProgressResponseDTO toResponseDTO(HealthProgress entity) {
        if (entity == null) {
            return null;
        }

        return HealthProgressResponseDTO.builder().id(entity.getId()).metricType(entity.getMetricType()).value(entity.getValue()).recordedAt(entity.getRecordedAt()).build();
    }
}
