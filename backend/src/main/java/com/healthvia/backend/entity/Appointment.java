package com.healthvia.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //appointment id
    private Long id;

    // Relationship with User, 1 user can have multiple Appointments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    //this tells what is  the Appointment title (fever, operation, eye...)
    private String title;

    @Column(length = 1000)
    //details
    private String description;

    @Column(nullable = false)
    //Appointment date of the user/ owner
    private LocalDateTime appointmentDateTime;

    private LocalDateTime reminderTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    private LocalDateTime createdAt;
}