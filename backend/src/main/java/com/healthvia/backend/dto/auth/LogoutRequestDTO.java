package com.healthvia.backend.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  //automatically generates getter(), setter()
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogoutRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

}