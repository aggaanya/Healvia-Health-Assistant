package com.healthvia.backend.dto.appointment;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponseDTO {

    private Long id;

    private String title;

    private String description;

    private LocalDateTime appointmentDateTime;

    private String status;

}