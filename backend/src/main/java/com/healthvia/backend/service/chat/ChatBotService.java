package com.healthvia.backend.service.chat;

import org.springframework.stereotype.Service;

@Service
public class ChatBotService {

    public String generateResponse(String message) {

        // 🔥 Replace this with OpenAI/Gemini later
        if (message == null || message.isBlank()) {
            return "Please enter a valid message.";
        }

        String msg = message.toLowerCase();

        if (msg.contains("fever")) {
            return "Monitor your temperature and consult a doctor if it persists.";
        }

        if (msg.contains("headache")) {
            return "Stay hydrated and rest. If severe, seek medical advice.";
        }

        return "I'm here to help with your health-related questions.";
    }
}