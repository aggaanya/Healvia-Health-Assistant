package com.healthvia.backend.service.document;

import com.healthvia.backend.dto.document.MedicalDocumentResponseDTO;
import com.healthvia.backend.entity.MedicalDocument;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.repository.document.MedicalDocumentRepository;
import com.healthvia.backend.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MedicalDocumentService implements MedicalDocumentServiceInterface {

    private final MedicalDocumentRepository documentRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/";

    // =========================
    // 🔐 GET CURRENT USER (JWT)
    // =========================
    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }

    // =========================
    // 📤 UPLOAD DOCUMENT
    // =========================
    @Override
    public MedicalDocumentResponseDTO uploadDocument(MultipartFile file, String documentType) {

        Long userId = getCurrentUserId();

        if (file.isEmpty()) {
            throw new RuntimeException("File cannot be empty");
        }

        try {
            // Create directory
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save file
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Get user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Save document
            MedicalDocument document = MedicalDocument.builder()
                    .user(user)
                    .fileName(fileName)
                    .filePath(filePath.toString())
                    .documentType(documentType)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            documentRepository.save(document);

            log.info("Document uploaded for userId: {}", userId);

            return mapToDTO(document);

        } catch (IOException e) {
            throw new RuntimeException("File upload failed", e);
        }
    }

    // =========================
    // 📄 GET USER DOCUMENTS
    // =========================
    @Override
    @Transactional(readOnly = true)
    public List<MedicalDocumentResponseDTO> getUserDocuments() {

        Long userId = getCurrentUserId();

        return documentRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // =========================
    // 📄 GET DOCUMENT BY ID
    // =========================
    @Override
    @Transactional(readOnly = true)
    public MedicalDocumentResponseDTO getDocumentById(Long documentId) {

        Long userId = getCurrentUserId();

        MedicalDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Security check
        if (document.getUser().getId() != userId) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToDTO(document);
    }

    // =========================
    // ❌ DELETE DOCUMENT
    // =========================
    @Override
    public void deleteDocument(Long documentId) {

        Long userId = getCurrentUserId();

        MedicalDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Security check
        if (document.getUser().getId() != userId) {
            throw new RuntimeException("Unauthorized action");
        }

        try {
            Path filePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("File deletion failed, continuing...");
        }

        documentRepository.delete(document);

        log.info("Document deleted: {}", documentId);
    }

    // =========================
    // 🔄 MAPPER
    // =========================
    private MedicalDocumentResponseDTO mapToDTO(MedicalDocument doc) {
        return MedicalDocumentResponseDTO.builder()
                .id(doc.getId())
                .fileName(doc.getFileName())
                .filePath(doc.getFilePath())
                .documentType(doc.getDocumentType())
                .uploadedAt(doc.getUploadedAt())
                .build();
    }
}