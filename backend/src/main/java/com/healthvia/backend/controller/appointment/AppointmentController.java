package com.healthvia.backend.controller.appointment;

import com.healthvia.backend.dto.appointment.*;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.repository.user.UserRepository;
import com.healthvia.backend.service.appointment.AppointmentService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // =========================
    // HELPER (JWT → USER)
    // =========================

    private Long getCurrentUserId() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }

    // =========================
    // CREATE
    // =========================

    @PostMapping
    public AppointmentResponseDTO createAppointment(
            @RequestBody CreateAppointmentRequestDTO request) {

        Long userId = getCurrentUserId();

        return appointmentService.createAppointment(userId, request);
    }

    // =========================
    // READ
    // =========================

    @GetMapping
    public List<AppointmentResponseDTO> getUserAppointments() {

        Long userId = getCurrentUserId();

        return appointmentService.getUserAppointments(userId);
    }

    @GetMapping("/upcoming")
    public List<AppointmentResponseDTO> getUpcomingAppointments() {

        Long userId = getCurrentUserId();

        return appointmentService.getUpcomingAppointments(userId);
    }

    @GetMapping("/{appointmentId}")
    public AppointmentResponseDTO getAppointmentById(
            @PathVariable Long appointmentId) {

        Long userId = getCurrentUserId();

        return appointmentService.getAppointmentById(userId, appointmentId);
    }

    // =========================
    // UPDATE
    // =========================

    @PutMapping("/{appointmentId}")
    public AppointmentResponseDTO updateAppointment(
            @PathVariable Long appointmentId,
            @RequestBody UpdateAppointmentRequestDTO request) {

        Long userId = getCurrentUserId();

        return appointmentService.updateAppointment(userId, appointmentId, request);
    }

    // =========================
    // DELETE / CANCEL
    // =========================

    @DeleteMapping("/{appointmentId}")
    public void cancelAppointment(@PathVariable Long appointmentId) {

        Long userId = getCurrentUserId();

        appointmentService.cancelAppointment(userId, appointmentId);
    }
}