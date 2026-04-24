package com.healthvia.backend.service.chat;

import com.healthvia.backend.dto.chat.ChatRequestDTO;
import com.healthvia.backend.dto.chat.ChatResponseDTO;
import com.healthvia.backend.entity.ChatMessage;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.exception.ResourceNotFoundException;
import com.healthvia.backend.repository.chat.ChatRepository;
import com.healthvia.backend.repository.user.UserRepository;
import com.healthvia.backend.service.chat.ChatBotService;
import com.healthvia.backend.service.chat.ChatServiceInterface;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatService implements ChatServiceInterface {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatBotService chatBotService;

    private static final String USER_NOT_FOUND = "User not found";

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(USER_NOT_FOUND));
    }

    @Override
    public ChatResponseDTO sendMessage(ChatRequestDTO request) {

        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        User user = getCurrentUser();

        log.info("Chat message received from userId={}", user.getId());

        String botReply = chatBotService.generateResponse(request.getMessage());

        ChatMessage chat = ChatMessage.builder()
                .user(user)
                .userMessage(request.getMessage())
                .botResponse(botReply)
                .timestamp(LocalDateTime.now())
                .build();

        chatRepository.save(chat);

        return mapToDTO(chat);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChatResponseDTO> getChatHistory(Pageable pageable) {

        User user = getCurrentUser();

        return chatRepository.findByUser_Id(user.getId(), pageable)
                .map(this::mapToDTO);

    }

    private ChatResponseDTO mapToDTO(ChatMessage chat) {
        return ChatResponseDTO.builder()
                .userMessage(chat.getUserMessage())
                .botResponse(chat.getBotResponse())
                .timestamp(chat.getTimestamp())
                .build();
    }
}