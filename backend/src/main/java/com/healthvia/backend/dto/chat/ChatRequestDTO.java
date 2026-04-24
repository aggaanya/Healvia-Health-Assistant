package com.healthvia.backend.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequestDTO {

    @NotBlank(message = "Message cannot be empty")
    @Size(max = 2000, message = "Message cannot exceed 2000 characters")
    private String message;

}

//Frontend
//   ↓
//POST /chat
//   ↓
//ChatRequestDTO
//   ↓
//ChatController
//   ↓
//ChatService
//   ↓
//AI Model
//   ↓
//ChatHistoryRepository
//   ↓
//Database