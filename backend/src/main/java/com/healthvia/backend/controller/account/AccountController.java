package com.healthvia.backend.controller.account;

import com.healthvia.backend.dto.account.*;
import com.healthvia.backend.entity.User;
import com.healthvia.backend.service.account.AccountService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@Slf4j
public class AccountController {

    private final AccountService accountService;

    // =========================
    // PROFILE
    // =========================

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponseDTO> getProfile(Authentication authentication) {

        Long userId = getUserIdFromAuth(authentication);

        log.info("GET /profile for userId: {}", userId);

        return ResponseEntity.ok(accountService.getProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponseDTO> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequestDTO request) {

        Long userId = getUserIdFromAuth(authentication);

        log.info("PUT /profile for userId: {}", userId);

        return ResponseEntity.ok(accountService.updateProfile(userId, request));
    }

    // =========================
    // SECURITY
    // =========================

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequestDTO request) {

        Long userId = getUserIdFromAuth(authentication);

        log.info("PUT /change-password for userId: {}", userId);

        accountService.changePassword(userId, request);

        return ResponseEntity.ok("Password updated successfully");
    }

    // =========================
    // SETTINGS
    // =========================

    @PutMapping("/privacy")
    public ResponseEntity<String> updatePrivacySettings(
            Authentication authentication,
            @Valid @RequestBody PrivacySettingsDTO request) {

        Long userId = getUserIdFromAuth(authentication);

        log.info("PUT /privacy for userId: {}", userId);

        accountService.updatePrivacySettings(userId, request);

        return ResponseEntity.ok("Privacy settings updated successfully");
    }

    // =========================
    // ACCOUNT ACTIONS
    // =========================

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(
            Authentication authentication,
            @Valid @RequestBody DeleteAccountRequestDTO request) {

        Long userId = getUserIdFromAuth(authentication);

        log.warn("DELETE /delete for userId: {}", userId);

        accountService.deleteAccount(userId, request);

        return ResponseEntity.ok("Account deleted successfully");
    }

    @PostMapping("/export")
    public ResponseEntity<User> exportUserData(
            Authentication authentication,
            @RequestBody DataExportRequestDTO request) {

        Long userId = getUserIdFromAuth(authentication);

        log.info("POST /export for userId: {}", userId);

        return ResponseEntity.ok(accountService.exportUserData(userId, request));
    }

    // =========================
    // DASHBOARD
    // =========================

    @GetMapping("/stats")
    public ResponseEntity<AccountStatsDTO> getAccountStats(Authentication authentication) {

        Long userId = getUserIdFromAuth(authentication);

        log.info("GET /stats for userId: {}", userId);

        return ResponseEntity.ok(accountService.getAccountStats(userId));
    }

    // =========================
    // HELPER METHOD
    // =========================

    private Long getUserIdFromAuth(Authentication authentication) {

        /*
         authentication.getName() → email (from JWT)
         You must fetch user using email
        */

        String email = authentication.getName();

        // ⚠️ You need to add this method in UserRepository
        // Optional<User> findByEmail(String email)

        return accountService.getUserIdByEmail(email);
    }
}