package com.healthvia.backend.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistory extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //this is the id of the user for the chatHistory
    private Long id;

    // Relationship with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    //user input
    private String userMessage;

    @Column(nullable = false, columnDefinition = "TEXT")
    //ai response
    private String aiResponse;

    @Column(nullable = false, updatable = false)
    //when the convo started
    private LocalDateTime timestamp;
}