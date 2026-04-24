package com.healthvia.backend.dto.progress;




import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateHealthProgressRequestDTO {

    @NotBlank(message = "Metric type is required")
    @Size(max = 50, message = "Metric type cannot exceed 50 characters")
    private String metricType;

    @NotBlank(message = "Value is required")
    @Size(max = 50, message = "Value cannot exceed 50 characters")
    private double value;

}

//Frontend
//   ↓
//POST /progress
//   ↓
//CreateHealthProgressRequestDTO
//   ↓
//HealthProgressController
//   ↓
//HealthProgressService
//   ↓
//HealthProgressRepository
//   ↓
//Database