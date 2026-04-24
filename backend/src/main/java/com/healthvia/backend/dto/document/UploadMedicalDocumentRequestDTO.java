package com.healthvia.backend.dto.document;



import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadMedicalDocumentRequestDTO {

    @NotNull(message = "File is required")
    private MultipartFile file;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

}

//Frontend
//   ↓
//POST /documents/upload
//   ↓
//UploadMedicalDocumentRequestDTO
//   ↓
//DocumentController
//   ↓
//DocumentService
//   ↓
//File storage (local / S3)
//   ↓
//MedicalDocumentRepository
//   ↓
//Database