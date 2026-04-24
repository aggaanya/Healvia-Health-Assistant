package com.healthvia.backend.service.document;

import com.healthvia.backend.dto.document.MedicalDocumentResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface MedicalDocumentServiceInterface {

    MedicalDocumentResponseDTO uploadDocument(MultipartFile file, String documentType);

    List<MedicalDocumentResponseDTO> getUserDocuments();

    MedicalDocumentResponseDTO getDocumentById(Long documentId);

    void deleteDocument(Long documentId);
}


