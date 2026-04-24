package com.healthvia.backend.dto.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {

    private Long userId;

    private String fullName;

    private String email;

    private String bio;

    private String profilePictureUrl;

    private String role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}