package com.healthvia.backend.dto.user;



import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserProfileRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 120, message = "Invalid age")
    private Integer age;

    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "Invalid gender")
    private String gender;
}