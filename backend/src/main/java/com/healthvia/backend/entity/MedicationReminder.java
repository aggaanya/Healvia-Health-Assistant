package com.healthvia.backend.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

//this is powers the reminder tab, fields it have medication name, days of week, start date, end date, number of days, continuous flag
@Entity
@Table(name = "medication_reminders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationReminder extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String medicationName;

    // Stores selected days
    @ElementCollection
    @CollectionTable(
            name = "medication_reminder_days",
            joinColumns = @JoinColumn(name = "reminder_id")
    )
    @Column(name = "day_of_week")
    private List<String> daysOfWeek;

    @Column(nullable = false)
    private Boolean continuous;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer numberOfDays;

}
