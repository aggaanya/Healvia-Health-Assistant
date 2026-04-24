package com.healthvia.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {

    private String accessToken;

    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long userId;

    private String email;

    private String role;
    private Long expiresIn;
}

//Frontend
//   ↓
//AuthController
//   ↓
//LoginRequestDTO
//   ↓
//AuthService
//   ↓
//UserRepository
//   ↓
//JWT generated
//   ↓
//AuthResponseDTO returned