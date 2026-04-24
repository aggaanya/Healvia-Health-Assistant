package com.healthvia.backend.controller.medicalDocument;


import com.healthvia.backend.dto.document.MedicalDocumentResponseDTO;
import com.healthvia.backend.service.document.MedicalDocumentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Slf4j
public class MedicalDocumentController {

    private final MedicalDocumentService documentService;

    // =========================
    // 📤 UPLOAD DOCUMENT
    // =========================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicalDocumentResponseDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType) {

        log.info("Uploading document: {}", file.getOriginalFilename());

        MedicalDocumentResponseDTO response =
                documentService.uploadDocument(file, documentType);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // =========================
    // 📄 GET ALL USER DOCUMENTS
    // =========================
    @GetMapping
    public ResponseEntity<List<MedicalDocumentResponseDTO>> getUserDocuments() {

        log.info("Fetching user documents");

        List<MedicalDocumentResponseDTO> documents =
                documentService.getUserDocuments();

        return ResponseEntity.ok(documents);
    }

    // =========================
    // 📄 GET DOCUMENT BY ID
    // =========================
    @GetMapping("/{documentId}")
    public ResponseEntity<MedicalDocumentResponseDTO> getDocumentById(
            @PathVariable Long documentId) {

        log.info("Fetching document with id: {}", documentId);

        MedicalDocumentResponseDTO document =
                documentService.getDocumentById(documentId);

        return ResponseEntity.ok(document);
    }

    // =========================
    // ❌ DELETE DOCUMENT
    // =========================
    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long documentId) {

        log.info("Deleting document with id: {}", documentId);

        documentService.deleteDocument(documentId);

        return ResponseEntity.noContent().build();
    }
}