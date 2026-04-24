package com.healthvia.backend.dto.document;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class MedicalDocumentResponseDTO {

    private Long id;

    private String fileName;

    private String fileType;

    private String fileUrl;

    private LocalDateTime uploadedAt;
    private String documentType;

    private String filePath;
}

//Database
//   ↓
//MedicalDocument Entity
//   ↓
//MedicalDocumentService
//   ↓
//MedicalDocumentResponseDTO
//   ↓
//Controller
//   ↓
//Frontend