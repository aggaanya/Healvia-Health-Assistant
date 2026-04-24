package com.healthvia.backend.repository.chat;



import com.healthvia.backend.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findByUser_Id(Long userId, Pageable pageable);
}