package com.healthvia.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;


@Builder
@Data
public class LoginRequestDTO {
    //through this annotation :: api response will be much clearer
    @NotBlank(message = "email is required")
    @Email(message = "invalid email format")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, message ="password must be of 6 characters")
    private String password;
}

//Controller
//   ↓
//DTO (LoginRequestDTO)
//   ↓
//Service
//   ↓
//Repository
//   ↓
//Database