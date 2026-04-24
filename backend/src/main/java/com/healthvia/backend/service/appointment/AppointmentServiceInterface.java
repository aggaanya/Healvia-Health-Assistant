package com.healthvia.backend.service.appointment;

import com.healthvia.backend.dto.appointment.AppointmentResponseDTO;
import com.healthvia.backend.dto.appointment.CreateAppointmentRequestDTO;
import com.healthvia.backend.dto.appointment.UpdateAppointmentRequestDTO;

import java.util.List;

//AppointmentService is a service interface responsible for handling
//all appointment-related business logic in the system.
//
//It manages operations such as booking appointments, retrieving user
//appointments, updating schedules, and cancelling appointments.


public interface AppointmentServiceInterface {

    AppointmentResponseDTO createAppointment(Long userId, CreateAppointmentRequestDTO request);

    List<AppointmentResponseDTO> getUserAppointments(Long userId);

    List<AppointmentResponseDTO> getUpcomingAppointments(Long userId);

    AppointmentResponseDTO getAppointmentById(Long userId, Long appointmentId);

    AppointmentResponseDTO updateAppointment(Long userId, Long appointmentId, UpdateAppointmentRequestDTO request);

    void cancelAppointment(Long userId, Long appointmentId);
}