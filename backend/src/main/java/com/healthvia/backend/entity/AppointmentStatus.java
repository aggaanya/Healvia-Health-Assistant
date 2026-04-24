package com.healthvia.backend.entity;
import com.healthvia.backend.entity.AppointmentStatus;
import jakarta.persistence.Enumerated;


//instead of storing random strings like :: "done", "cancel", "pending
public enum AppointmentStatus {

    SCHEDULED,
    COMPLETED,
    CANCELLED,
    MISSED
}