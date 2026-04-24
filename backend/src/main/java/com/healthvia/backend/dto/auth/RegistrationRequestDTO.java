package com.healthvia.backend.dto.auth;


import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegistrationRequestDTO {

    ;
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @NotBlank(message = "email is required")
    @Email(message = "invalid email format")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 8, message = "password must be at least 8 characters")
    private String password;
}
//Frontend
//   ↓
//AuthController
//   ↓
//RegisterRequestDTO
//   ↓
//AuthService
//   ↓
//UserRepository
//   ↓
//Database