package com.healthvia.backend.service.chat;


import com.healthvia.backend.dto.chat.ChatRequestDTO;
import com.healthvia.backend.dto.chat.ChatResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatServiceInterface {
    ChatResponseDTO sendMessage(ChatRequestDTO request);

    Page<ChatResponseDTO> getChatHistory(Pageable pageable);
}

