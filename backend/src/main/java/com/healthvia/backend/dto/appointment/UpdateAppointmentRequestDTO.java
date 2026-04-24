package com.healthvia.backend.dto.appointment;


import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAppointmentRequestDTO {

    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDate;

    private LocalDateTime reminderTime;

    private String status;

    private LocalDateTime AppointmentDateTime;

}