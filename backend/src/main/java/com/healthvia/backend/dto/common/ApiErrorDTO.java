package com.healthvia.backend.dto.common;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorDTO {

    private String errorCode;

    private String message;

    private String path;

    private LocalDateTime timestamp;

}