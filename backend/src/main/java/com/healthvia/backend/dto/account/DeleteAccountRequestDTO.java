package com.healthvia.backend.dto.account;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeleteAccountRequestDTO {

    @NotBlank(message = "Password is required to delete account")
    private String password;
}