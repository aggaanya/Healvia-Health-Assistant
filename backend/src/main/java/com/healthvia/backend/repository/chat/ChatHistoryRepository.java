package com.healthvia.backend.repository.chat;

import com.healthvia.backend.entity.ChatHistory;
import com.healthvia.backend.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    //stores the AI chatbot convo
    List<ChatHistory> findByUserId(Long userId);
    Page<ChatMessage> findByUserId(Long userId, Pageable pageable);

}