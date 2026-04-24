package com.healthvia.backend.dto.chat;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatResponseDTO {

    private String userMessage;

    private String aiResponse;

    private LocalDateTime timestamp;

    private String botResponse;

}

//Frontend
//   ↓
//ChatController
//   ↓
//ChatRequestDTO
//   ↓
//ChatService
//   ↓
//AI model generates response
//   ↓
//ChatHistory saved
//   ↓
//ChatResponseDTO returned