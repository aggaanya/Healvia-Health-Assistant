package com.healthvia.backend.entity;



import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "health_progress")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthProgress extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String metricType;

    @Column(nullable = false)
    //metric value
    private double value;

    public double getValue() {
        return value;
    }

    @Column(nullable = false, updatable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    public void onCreate() {
        if (this.recordedAt == null) {
            this.recordedAt = LocalDateTime.now();
        }
    }
}