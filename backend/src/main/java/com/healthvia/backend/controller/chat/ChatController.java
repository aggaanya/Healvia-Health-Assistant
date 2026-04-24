package com.healthvia.backend.controller.chat;

import com.healthvia.backend.dto.chat.ChatRequestDTO;
import com.healthvia.backend.dto.chat.ChatResponseDTO;
import com.healthvia.backend.service.chat.ChatServiceInterface;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatServiceInterface chatService;

    // =========================
    // SEND MESSAGE
    // =========================
    @PostMapping
    public ResponseEntity<ChatResponseDTO> sendMessage(
            @Valid @RequestBody ChatRequestDTO request
    ) {

        log.info("API CALL: Send chat message");

        ChatResponseDTO response = chatService.sendMessage(request);

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET CHAT HISTORY (PAGINATED)
    // =========================
    @GetMapping("/history")
    public ResponseEntity<Page<ChatResponseDTO>> getChatHistory(
            @PageableDefault(size = 10, sort = "timestamp") Pageable pageable
    ) {

        log.info("API CALL: Get chat history | page={}, size={}",
                pageable.getPageNumber(),
                pageable.getPageSize());

        Page<ChatResponseDTO> response = chatService.getChatHistory(pageable);

        return ResponseEntity.ok(response);
    }
}