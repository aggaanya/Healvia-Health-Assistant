package com.healthvia.backend.service.appointment;


import com.healthvia.backend.dto.appointment.*;
import com.healthvia.backend.entity.Appointment;
import com.healthvia.backend.entity.AppointmentStatus;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.ResourceNotFoundException;
import com.healthvia.backend.exception.UserNotFoundException;
import com.healthvia.backend.repository.appointment.AppointmentRepository;
import com.healthvia.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AppointmentService implements AppointmentServiceInterface {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    // CREATE

    @Override
    public AppointmentResponseDTO createAppointment(Long userId, CreateAppointmentRequestDTO request) {
        log.info("Creating appointment for userId: {}", userId);
        validateAppointmentDate(request.getAppointmentDateTime());
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        Appointment appointment = Appointment.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .appointmentDateTime(request.getAppointmentDateTime())
                .status(AppointmentStatus.SCHEDULED)
                .createdAt(LocalDateTime.now())
                .build();
        appointmentRepository.save(appointment);
        log.info("Appointment created with id: {}", appointment.getId());
        return mapToDTO(appointment);
    }

    // =========================
    // READ
    // =========================

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getUserAppointments(Long userId) {

        log.info("Fetching all appointments for userId: {}", userId);

        return appointmentRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getUpcomingAppointments(Long userId) {

        log.info("Fetching upcoming appointments for userId: {}", userId);

        return appointmentRepository
                .findByUser_IdAndAppointmentDateTimeAfter(userId, LocalDateTime.now())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDTO getAppointmentById(Long userId, Long appointmentId) {

        log.info("Fetching appointment {} for userId: {}", appointmentId, userId);

        Appointment appointment = getAppointmentOrThrow(appointmentId);

        validateOwnership(userId, appointment);

        return mapToDTO(appointment);
    }

    // =========================
    // UPDATE
    // =========================

    @Override
    public AppointmentResponseDTO updateAppointment(Long userId, Long appointmentId, UpdateAppointmentRequestDTO request) {

        log.info("Updating appointment {} for userId: {}", appointmentId, userId);

        Appointment appointment = getAppointmentOrThrow(appointmentId);

        validateOwnership(userId, appointment);
        validateAppointmentDate(request.getAppointmentDateTime());

        appointment.setTitle(request.getTitle());
        appointment.setDescription(request.getDescription());
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());

        return mapToDTO(appointment);
    }
    // DELETE / CANCEL
    @Override
    public void cancelAppointment(Long userId, Long appointmentId) {

        log.info("Cancelling appointment {} for userId: {}", appointmentId, userId);

        Appointment appointment = getAppointmentOrThrow(appointmentId);

        validateOwnership(userId, appointment);

        appointment.setStatus(AppointmentStatus.CANCELLED);
    }

    // HELPER METHODS

    private Appointment getAppointmentOrThrow(Long appointmentId) {

        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    private void validateOwnership(Long userId, Appointment appointment) {

        if (appointment.getUser() == null ||
                !Objects.equals(appointment.getUser().getId(), userId)) {

            throw new IllegalStateException("Unauthorized access to appointment");
        }
    }

    private void validateAppointmentDate(LocalDateTime dateTime) {

        if (dateTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment cannot be in the past");
        }
    }

    private AppointmentResponseDTO mapToDTO(Appointment appointment) {

        return AppointmentResponseDTO.builder()
                .id(appointment.getId())
                .title(appointment.getTitle())
                .description(appointment.getDescription())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .status(appointment.getStatus().name())
                .build();
    }
}