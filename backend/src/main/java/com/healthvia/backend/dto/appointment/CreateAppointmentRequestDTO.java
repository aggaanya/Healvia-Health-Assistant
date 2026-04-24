package com.healthvia.backend.dto.appointment;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAppointmentRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Appointment date is required")
    private LocalDateTime appointmentDateTime;
}

//Frontend
//   ↓
//POST /appointments
//   ↓
//CreateAppointmentRequestDTO
//   ↓
//AppointmentController
//   ↓
//AppointmentService
//   ↓
//AppointmentRepository
//   ↓
//Database